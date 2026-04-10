import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';
import ArticleForm from './pages/ArticleForm';
import Friends from './pages/Amis';
import Footer from './components/Layout/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/articles/new" element={
              <PrivateRoute>
                <ArticleForm />
              </PrivateRoute>
            } />
            <Route path="/articles/:id/edit" element={
              <PrivateRoute>
                <ArticleForm />
              </PrivateRoute>
            } />
            <Route path="/articles/:id" element={
              <PrivateRoute>
                <ArticleDetail />
              </PrivateRoute>
            } />
            <Route path="/amis" element={
              <PrivateRoute>
                <Friends />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
         <Footer />   {/* ← ajouter ici */}
         </Router>
    </AuthProvider>
  );
}

export default App;