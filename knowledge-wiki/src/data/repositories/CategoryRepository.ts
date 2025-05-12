import { Category } from '../../domain/entities/Category';
import { categoryApi } from '../api/api';

export class CategoryRepository {
    async getCategories(): Promise<Category[]> {
        try {
            const response = await categoryApi.getCategories();
            return response.data;
        } catch (error) {
            throw new Error('Erro ao obter categorias');
        }
    }

    async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
        try {
            const response = await categoryApi.createCategory(category);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao criar categoria');
        }
    }
}