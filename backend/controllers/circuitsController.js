import db from '../db.js';

export const getCircuits = (req, res) => {
    db.all("SELECT * FROM circuits", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const getCircuitById = (req, res) => {
    db.get("SELECT * FROM circuits WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Circuit not found' });
        res.json(row);
    });
};

export const getFeaturedCircuits = (req, res) => {
    db.all("SELECT * FROM circuits WHERE isFeatured = 1", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const getZones = (req, res) => {
    db.all("SELECT DISTINCT zone FROM circuits WHERE zone IS NOT NULL", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.zone));
    });
};

export const getTypes = (req, res) => {
    db.all("SELECT DISTINCT type FROM circuits WHERE type IS NOT NULL", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.type));
    });
};

export const createCircuit = (req, res) => {
    const { title, description, price, duration, imageUrl, zone, type, isFeatured } = req.body;
    db.run("INSERT INTO circuits (title, description, price, duration, imageUrl, zone, type, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
        [title, description, price, duration, imageUrl, zone, type, isFeatured ? 1 : 0], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, description, price, duration, imageUrl });
    });
};

export const updateCircuit = (req, res) => {
    const { title, description, price, duration, imageUrl } = req.body;
    db.run("UPDATE circuits SET title=?, description=?, price=?, duration=?, imageUrl=? WHERE id=?", 
        [title, description, price, duration, imageUrl, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Circuit updated successfully' });
    });
};

export const deleteCircuit = (req, res) => {
    db.run("DELETE FROM circuits WHERE id=?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Circuit deleted successfully' });
    });
};
