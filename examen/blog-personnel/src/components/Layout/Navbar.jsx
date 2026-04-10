import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand" to="/">
          Mon<span>Blog</span>
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ color: '#aaa' }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/')}`} to="/">
                    Tableau de bord
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/articles/new')}`} to="/articles/new">
                    Nouvel article
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/amis')}`} to="/amis">
                    Mes amis
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto align-items-center gap-3">
                <li className="nav-item">
                  <span className="user-greeting">
                    Bonjour, <strong>{user?.username}</strong>
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn-logout" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Connexion</Link>
              </li>
              <li className="nav-item">
                <Link className="btn-rouge" to="/register"
                  style={{ textDecoration: 'none', padding: '0.4rem 1rem', borderRadius: '4px' }}
                >
                  S'inscrire
                </Link>
              </li>
            </ul>
          )}
        </div>

      </div>
    </nav>
  );
}