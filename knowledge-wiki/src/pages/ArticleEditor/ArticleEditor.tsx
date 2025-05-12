import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleApi, categoryApi } from '../../data/api/api';
import { Category } from '../../domain/entities/Category';
import Button from '../../components/Button/Button';
import styles from './ArticleEditor.module.css';

const ArticleEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await categoryApi.getCategories();
                setCategories(categoriesRes.data);

                if (id) {
                    const articleRes = await articleApi.getArticle(id);
                    const article = articleRes.data;
                    setTitle(article.title);
                    setContent(article.content);
                    setCategoryId(article.categoryId);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setError('Erro ao carregar dados. Tente novamente.');
            }
        };
        fetchData();
    }, [id]);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!title) errors.title = 'Título é obrigatório';
        if (!content) errors.content = 'Conteúdo é obrigatório';
        if (!categoryId) errors.categoryId = 'Categoria é obrigatória';

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        try {
            const articleData = { title, content, categoryId };
            if (id) {
                await articleApi.updateArticle(id, articleData);
            } else {
                await articleApi.createArticle(articleData);
            }
            navigate('/');
        } catch (error) {
            setError('Erro ao salvar artigo');
        }
    };

    return (
        <div className={styles.articleEditor}>
            <h1>{id ? 'Editar Artigo' : 'Novo Artigo'}</h1>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Título</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Digite o título"
                    />
                    {fieldErrors.title && <p className={styles.error}>{fieldErrors.title}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="category">Categoria</label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.categoryId && <p className={styles.error}>{fieldErrors.categoryId}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">Conteúdo</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Digite o conteúdo (Markdown)"
                        rows={10}
                    />
                    {fieldErrors.content && <p className={styles.error}>{fieldErrors.content}</p>}
                </div>
                <Button type="submit" variant="primary">
                    Salvar
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                    Cancelar
                </Button>
            </form>
        </div>
    );
};

export default ArticleEditor;
