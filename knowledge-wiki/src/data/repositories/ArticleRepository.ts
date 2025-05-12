import { Article } from '../../domain/entities/Article';
import { articleApi } from '../api/api';

export class ArticleRepository {
    async getArticles(): Promise<Article[]> {
        try {
            const response = await articleApi.getArticles();
            return response.data;
        } catch (error) {
            throw new Error('Erro ao obter artigos');
        }
    }

    async getArticle(id: string): Promise<Article> {
        try {
            const response = await articleApi.getArticle(id);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao obter artigo com ID ${id}`);
        }
    }

    async createArticle(article: Omit<Article, 'id' | 'authorId' | 'createdAt'>): Promise<Article> {
        try {
            const response = await articleApi.createArticle(article);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao criar artigo');
        }
    }

    async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
        try {
            const response = await articleApi.updateArticle(id, article);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao atualizar artigo com ID ${id}`);
        }
    }

    async deleteArticle(id: string): Promise<void> {
        try {
            await articleApi.deleteArticle(id);
        } catch (error) {
            throw new Error(`Erro ao excluir artigo com ID ${id}`);
        }
    }
}