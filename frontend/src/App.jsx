import { useState, useEffect } from 'react';

// Composant ClientDashboard
function ClientDashboard() {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadReservations();
    
    // Mettre à jour automatiquement toutes les 5 secondes
    const interval = setInterval(() => {
      loadReservations();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadReservations = () => {
    // Récupérer les infos utilisateur depuis localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Charger les réservations du client
      const token = localStorage.getItem('token');
      console.log('Chargement réservations pour utilisateur:', parsedUser.id);
      fetch(`http://localhost:5000/api/reservations/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          console.log('Status API réservations:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Données réservations reçues:', data);
          setReservations(data);
        })
        .catch(err => {
          console.error('Erreur réservations client:', err);
        });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#fff3cd';
      case 'confirmed': return '#d4edda';
      case 'rejected': return '#f8d7da';
      default: return '#f8f9fa';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente de validation';
      case 'confirmed': return 'Réservation confirmée';
      case 'rejected': return 'Réservation refusée';
      default: return 'Statut inconnu';
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Mon Tableau de Bord</h1>
        <button 
          onClick={loadReservations}
          className="btn btn-outline"
          style={{ padding: '0.5rem 1rem' }}
        >
          Rafraîchir
        </button>
      </div>
      
      <div className="dashboard-header">
        <h2>Mes Réservations</h2>
        <p>Bienvenue {user?.name} ! Voici l'état de vos demandes de réservation.</p>
      </div>

      {reservations.length === 0 ? (
        <div className="form-container" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Vous n'avez aucune réservation</h3>
          <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
            Découvrez nos circuits et faites votre première réservation !
          </p>
          <button 
            onClick={() => setPage('home')}
            className="btn btn-primary" 
            style={{ marginTop: '1rem' }}
          >
            Voir les circuits
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#fff3cd', color: '#856404', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
              En attente: {reservations.filter(r => r.status === 'pending').length}
            </span>
            <span style={{ background: '#d4edda', color: '#155724', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
              Confirmées: {reservations.filter(r => r.status === 'confirmed').length}
            </span>
            <span style={{ background: '#f8d7da', color: '#721c24', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
              Refusées: {reservations.filter(r => r.status === 'rejected').length}
            </span>
          </div>
          
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID Réservation</th>
                  <th>Circuit</th>
                  <th>Date de demande</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td>#{reservation.id}</td>
                    <td>
                      <div>
                        <strong>{reservation.circuitTitle || 'Circuit #' + reservation.circuitId}</strong>
                        {reservation.circuitDescription && (
                          <small style={{ display: 'block', color: 'var(--text-light)' }}>
                            {reservation.circuitDescription}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>{new Date(reservation.date).toLocaleDateString('fr-FR')}</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                      {reservation.circuitPrice || 'N/A'} $
                    </td>
                    <td>
                      <span 
                        style={{ 
                          background: getStatusColor(reservation.status),
                          color: reservation.status === 'pending' ? '#856404' : 
                                 reservation.status === 'confirmed' ? '#155724' : '#721c24',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => alert(`Détails de la réservation #${reservation.id}\n\nCircuit: ${reservation.circuitTitle || 'N/A'}\nDate: ${new Date(reservation.date).toLocaleDateString('fr-FR')}\nStatut: ${getStatusText(reservation.status)}\n\n${reservation.status === 'pending' ? 'Votre réservation est en attente de validation par notre équipe.' : reservation.status === 'confirmed' ? 'Félicitations ! Votre réservation a été confirmée.' : 'Votre réservation a été refusée. Contactez-nous pour plus d\'informations.'}`)}
                        className="btn btn-outline" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
        <h3>Information importante</h3>
        <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
          <strong>Processus de réservation :</strong><br/>
          1. Vous faites une demande de réservation<br/>
          2. Vous recevez un email de confirmation "en attente"<br/>
          3. Notre équipe traite votre demande dans les 24h<br/>
          4. Vous recevez un email de confirmation ou de refus<br/>
          5. Le statut est mis à jour dans ce tableau de bord
        </p>
      </div>
    </div>
  );
}

// Composant Dashboard
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [activeTab, setActiveTab] = useState('reservations');
  const [showAddCircuit, setShowAddCircuit] = useState(false);
  const [editingCircuit, setEditingCircuit] = useState(null);
  const [newCircuit, setNewCircuit] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    imageUrl: ''
  });

  // Vérifier si l'utilisateur est admin
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Accès refusé</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Charger les réservations
    fetch('http://localhost:5000/api/reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(err => console.log('Erreur réservations:', err));

    // Charger les circuits
    fetch('http://localhost:5000/api/circuits')
      .then(res => res.json())
      .then(data => setCircuits(data))
      .catch(err => console.log('Erreur circuits:', err));
  }, []);

  const handleReservationAction = async (reservationId, action) => {
    // Mettre à jour l'état local instantanément
    const updatedReservations = reservations.map(reservation => 
      reservation.id === reservationId 
        ? { ...reservation, status: action === 'confirm' ? 'confirmed' : 'rejected' }
        : reservation
    );
    setReservations(updatedReservations);
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/reservations/${reservationId}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Afficher le message de succès
      alert(`Réservation ${action === 'confirm' ? 'confirmée' : 'refusée'} avec succès!`);
      
      // Recharger pour s'assurer que les données sont synchronisées
      const res = await fetch('http://localhost:5000/api/reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      // En cas d'erreur, recharger les données originales
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReservations(data);
      alert('Erreur lors de la mise à jour de la réservation');
    }
  };

  const handleAddCircuit = async () => {
    try {
      await fetch('http://localhost:5000/api/circuits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCircuit)
      });
      // Recharger les circuits
      const res = await fetch('http://localhost:5000/api/circuits');
      const data = await res.json();
      setCircuits(data);
      setShowAddCircuit(false);
      setNewCircuit({ title: '', description: '', price: '', duration: '', imageUrl: '' });
      alert('Circuit ajouté avec succès!');
    } catch (err) {
      alert('Erreur lors de l\'ajout du circuit');
    }
  };

  const handleUpdateCircuit = async (circuitId) => {
    try {
      await fetch(`http://localhost:5000/api/circuits/${circuitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCircuit)
      });
      // Recharger les circuits
      const res = await fetch('http://localhost:5000/api/circuits');
      const data = await res.json();
      setCircuits(data);
      setEditingCircuit(null);
      alert('Circuit mis à jour avec succès!');
    } catch (err) {
      alert('Erreur lors de la mise à jour du circuit');
    }
  };

  const handleDeleteCircuit = async (circuitId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce circuit?')) {
      try {
        await fetch(`http://localhost:5000/api/circuits/${circuitId}`, {
          method: 'DELETE'
        });
        // Recharger les circuits
        const res = await fetch('http://localhost:5000/api/circuits');
        const data = await res.json();
        setCircuits(data);
        alert('Circuit supprimé avec succès!');
      } catch (err) {
        alert('Erreur lors de la suppression du circuit');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Tableau de bord Admin</h1>
      
      {/* Onglets */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
        <button 
          onClick={() => setActiveTab('reservations')}
          style={{ 
            background: activeTab === 'reservations' ? 'var(--primary)' : 'none',
            color: activeTab === 'reservations' ? 'white' : 'var(--text-dark)',
            border: 'none', 
            padding: '1rem 2rem', 
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Réservations ({reservations.filter(r => r.status === 'pending').length} en attente)
        </button>
        <button 
          onClick={() => setActiveTab('circuits')}
          style={{ 
            background: activeTab === 'circuits' ? 'var(--primary)' : 'none',
            color: activeTab === 'circuits' ? 'white' : 'var(--text-dark)',
            border: 'none', 
            padding: '1rem 2rem', 
            cursor: 'pointer'
          }}
        >
          Gestion des circuits
        </button>
      </div>

      {/* Tab Réservations */}
      {activeTab === 'reservations' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Circuit</th>
                <th>Date</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.circuitTitle || 'Circuit #' + reservation.circuitId}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.userName || 'Utilisateur #' + reservation.userId}</td>
                  <td>
                    <span className={`badge badge-${reservation.status}`}>
                      {reservation.status === 'pending' ? 'En attente' : reservation.status === 'confirmed' ? 'Confirmée' : 'Refusée'}
                    </span>
                  </td>
                  <td>
                    {reservation.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleReservationAction(reservation.id, 'confirm')}
                          className="btn btn-success" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Accepter
                        </button>
                        <button 
                          onClick={() => handleReservationAction(reservation.id, 'reject')}
                          className="btn btn-danger" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Refuser
                        </button>
                      </div>
                    ) : (
                      <div style={{ 
                        padding: '0.5rem',
                        borderRadius: '4px',
                        textAlign: 'center',
                        background: reservation.status === 'confirmed' ? '#d4edda' : '#f8d7da',
                        color: reservation.status === 'confirmed' ? '#155724' : '#721c24',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {reservation.status === 'confirmed' ? 'Déjà acceptée' : 'Déjà refusée'}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Circuits */}
      {activeTab === 'circuits' && (
    <div>
      <button 
        onClick={() => setShowAddCircuit(true)}
        className="btn btn-primary" 
        style={{ marginBottom: '2rem' }}
      >
        Ajouter un circuit
      </button>

          {/* Formulaire d'ajout */}
          {showAddCircuit && (
            <div className="form-container" style={{ marginBottom: '2rem' }}>
              <h3>Ajouter un nouveau circuit</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Titre" 
                  value={newCircuit.title}
                  onChange={(e) => setNewCircuit({...newCircuit, title: e.target.value})}
                  style={{ flex: 1, minWidth: '200px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input 
                  type="text" 
                  placeholder="Durée" 
                  value={newCircuit.duration}
                  onChange={(e) => setNewCircuit({...newCircuit, duration: e.target.value})}
                  style={{ width: '150px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input 
                  type="number" 
                  placeholder="Prix" 
                  value={newCircuit.price}
                  onChange={(e) => setNewCircuit({...newCircuit, price: e.target.value})}
                  style={{ width: '120px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <textarea 
                placeholder="Description" 
                value={newCircuit.description}
                onChange={(e) => setNewCircuit({...newCircuit, description: e.target.value})}
                style={{ width: '100%', margin: '1rem 0', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
              />
              <input 
                type="text" 
                placeholder="URL de l'image" 
                value={newCircuit.imageUrl}
                onChange={(e) => setNewCircuit({...newCircuit, imageUrl: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }}
              />
              <div>
                <button onClick={handleAddCircuit} className="btn btn-primary" style={{ marginRight: '1rem' }}>
                  Ajouter
                </button>
                <button onClick={() => setShowAddCircuit(false)} className="btn btn-outline">
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Liste des circuits */}
          <div className="circuits-grid">
            {circuits.map(circuit => (
              <div key={circuit.id} className="circuit-card">
                <img src={circuit.imageUrl} alt={circuit.title} className="circuit-img" />
                <div className="circuit-content">
                  {editingCircuit?.id === circuit.id ? (
                    <div>
                      <input 
                        type="text" 
                        value={editingCircuit.title}
                        onChange={(e) => setEditingCircuit({...editingCircuit, title: e.target.value})}
                        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.25rem' }}
                      />
                      <textarea 
                        value={editingCircuit.description}
                        onChange={(e) => setEditingCircuit({...editingCircuit, description: e.target.value})}
                        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.25rem', minHeight: '60px' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input 
                          type="text" 
                          value={editingCircuit.duration}
                          onChange={(e) => setEditingCircuit({...editingCircuit, duration: e.target.value})}
                          placeholder="Durée"
                          style={{ flex: 1, padding: '0.25rem' }}
                        />
                        <input 
                          type="number" 
                          value={editingCircuit.price}
                          onChange={(e) => setEditingCircuit({...editingCircuit, price: e.target.value})}
                          placeholder="Prix"
                          style={{ flex: 1, padding: '0.25rem' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleUpdateCircuit(circuit.id)} className="btn btn-primary" style={{ flex: 1 }}>
                          Sauvegarder
                        </button>
                        <button onClick={() => setEditingCircuit(null)} className="btn btn-outline" style={{ flex: 1 }}>
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="circuit-title">{circuit.title}</h3>
                      <p className="circuit-desc">{circuit.description}</p>
                      <div className="circuit-meta">
                        <span>{circuit.duration}</span>
                        <span className="circuit-price">{circuit.price} $</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button onClick={() => setEditingCircuit(circuit)} className="btn btn-outline" style={{ flex: 1 }}>
                          Modifier
                        </button>
                        <button onClick={() => handleDeleteCircuit(circuit.id)} className="btn btn-primary" style={{ flex: 1, background: '#dc3545' }}>
                          Supprimer
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [circuits, setCircuits] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [reservationDate, setReservationDate] = useState('');

  useEffect(() => {
    // Charger les circuits depuis le backend
    fetch('http://localhost:5000/api/circuits')
      .then(res => res.json())
      .then(data => setCircuits(data))
      .catch(err => console.log('Backend non démarré'));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          setPage('dashboard');
        } else {
          setPage('home');
        }
      } else {
        alert('Identifiants incorrects');
      }
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setPage('home');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (res.ok) {
        alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setPage('login');
      } else {
        const errorData = await res.json();
        alert('Erreur lors de l\'inscription: ' + (errorData.error || 'Veuillez réessayer'));
      }
    } catch (err) {
      alert('Erreur de connexion. Veuillez vérifier que le serveur est démarré.');
    }
  };

  const handleReservation = (circuit) => {
    if (!isLoggedIn) {
      setPage('login');
      return;
    }
    
    setSelectedCircuit(circuit);
    setShowReservationForm(true);
    setReservationDate('');
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    
    if (!reservationDate) {
      alert('Veuillez choisir une date pour votre voyage.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          circuitId: selectedCircuit.id, 
          date: reservationDate,
          userId: currentUser.id
        })
      });
      
      if (res.ok) {
        alert('Merci de votre réservation ! Votre demande pour le ' + new Date(reservationDate).toLocaleDateString('fr-FR') + ' est en cours de traitement. Vous recevrez un email de confirmation sous peu.');
        setShowReservationForm(false);
        setSelectedCircuit(null);
        setReservationDate('');
        if (currentUser.role === 'admin') {
          setPage('dashboard');
        } else {
          setPage('clientDashboard');
        }
      } else {
        const errorData = await res.json();
        alert('Erreur lors de la réservation: ' + (errorData.error || 'Veuillez réessayer'));
      }
    } catch (err) {
      console.error('Erreur réservation:', err);
      alert('Erreur de connexion. Veuillez vérifier que le serveur est démarré.');
    }
  };

  const renderPage = () => {
    switch(page) {
      case 'home':
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
              {circuits.length > 0 ? circuits.map(circuit => (
                <div key={circuit.id} className="circuit-card">
                  <img src={circuit.imageUrl} alt={circuit.title} className="circuit-img" />
                  <div className="circuit-content">
                    <h3 className="circuit-title">{circuit.title}</h3>
                    <p className="circuit-desc">{circuit.description}</p>
                    <div className="circuit-meta">
                      <span>Duration: {circuit.duration}</span>
                      <span className="circuit-price">{circuit.price} $</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button
                        onClick={() => alert('Détails du circuit : ' + circuit.description + '\nDurée : ' + circuit.duration + '\nPrix : ' + circuit.price + ' $')}
                        className="btn btn-outline"
                        style={{ flex: 1, padding: '0.5rem' }}
                      >
                        Voir plus
                      </button>
                      <button
                        onClick={() => handleReservation(circuit)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '0.5rem' }}
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                // Afficher les 6 circuits avec toutes les photos si backend non disponible
                <>
                  <div className="circuit-card">
                    <img src="/images/ankarafanstika.jpg" alt="Aventure Ankarafantsika" className="circuit-img" />
                    <div className="circuit-content">
                      <h3 className="circuit-title">Aventure Ankarafantsika</h3>
                      <p className="circuit-desc">Explorez la forêt sèche et les lacs sacrés du nord de Madagascar.</p>
                      <div className="circuit-meta">
                        <span>3 jours</span>
                        <span className="circuit-price">450 $</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>Voir plus</button>
                        <button onClick={() => handleReservation({id: 1, title: 'Aventure Ankarafantsika', description: 'Explorez la forêt sèche et les lacs sacrés du nord de Madagascar.', price: 450, duration: '3 jours'})} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Réserver</button>
                      </div>
                    </div>
                  </div>
                  <div className="circuit-card">
                    <img src="/images/aventurenord.jpg" alt="Aventure Nord" className="circuit-img" />
                    <div className="circuit-content">
                      <h3 className="circuit-title">Aventure Nord</h3>
                      <p className="circuit-desc">Découvrez les Tsingy et les baies spectaculaires de Diego Suarez.</p>
                      <div className="circuit-meta">
                        <span>5 jours</span>
                        <span className="circuit-price">650 $</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>Voir plus</button>
                        <button onClick={() => handleReservation({id: 1, title: 'Aventure Ankarafantsika', description: 'Explorez la forêt sèche et les lacs sacrés du nord de Madagascar.', price: 450, duration: '3 jours'})} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Réserver</button>
                      </div>
                    </div>
                  </div>
                  <div className="circuit-card">
                    <img src="/images/baobab.jpg" alt="Allée des Baobabs" className="circuit-img" />
                    <div className="circuit-content">
                      <h3 className="circuit-title">Allée des Baobabs</h3>
                      <p className="circuit-desc">Admirez les majestueux baobabs de Madagascar au coucher du soleil.</p>
                      <div className="circuit-meta">
                        <span>2 jours</span>
                        <span className="circuit-price">350 $</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>Voir plus</button>
                        <button onClick={() => handleReservation({id: 1, title: 'Aventure Ankarafantsika', description: 'Explorez la forêt sèche et les lacs sacrés du nord de Madagascar.', price: 450, duration: '3 jours'})} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Réserver</button>
                      </div>
                    </div>
                  </div>
                  <div className="circuit-card">
                    <img src="/images/isalo.jpg" alt="Parc National de l'Isalo" className="circuit-img" />
                    <div className="circuit-content">
                      <h3 className="circuit-title">Parc National de l'Isalo</h3>
                      <p className="circuit-desc">Randonnée dans les canyons et paysages lunaires de l'Isalo.</p>
                      <div className="circuit-meta">
                        <span>4 jours</span>
                        <span className="circuit-price">550 $</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>Voir plus</button>
                        <button onClick={() => handleReservation({id: 1, title: 'Aventure Ankarafantsika', description: 'Explorez la forêt sèche et les lacs sacrés du nord de Madagascar.', price: 450, duration: '3 jours'})} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Réserver</button>
                      </div>
                    </div>
                  </div>
                  <div className="circuit-card">
                    <img src="/images/miami.jpg" alt="Plages de Nosy Be" className="circuit-img" />
                    <div className="circuit-content">
                      <h3 className="circuit-title">Bord de Miami Tamatave</h3>
                      <p className="circuit-desc">Détente sur la mer de notre premier grand port de Madagascar.</p>
                      <div className="circuit-meta">
                        <span>6 jours</span>
                        <span className="circuit-price">750 $</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>Voir plus</button>
                        <button onClick={() => handleReservation({id: 1, title: 'Aventure Ankarafantsika', description: 'Explorez la forêt sèche et les lacs sacrés du nord de Madagascar.', price: 450, duration: '3 jours'})} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Réserver</button>
                      </div>
                    </div>
                  </div>
                  <div className="circuit-card">
                    <img src="/images/ranomafana.jpg" alt="Parc de Ranomafana" className="circuit-img" />
                    <div className="circuit-content">
                      <h3 className="circuit-title">Parc de Ranomafana</h3>
                      <p className="circuit-desc">Découverte de la forêt tropicale et les lémuriens de Ranomafana.</p>
                      <div className="circuit-meta">
                        <span>3 jours</span>
                        <span className="circuit-price">400 $</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>Voir plus</button>
                        <button onClick={() => handleReservation({id: 1, title: 'Aventure Ankarafantsika', description: 'Explorez la forêt sèche et les lacs sacrés du nord de Madagascar.', price: 450, duration: '3 jours'})} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Réserver</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
      
      case 'login':
        return (
          <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="form-container" style={{ width: '100%' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Connexion</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="votre@email.com" required />
                </div>
                <div className="form-group">
                  <label>Mot de passe</label>
                  <input type="password" name="password" placeholder="Votre mot de passe" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Se connecter
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Pas encore de compte ? 
                <button onClick={() => setPage('register')} style={{background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer'}}>
                  Inscrivez-vous
                </button>
              </p>
                          </div>
          </div>
        );
      
      case 'register':
        return (
          <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="form-container" style={{ width: '100%' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Inscription</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Nom complet</label>
                  <input type="text" name="name" placeholder="Votre nom" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="votre@email.com" required />
                </div>
                <div className="form-group">
                  <label>Mot de passe</label>
                  <input type="password" name="password" placeholder="Choisissez un mot de passe" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  S'inscrire
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Déjà un compte ? 
                <button onClick={() => setPage('login')} style={{background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer'}}>
                  Connectez-vous
                </button>
              </p>
            </div>
          </div>
        );

      case 'dashboard':
        return <Dashboard />;

      case 'clientDashboard':
        return <ClientDashboard />;
      
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <h1 style={{color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setPage('home')}>MadaÉvasion</h1>
          <div className="nav-links">
            <button onClick={() => {setPage('home'); window.scrollTo(0, 0);}} style={{background: 'none', border: 'none', cursor: 'pointer'}}>Accueil</button>
            <button onClick={() => {setPage('home'); setTimeout(() => document.getElementById('circuits')?.scrollIntoView(), 100);}} style={{background: 'none', border: 'none', cursor: 'pointer'}}>Nos circuits</button>
            <button onClick={() => {setPage('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView(), 100);}} style={{background: 'none', border: 'none', cursor: 'pointer'}}>Contact</button>
            {isLoggedIn && currentUser?.role === 'admin' ? (
              <>
                <button onClick={() => setPage('dashboard')} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)'}}>Tableau de bord</button>
                <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>Déconnexion</button>
              </>
            ) : isLoggedIn ? (
              <>
                <button onClick={() => setPage('clientDashboard')} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)'}}>Mes réservations</button>
                <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>Déconnexion</button>
              </>
            ) : (
              <>
                <button onClick={() => setPage('login')} style={{background: 'none', border: 'none', cursor: 'pointer'}}>Connexion</button>
                <button onClick={() => setPage('register')} className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Inscription</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      {renderPage()}

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-section">
            <h3>MadaÉvasion</h3>
            <p>Votre partenaire de confiance pour découvrir les merveilles de Madagascar.</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Antsiranana 201, Madagascar</p>
            <p>+261 38 58 344 40</p>
            <p>antoniojunioe2@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 MadaÉvasion. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Formulaire de réservation avec sélection de date */}
      {showReservationForm && selectedCircuit && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="form-container" style={{ maxWidth: '500px', width: '90%' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Réserver : {selectedCircuit.title}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
              {selectedCircuit.description}
            </p>
            
            <form onSubmit={submitReservation}>
              <div className="form-group">
                <label>Date de votre voyage</label>
                <input 
                  type="date" 
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              
              <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Détails de la réservation</h4>
                <p style={{ margin: '0.25rem 0' }}><strong>Circuit:</strong> {selectedCircuit.title}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Durée:</strong> {selectedCircuit.duration}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Prix:</strong> {selectedCircuit.price} $</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {reservationDate ? new Date(reservationDate).toLocaleDateString('fr-FR') : 'À choisir'}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirmer la réservation
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowReservationForm(false);
                    setSelectedCircuit(null);
                    setReservationDate('');
                  }}
                  className="btn btn-outline" 
                  style={{ flex: 1 }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
