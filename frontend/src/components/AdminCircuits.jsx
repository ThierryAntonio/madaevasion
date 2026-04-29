import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCircuits() {
  const [circuits, setCircuits] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', duration: '', imageUrl: '', zone: '', type: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCircuits();
  }, []);

  const fetchCircuits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/circuits');
      setCircuits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce circuit ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/circuits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCircuits(circuits.filter(c => c.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/circuits', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCircuits([...circuits, res.data]);
      setFormData({ title: '', description: '', price: '', duration: '', imageUrl: '', zone: '', type: '' });
      alert('Circuit ajouté avec succès !');
    } catch (err) {
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <div>
      <div className="form-container" style={{ maxWidth: '600px', margin: '0 0 2rem 0' }}>
        <h3>Ajouter un nouveau circuit</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Titre</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required 
              style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd'}}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{flex: 1}}>
              <label>Prix (€)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Durée (ex: 5 jours)</label>
              <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Chemin de l'image (ex: /images/photo.jpg)</label>
            <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ajouter le circuit</button>
        </form>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Titre</th>
              <th>Prix</th>
              <th>Durée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {circuits.map(c => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td><img src={c.imageUrl} alt={c.title} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} /></td>
                <td>{c.title}</td>
                <td>{c.price} €</td>
                <td>{c.duration}</td>
                <td>
                  <button onClick={() => handleDelete(c.id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', borderColor: 'red', color: 'red' }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCircuits;
