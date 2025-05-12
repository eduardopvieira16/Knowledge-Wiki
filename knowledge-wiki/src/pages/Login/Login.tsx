import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import { validateEmail, validatePassword } from '../../utils/validators';
import styles from './Login.module.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateEmail(email)) {
            setError('Formato de email inválido');
            setLoading(false);
            return;
        }
        if (!validatePassword(password)) {
            setError('A senha deve ter pelo menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            await authContext?.login(email, password);
            navigate('/');
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1>KNOWLEDGE WIKI</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            className={error && !validateEmail(email) ? styles.errorInput : ''}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            className={error && !validatePassword(password) ? styles.errorInput : ''}
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Carregando...' : 'Entrar'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
