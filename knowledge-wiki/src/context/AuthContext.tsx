import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../domain/entities/User';
import { AuthenticateUser } from '../domain/usecases/AuthenticateUser';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            setUser({ id: 'mock', username: 'mock@wiki.com', token });
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const authUseCase = new AuthenticateUser();
            const userData = await authUseCase.execute({ username, password });
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('token', userData.token);
        } catch (error) {
            throw new Error('Credenciais inválidas');
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};