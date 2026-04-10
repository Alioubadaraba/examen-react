import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { likeService } from '../../services/article.service';

export default function ArticleCard({ article, onDelete }) {
  const { user } = useAuth();
  const isOwner  = user?.id === article.user_id;

  const [liked, setLiked]         = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    likeService.getLikes(article.id)
      .then((data) => {
        setLiked(data.liked);
        setLikeCount(data.count);
      })
      .catch(() => {});
  }, [article.id]);

  const handleLike = async () => {
    try {
      const data = await likeService.toggle(article.id);
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

  return (
    <div className="article-card">

      {/* Badges + Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <span className={article.is_public ? 'badge-public' : 'badge-prive'}>
            {article.is_public ? 'Public' : 'Privé'}
          </span>
          {article.allow_comments && (
            <span className="badge-comments">Commentaires</span>
          )}
        </div>
        <small style={{ color: '#aaa', fontSize: '0.78rem' }}>
          {formatDate(article.created_at)}
        </small>
      </div>

      {/* Titre */}
      <h5 className="article-card-title">{article.titre}</h5>

      {/* Auteur */}
      <p className="article-card-author">
        Par <strong>{article.author_username || 'vous'}</strong>
      </p>

      {/* Extrait */}
      <p className="article-card-excerpt">
        {article.contenu?.substring(0, 120)}
        {article.contenu?.length > 120 ? '...' : ''}
      </p>

      {/* Like */}
      <div style={{ marginTop: '1rem' }}>
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {liked ? '♥' : '♡'} {likeCount} {likeCount > 1 ? 'likes' : 'like'}
        </button>
      </div>

      {/* Actions */}
      <div className="article-card-footer">
        <Link
          to={`/articles/${article.id}`}
          className="btn-rouge"
          style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '0.4rem 0.9rem', flex: 1, textAlign: 'center' }}
        >
          Lire
        </Link>
        {isOwner && (
          <>
            <Link
              to={`/articles/${article.id}/edit`}
              className="btn-outline-rouge"
              style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
            >
              Modifier
            </Link>
            <button
              style={{
                background: 'none',
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '0.4rem 0.7rem',
                fontSize: '0.85rem',
                color: '#999',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.target.style.borderColor = 'var(--rouge)'; e.target.style.color = 'var(--rouge)'; }}
              onMouseOut={(e) => { e.target.style.borderColor = '#eee'; e.target.style.color = '#999'; }}
              onClick={() => onDelete && onDelete(article.id)}
            >
              Supprimer
            </button>
          </>
        )}
      </div>

    </div>
  );
}