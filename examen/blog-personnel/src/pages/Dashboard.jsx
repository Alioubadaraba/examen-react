import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/article.service';
import ArticleCard from '../components/articles/ArticleCard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('tous');
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getAll();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      await articleService.delete(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = articles.filter((a) => {
    if (filter === 'moi')  return a.user_id === user?.id;
    if (filter === 'amis') return a.user_id !== user?.id;
    return true;
  });

  const filtres = [
    { key: 'tous',  label: 'Tous' },
    { key: 'moi',   label: 'Mes articles' },
    { key: 'amis',  label: 'Mes amis' },
  ];

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Tableau de bord</h2>
          <p>Bienvenue, {user?.nom_complet} !</p>
        </div>
        <Link to="/articles/new" className="btn-rouge" style={{ textDecoration: 'none' }}>
          + Nouvel article
        </Link>
      </div>

      {/* Filtres */}
      <div className="filtres">
        {filtres.map((f) => (
          <button
            key={f.key}
            className={`filtre-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border spinner-rouge" />
        </div>
      ) : error ? (
        <div className="alert-custom">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>Aucun article à afficher.</p>
          {filter === 'tous' && (
            <Link to="/articles/new" className="btn-rouge" style={{ textDecoration: 'none' }}>
              Créer votre premier article
            </Link>
          )}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filtered.map((article) => (
            <div key={article.id} className="col">
              <ArticleCard article={article} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}