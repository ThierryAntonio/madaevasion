import db from '../db.js';

export const createReservation = (req, res) => {
    const { circuitId, date } = req.body;
    db.run("INSERT INTO reservations (userId, circuitId, date, status) VALUES (?, ?, ?, ?)", 
        [req.user.id, circuitId, date, 'pending'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Simuler l'envoi d'email (US07)
        console.log(`\n\u001b[36m\u001b[1mEMAIL SIMULÉ\u001b[0m`);
        console.log(`À : Utilisateur ID ${req.user.id}`);
        console.log(`Sujet : Confirmation de réservation - MadaÉvasion`);
        console.log(`Message : Votre réservation pour le circuit ${circuitId} le ${date} a bien été reçue. Nous vous contacterons bientôt.\n`);

        res.json({ message: 'Reservation created successfully', emailSent: true, reservationId: this.lastID });
    });
};

export const getMyReservations = (req, res) => {
    console.log(`getMyReservations appelé pour userId: ${req.user.id}`);
    const query = `
        SELECT reservations.*, circuits.title as circuitTitle 
        FROM reservations 
        JOIN circuits ON reservations.circuitId = circuits.id 
        WHERE reservations.userId = ?
    `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) {
            console.error('Erreur getMyReservations:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Réservations trouvées pour utilisateur ${req.user.id}:`, rows);
        res.json(rows);
    });
};

export const getAllReservations = (req, res) => {
    const query = `
        SELECT reservations.*, users.name as userName, users.email as userEmail, circuits.title as circuitTitle 
        FROM reservations 
        JOIN users ON reservations.userId = users.id
        JOIN circuits ON reservations.circuitId = circuits.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const updateReservationStatus = (req, res) => {
    // Récupérer l'action depuis l'URL (confirm ou reject)
    const urlPath = req.originalUrl || req.url;
    const action = urlPath.includes('/confirm') ? 'confirm' : urlPath.includes('/reject') ? 'reject' : req.body.status;
    const status = action === 'confirm' ? 'confirmed' : action === 'reject' ? 'rejected' : action;
    
    console.log(`Mise à jour réservation #${req.params.id} avec statut: ${status}`);
    
    db.run("UPDATE reservations SET status=? WHERE id=?", [status, req.params.id], function(err) {
        if (err) {
            console.error('Erreur mise à jour:', err);
            return res.status(500).json({ error: err.message });
        }
        
        // Simuler l'envoi d'email au client
        console.log(`\n\u001b[36m\u001b[1mEMAIL SIMULÉ AU CLIENT\u001b[0m`);
        console.log(`Sujet : Votre réservation a été ${status === 'confirmed' ? 'confirmée' : 'refusée'}`);
        console.log(`Message : Votre réservation #${req.params.id} a été ${status === 'confirmed' ? 'confirmée' : 'refusée'}.\n`);
        
        res.json({ message: `Reservation ${status} successfully` });
    });
};
