import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [circuits, setCircuits] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/circuits')
      .then(res => setCircuits(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleReservation = async (circuitId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reservations',
        { circuitId, date: new Date().toISOString().split('T')[0] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Demande de réservation envoyée avec succès ! Un e-mail de confirmation vous a été envoyé.');
      navigate('/dashboard');
    } catch (err) {
      alert('Erreur lors de la réservation');
    }
  };

  return (
    <div>
      <section id="accueil" className="hero">
        <div className="container">
          <h1>Évadez-vous à Madagascar</h1>
          <p>Découvrez des paysages époustouflants et vivez des aventures inoubliables avec MadaÉvasion, votre agence de voyage de confiance.</p>
          <a href="#circuits" className="btn btn-primary" style={{ marginTop: '1rem' }}>Voir nos circuits</a>
        </div>
      </section>

      <section id="circuits" className="container circuits-grid">
        {circuits.map(circuit => (
          <div key={circuit.id} className="circuit-card">
            <img src={circuit.imageUrl} alt={circuit.title} className="circuit-img" />
            <div className="circuit-content">
              <h3 className="circuit-title">{circuit.title}</h3>
              <p className="circuit-desc">{circuit.description}</p>
              <div className="circuit-meta">
                <span>⏱ {circuit.duration}</span>
                <span className="circuit-price">{circuit.price} €</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => alert('Détails du circuit : ' + circuit.description + '\nDurée : ' + circuit.duration + '\nPrix : ' + circuit.price + ' €')}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  Voir plus
                </button>
                <button
                  onClick={() => handleReservation(circuit.id)}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  Réserver
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section id="contact" className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Contactez-nous</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem', marginBottom: '2rem' }}>
          Vous avez des questions ? N'hésitez pas à nous écrire ou à nous appeler.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <strong>Email :</strong> <br /> antoniojunioe2@gmail.com
          </div>
          <div>
            <strong>Whatsapp :</strong> <br /> +261 38 58 344 40
          </div>
          <div>
            <strong>Adresse :</strong> <br /> Antsiranana 201, Madagascar
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
