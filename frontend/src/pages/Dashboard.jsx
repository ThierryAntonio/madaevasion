import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminCircuits from '../components/AdminCircuits';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        const endpoint = user.role === 'admin' 
          ? 'http://localhost:5000/api/reservations' 
          : 'http://localhost:5000/api/reservations/my';
        
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReservations();
  }, [token, navigate, user]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/reservations/${id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="badge badge-pending">En attente</span>;
      case 'confirmed': return <span className="badge badge-confirmed">Confirmée</span>;
      case 'cancelled': return <span className="badge badge-cancelled">Annulée</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="container">
      <div className="dashboard-header" style={{ marginBottom: '1rem' }}>
        <h2>Tableau de bord {user.role === 'admin' ? '(Admin)' : ''}</h2>
        <p>Bienvenue, {user.name}!</p>
      </div>

      {user.role === 'admin' && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'reservations' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setActiveTab('reservations')}
          >
            Réservations
          </button>
          <button 
            className={`btn ${activeTab === 'circuits' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setActiveTab('circuits')}
          >
            Gestion des Circuits
          </button>
        </div>
      )}

      {activeTab === 'reservations' ? (
        <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {user.role === 'admin' && <th>Client</th>}
              {user.role === 'admin' && <th>Email</th>}
              <th>Circuit</th>
              <th>Date de demande</th>
              <th>Statut</th>
              {user.role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id}>
                <td>#{res.id}</td>
                {user.role === 'admin' && <td>{res.userName}</td>}
                {user.role === 'admin' && <td>{res.userEmail}</td>}
                <td>{res.circuitTitle}</td>
                <td>{res.date}</td>
                <td>{getStatusBadge(res.status)}</td>
                {user.role === 'admin' && (
                  <td>
                    {res.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => updateStatus(res.id, 'confirmed')} 
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', borderColor: '#28a745', color: '#28a745' }}
                        >
                          Confirmer
                        </button>
                        <button 
                          onClick={() => updateStatus(res.id, 'cancelled')} 
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', borderColor: '#dc3545', color: '#dc3545' }}
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={user.role === 'admin' ? 7 : 4} style={{ textAlign: 'center', padding: '2rem' }}>
                  Aucune réservation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      ) : (
        <AdminCircuits />
      )}
    </div>
  );
}

export default Dashboard;
