import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { articleApi, categoryApi } from '../../data/api/api';
import { Article } from '../../domain/entities/Article';
import { Category } from '../../domain/entities/Category';
import styles from './WikiHome.module.css';
import { debounce } from '@/utils/debounce';

const WikiHome: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articlesRes, categoriesRes] = await Promise.all([
                    articleApi.getArticles(),
                    categoryApi.getCategories(),
                ]);
                setArticles(articlesRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                setError('Erro ao carregar artigos ou categorias.');
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, 500);

    const filteredArticles = articles.filter(
        (article) =>
            article.title.toLowerCase().includes(search.toLowerCase()) &&
            (selectedCategory ? article.categoryId === selectedCategory : true),
    );

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    return (
        <div className={styles.wikiHome}>
            <div className={styles.sidebar}>
                <h2>Categorias</h2>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Todas as Categorias</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <Button variant="secondary" onClick={() => navigate('/article/edit')}>
                    Novo Artigo
                </Button>
            </div>
            <div className={styles.main}>
                <input
                    type="text"
                    placeholder="Buscar artigos..."
                    value={search}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.articleList}>
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className={styles.articleCard}
                            onClick={() => navigate(`/article/${article.id}`)}
                        >
                            <h3>{article.title}</h3>
                            <p>{article.content.substring(0, 100)}...</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WikiHome;
