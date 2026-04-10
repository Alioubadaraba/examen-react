import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <h1>Mon<span>Blog</span></h1>
          <p>Connectez-vous à votre espace</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="alert-custom mb-4">{error}</div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.4rem', display: 'block' }}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              className="form-control-custom w-100"
              placeholder="Votre username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div className="mb-4">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.4rem', display: 'block' }}>
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              className="form-control-custom"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            className="btn-rouge w-100"
            disabled={loading}
            style={{ width: '100%', padding: '0.7rem', fontSize: '0.95rem' }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : null}
            Se connecter
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: 'var(--rouge)', fontWeight: 600, textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </p>

      </div>
    </div>
  );
}