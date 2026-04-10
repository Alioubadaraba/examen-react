import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../services/article.service';

export default function ArticleForm() {
  const { id }    = useParams();
  const isEdit    = !!id;
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    titre: '', contenu: '', is_public: true, allow_comments: true,
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      articleService.getById(id)
        .then((data) => setForm({
          titre:          data.article.titre,
          contenu:        data.article.contenu,
          is_public:      data.article.is_public,
          allow_comments: data.article.allow_comments,
        }))
        .catch((err) => setError(err.message));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await articleService.update(id, form);
      } else {
        await articleService.create(form);
      }
      navigate('/');
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

  const switchStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.88rem',
    color: '#555',
    cursor: 'pointer',
  };

  return (
    <div className="container py-4">
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--noir)' }}>
            {isEdit ? "Modifier l'article" : 'Nouvel article'}
          </h2>
          <p style={{ color: 'var(--texte-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            {isEdit ? 'Modifiez les informations de votre article' : 'Rédigez et publiez votre article'}
          </p>
        </div>

        {/* Card */}
        <div className="card-custom" style={{ padding: '2rem' }}>

          {error && (
            <div className="alert-custom mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label style={labelStyle}>Titre</label>
              <input
                type="text"
                name="titre"
                className="form-control-custom"
                placeholder="Donnez un titre accrocheur..."
                value={form.titre}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Contenu</label>
              <textarea
                name="contenu"
                className="form-control-custom"
                rows={12}
                placeholder="Rédigez votre article ici..."
                value={form.contenu}
                onChange={handleChange}
                required
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            {/* Options */}
            <div style={{
              background: '#fafafa',
              border: '1px solid var(--gris-bord)',
              borderRadius: '6px',
              padding: '1rem 1.2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
            }}>
              <label style={switchStyle}>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={form.is_public}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--rouge)', width: 16, height: 16 }}
                />
                Article public
              </label>
              <label style={switchStyle}>
                <input
                  type="checkbox"
                  name="allow_comments"
                  checked={form.allow_comments}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--rouge)', width: 16, height: 16 }}
                />
                Autoriser les commentaires
              </label>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                type="submit"
                className="btn-rouge"
                disabled={loading}
                style={{ padding: '0.65rem 1.5rem' }}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm me-2" />
                )}
                {isEdit ? 'Enregistrer' : 'Publier'}
              </button>
              <button
                type="button"
                className="btn-outline-rouge"
                onClick={() => navigate(-1)}
                style={{ padding: '0.65rem 1.5rem' }}
              >
                Annuler
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}