import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleApi } from '../../data/api/api';
import { Article } from '../../domain/entities/Article';
import MarkdownViewer from '../../components/MarkdownViewer/MarkdownViewer';
import Button from '../../components/Button/Button';
import styles from './ArticleView.module.css';

const ArticleView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            try {
                const response = await articleApi.getArticle(id);
                setArticle(response.data);
            } catch (error) {
                setError('Erro ao buscar artigo. Tente novamente.');
                console.error('Erro ao buscar artigo:', error);
            }
        };
        fetchArticle();
    }, [id]);

    if (error) return <div className={styles.error}>{error}</div>;
    if (!article) return <div className={styles.loading}>Carregando...</div>;

    return (
        <div className={styles.articleView}>
            <h1>{article.title}</h1>
            <div className={styles.metadata}>
                <div><strong>Autor:</strong> {article.authorId}</div>
                <div><strong>Data:</strong> {article.createdAt}</div>
            </div>
            <div className={styles.content}>
                <MarkdownViewer content={article.content} />
            </div>
            <Button variant="primary" onClick={() => navigate(`/article/edit/${id}`)}>
                Editar
            </Button>
        </div>
    );
};

export default ArticleView;
