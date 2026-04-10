import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleService, commentService } from '../services/article.service';
import { likeService } from '../services/article.service';
import { useAuth } from '../context/AuthContext';

export default function ArticleDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [article, setArticle]         = useState(null);
  const [comments, setComments]       = useState([]);
  const [newComment, setNewComment]   = useState('');
  const [loading, setLoading]         = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError]             = useState('');
  const [liked, setLiked]             = useState(false);
  const [likeCount, setLikeCount]     = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artData, cmtData, likeData] = await Promise.all([
          articleService.getById(id),
          commentService.getByArticle(id),
          likeService.getLikes(id),
        ]);
        setArticle(artData.article);
        setComments(cmtData.comments || []);
        setLiked(likeData.liked);
        setLikeCount(likeData.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      const data = await likeService.toggle(id);
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet article ?')) return;
    await articleService.delete(id);
    navigate('/');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitLoading(true);
    try {
      const data = await commentService.create(id, { contenu: newComment });
      setComments((prev) => [...prev, data.comment]);
      setNewComment('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    await commentService.delete(id, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border spinner-rouge" />
    </div>
  );

  if (error) return (
    <div className="container py-4">
      <div className="alert-custom">{error}</div>
    </div>
  );

  if (!article) return null;

  const isOwner = user?.id === article.user_id;

  return (
    <div className="container py-4">
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--texte-muted)',
            fontSize: '0.88rem',
            cursor: 'pointer',
            marginBottom: '1.2rem',
            padding: 0,
          }}
        >
          ← Retour
        </button>

        {/* Article */}
        <div className="card-custom" style={{ padding: '2rem', marginBottom: '1.5rem' }}>

          {/* Badges + Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span className={article.is_public ? 'badge-public' : 'badge-prive'}>
                {article.is_public ? 'Public' : 'Privé'}
              </span>
              {article.allow_comments && (
                <span className="badge-comments">Commentaires ouverts</span>
              )}
            </div>
            {isOwner && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/articles/${id}/edit`}
                  className="btn-outline-rouge"
                  style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '0.3rem 0.8rem' }}
                >
                  Modifier
                </Link>
                <button
                  onClick={handleDelete}
                  style={{
                    background: 'none',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.82rem',
                    color: '#999',
                    cursor: 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>

          {/* Titre */}
          <h1 style={{ fontWeight: 700, fontSize: '1.7rem', color: 'var(--noir)', marginBottom: '0.5rem' }}>
            {article.titre}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                {article.author_username?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.88rem', color: 'var(--texte-muted)' }}>
                <strong style={{ color: 'var(--noir)' }}>{article.author_username}</strong>
              </span>
            </div>
            <span style={{ color: '#ddd' }}>|</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--texte-muted)' }}>
              {formatDate(article.created_at)}
            </span>
          </div>

          {/* Séparateur */}
          <div style={{ borderTop: '1px solid var(--gris-bord)', marginBottom: '1.5rem' }} />

          {/* Contenu */}
          <div className="article-content">
            {article.contenu}
          </div>

          {/* Séparateur */}
          <div style={{ borderTop: '1px solid var(--gris-bord)', marginTop: '1.5rem', paddingTop: '1rem' }}>
            <button
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {liked ? '♥' : '♡'} {likeCount} {likeCount > 1 ? 'likes' : 'like'}
            </button>
          </div>

        </div>

        {/* Commentaires */}
        {article.allow_comments && (
          <div className="card-custom" style={{ padding: '1.5rem' }}>

            {/* Header commentaires */}
            <div className="card-header-custom" style={{ marginBottom: '1.2rem', paddingLeft: 0, paddingTop: 0 }}>
              Commentaires{' '}
              <span style={{
                background: 'var(--rouge)',
                color: '#fff',
                borderRadius: '10px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.75rem',
                marginLeft: '0.4rem',
              }}>
                {comments.length}
              </span>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: '1.5rem' }}>
              <textarea
                className="form-control-custom"
                rows={3}
                placeholder="Écrire un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '0.6rem' }}
              />
              <button
                type="submit"
                className="btn-rouge"
                disabled={submitLoading}
                style={{ padding: '0.45rem 1.2rem', fontSize: '0.88rem' }}
              >
                {submitLoading && (
                  <span className="spinner-border spinner-border-sm me-2" />
                )}
                Commenter
              </button>
            </form>

            {/* Liste commentaires */}
            {comments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--texte-muted)', padding: '1.5rem 0', fontSize: '0.9rem' }}>
                Soyez le premier à commenter !
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} style={{
                  borderBottom: '1px solid var(--gris-bord)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                        {c.author_username?.[0]?.toUpperCase()}
                      </div>
                      <strong style={{ fontSize: '0.88rem' }}>{c.author_username}</strong>
                      <span style={{ color: '#ccc', fontSize: '0.75rem' }}>
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                    {(user?.id === c.user_id || isOwner) && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ccc',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.color = 'var(--rouge)'}
                        onMouseOut={(e) => e.target.style.color = '#ccc'}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#444', margin: 0, whiteSpace: 'pre-wrap', paddingLeft: '2rem' }}>
                    {c.contenu}
                  </p>
                </div>
              ))
            )}

          </div>
        )}

      </div>
    </div>
  );
}