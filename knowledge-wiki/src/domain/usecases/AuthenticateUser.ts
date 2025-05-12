import { User } from '../entities/User';
import { authApi } from '../../data/api/api';

export class AuthenticateUser {

    async execute(credentials: { username: string; password: string }): Promise<User> {
        try {
            const response = await authApi.login(credentials);
            if (response.data) {
                return response.data;
            }
            throw new Error('Dados de usuário não encontrados.');
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || 'Erro ao autenticar o usuário');
        }
    }
}
