import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = 'madaevasion_secret_key_2026';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hash], function(err) {
            if (err) return res.status(400).json({ error: 'Email already exists' });
            res.json({ message: 'User registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'User not found' });
        
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
};
