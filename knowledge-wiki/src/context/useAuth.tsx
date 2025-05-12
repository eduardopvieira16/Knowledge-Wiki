import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return authContext.isAuthenticated;
};

export default useAuth;
