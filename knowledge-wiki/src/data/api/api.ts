import { AxiosResponse } from 'axios';

// Dados mockados
const mockUsers = [
    { id: '1', username: 'admin@wiki.com', password: '123456', token: 'mock-jwt-admin' },
    { id: '2', username: 'user@wiki.com', password: 'user123', token: 'mock-jwt-user' },
];

const mockArticles = [
    {
        id: '1',
        title: 'Introdução ao React',
        content: '# React\nFramework JavaScript para interfaces...',
        categoryId: '1',
        authorId: '1',
        createdAt: '2025-04-30',
    },
    {
        id: '2',
        title: 'TypeScript Básico',
        content: '# TypeScript\nLinguagem tipada para JavaScript...',
        categoryId: '2',
        authorId: '2',
        createdAt: '2025-04-30',
    },
];

const mockCategories = [
    { id: '1', name: 'Frontend' },
    { id: '2', name: 'Backend' },
];

const simulateApiCall = (method: string, url: string, data?: any): AxiosResponse => {
    const responseData = {
        '/auth/login': () => {
            const user = mockUsers.find((u) => u.username === data.username && u.password === data.password);
            if (user) {
                return { data: user, status: 200 };
            }
            throw new Error('Credenciais inválidas');
        },
        '/articles': () => {
            if (method === 'GET') return { data: mockArticles, status: 200 };
            if (method === 'POST') {
                const newArticle = { ...data, id: String(mockArticles.length + 1), authorId: '1', createdAt: new Date().toISOString().split('T')[0] };
                mockArticles.push(newArticle);
                return { data: newArticle, status: 201 };
            }
            throw new Error('Método não suportado para /articles');
        },
        '/categories': () => {
            if (method === 'GET') return { data: mockCategories, status: 200 };
            if (method === 'POST') {
                const newCategory = { ...data, id: String(mockCategories.length + 1) };
                mockCategories.push(newCategory);
                return { data: newCategory, status: 201 };
            }
            throw new Error('Método não suportado para /categories');
        },
        '/articles/{id}': () => {
            const articleId = url.split('/')[2];
            if (method === 'GET') {
                const article = mockArticles.find((a) => a.id === articleId);
                if (article) return { data: article, status: 200 };
                throw new Error('Artigo não encontrado');
            }
            if (method === 'PUT') {
                const articleIndex = mockArticles.findIndex((a) => a.id === articleId);
                if (articleIndex !== -1) {
                    mockArticles[articleIndex] = { ...mockArticles[articleIndex], ...data };
                    return { data: mockArticles[articleIndex], status: 200 };
                }
                throw new Error('Artigo não encontrado para atualização');
            }
            if (method === 'DELETE') {
                const articleIndex = mockArticles.findIndex((a) => a.id === articleId);
                if (articleIndex !== -1) {
                    mockArticles.splice(articleIndex, 1);
                    return { data: {}, status: 204 };
                }
                throw new Error('Artigo não encontrado para exclusão');
            }
            throw new Error('Método não suportado para /articles/{id}');
        },
    };

    const handler = responseData[url] || responseData[url.split('/')[0] + '/*'];
    if (handler) {
        return handler();
    }
    throw new Error('Endpoint não encontrado');
};

// API Mock
const api = {
    post: async (url: string, data: any): Promise<AxiosResponse> => simulateApiCall('POST', url, data),
    get: async (url: string): Promise<AxiosResponse> => simulateApiCall('GET', url),
    put: async (url: string, data: any): Promise<AxiosResponse> => simulateApiCall('PUT', url, data),
    delete: async (url: string): Promise<AxiosResponse> => simulateApiCall('DELETE', url),
};

export const authApi = {
    login: (credentials: { username: string; password: string }) =>
        api.post('/auth/login', credentials),
};

export const articleApi = {
    getArticles: () => api.get('/articles'),
    getArticle: (id: string) => api.get(`/articles/${id}`),
    createArticle: (article: { title: string; content: string; categoryId: string }) =>
        api.post('/articles', article),
    updateArticle: (id: string, article: { title: string; content: string; categoryId: string }) =>
        api.put(`/articles/${id}`, article),
    deleteArticle: (id: string) => api.delete(`/articles/${id}`),
};

export const categoryApi = {
    getCategories: () => api.get('/categories'),
    createCategory: (category: { name: string }) => api.post('/categories', category),
};

export default api;
