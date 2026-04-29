import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError('Erreur lors de l\'inscription ou email déjà utilisé');
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="form-container" style={{ width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Inscription</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            S'inscrire
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Déjà un compte ? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
