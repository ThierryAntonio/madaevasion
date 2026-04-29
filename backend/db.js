import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected.');
        db.serialize(() => {
            // Create Users Table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'client'
            )`, (err) => {
                if (!err) {
                    db.get("SELECT * FROM users WHERE role = 'admin'", async (err, row) => {
                        if (!row) {
                            const hash = await bcrypt.hash('admin123', 10);
                            db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", ['Admin', 'admin@madevasion.com', hash, 'admin']);
                        }
                    });
                }
            });

            // Create Circuits Table
            db.run(`CREATE TABLE IF NOT EXISTS circuits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                duration TEXT NOT NULL,
                imageUrl TEXT,
                zone TEXT DEFAULT 'Toutes zones',
                type TEXT DEFAULT 'Aventure',
                isFeatured BOOLEAN DEFAULT 0
            )`, (err) => {
                if (!err) {
                    db.get("SELECT COUNT(*) as count FROM circuits", (err, row) => {
                        if (row && row.count === 0) {
                            const defaultCircuits = [
                                ['Aventure Nord', 'Découvrez la beauté sauvage de la région d\'Antsiranana (Diego Suarez), entre mer d\'émeraude et Tsingy.', 600, '7 jours', '/images/aventurenord.jpg', 'Nord', 'Aventure', 1],
                                ['Allées des Baobabs', 'Un paysage iconique au coucher du soleil dans la région de Morondava. Une expérience magique.', 350, '5 jours', '/images/baobab.jpg', 'Ouest', 'Découverte', 1],
                                ['Parc National Ankarafantsika', 'Explorez la faune et la flore exceptionnelles de ce parc national. Lémuriens et oiseaux rares au rendez-vous.', 450, '6 jours', '/images/ankarafanstika.jpg', 'Ouest', 'Nature', 0],
                                ['Aventure Sud (Route de Toliara)', 'Découvrez la splendeur de la partie sud de Madagascar en passant par la mythique route de Toliara et les paysages de l\'Isalo.', 500, '8 jours', '/images/isalo.jpg', 'Sud', 'Aventure', 1],
                                ['Miami Toamasina', 'Visitez Miami Toamasina, le premier port de Madagascar, et profitez de son ambiance côtière unique et dynamique.', 300, '4 jours', '/images/miami.jpg', 'Est', 'Détente', 1],
                                ['Parc National Ranomafana', 'Explorez la plus grande forêt de Madagascar à Ranomafana. Une immersion totale dans la biodiversité exceptionnelle de l\'île.', 400, '5 jours', '/images/ranomafana.jpg', 'Est', 'Nature', 0]
                            ];
                            const stmt = db.prepare("INSERT INTO circuits (title, description, price, duration, imageUrl, zone, type, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                            defaultCircuits.forEach(circuit => stmt.run(circuit));
                            stmt.finalize();
                        }
                    });
                }
            });

            // Create Reservations Table
            db.run(`CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                circuitId INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                date TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (circuitId) REFERENCES circuits(id)
            )`);
        });
    }
});

export default db;
