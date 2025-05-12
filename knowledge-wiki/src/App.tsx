import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import AppRoutes from './routes/AppRoutes';
import WikiHome from './pages/WikiHome/WikiHome';
import ArticleView from './pages/ArticleView/ArticleView';
import ArticleEditor from './pages/ArticleEditor/ArticleEditor';


const App: React.FC = () => {
    return (
        <div className="app">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<AppRoutes />}>
                    <Route path="/" element={<WikiHome />} />
                    <Route path="/article/:id" element={<ArticleView />} />
                    <Route path="/article/edit/:id?" element={<ArticleEditor />} />
                </Route>
            </Routes>
        </div>
    );
};

export default App;