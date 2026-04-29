import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">MadaÉvasion</Link>
        <div className="nav-links">
          <Link to="/">Accueil</Link>
          <a href="/#circuits">Nos circuits</a>
          <a href="/#contact">Contact</a>
          {token ? (
            <>
              <Link to="/dashboard">Tableau de bord</Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register" className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
