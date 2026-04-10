import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function Register() {
  const [form, setForm] = useState({
    nom_complet: '', username: '', password: '', confirm: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('Les mots de passe ne correspondent pas.');
    }
    setLoading(true);
    try {
      await authService.register({
        nom_complet: form.nom_complet,
        username:    form.username,
        password:    form.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#333',
    marginBottom: '0.4rem',
    display: 'block',
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>

        {/* Logo */}
        <div className="auth-logo">
          <h1>Mon<span>Blog</span></h1>
          <p>Créez votre compte gratuitement</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="alert-custom mb-4">{error}</div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={labelStyle}>Nom complet</label>
            <input
              type="text"
              name="nom_complet"
              className="form-control-custom"
              placeholder="Ex : Moussa Diallo"
              value={form.nom_complet}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              className="form-control-custom"
              placeholder="Ex : moussa_d"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control-custom"
              placeholder="Minimum 6 caractères"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{ width: '100%' }}
            />
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirm"
              className="form-control-custom"
              placeholder="Répétez votre mot de passe"
              value={form.confirm}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            className="btn-rouge"
            disabled={loading}
            style={{ width: '100%', padding: '0.7rem', fontSize: '0.95rem' }}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            Créer mon compte
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: 'var(--rouge)', fontWeight: 600, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}