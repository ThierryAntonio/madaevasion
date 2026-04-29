import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        db.serialize(() => {
            // Ignore errors if columns already exist
            db.run("ALTER TABLE circuits ADD COLUMN zone TEXT", (err) => {});
            db.run("ALTER TABLE circuits ADD COLUMN type TEXT", (err) => {});
            db.run("ALTER TABLE circuits ADD COLUMN isFeatured BOOLEAN", (err) => {});

            // Insert new ones
            const newCircuits = [
                ['Aventure Sud (Route de Toliara)', 'Découvrez la splendeur de la partie sud de Madagascar en passant par la mythique route de Toliara et les paysages de l\'Isalo.', 500, '8 jours', '/images/isalo.jpg', 'Sud', 'Aventure', 1],
                ['Miami Toamasina', 'Visitez Miami Toamasina, le premier port de Madagascar, et profitez de son ambiance côtière unique et dynamique.', 300, '4 jours', '/images/miami.jpg', 'Est', 'Détente', 1],
                ['Parc National Ranomafana', 'Explorez la plus grande forêt de Madagascar à Ranomafana. Une immersion totale dans la biodiversité exceptionnelle de l\'île.', 400, '5 jours', '/images/ranomafana.jpg', 'Est', 'Nature', 0]
            ];
            
            db.get("SELECT COUNT(*) as count FROM circuits WHERE title = 'Miami Toamasina'", (err, row) => {
                if (row && row.count === 0) {
                    const stmt = db.prepare("INSERT INTO circuits (title, description, price, duration, imageUrl, zone, type, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    newCircuits.forEach(circuit => stmt.run(circuit));
                    stmt.finalize(() => {
                        console.log("Les colonnes et les 3 nouveaux circuits ont été insérés avec succès !");
                        db.close();
                    });
                } else {
                    console.log("Les circuits existent déjà.");
                    db.close();
                }
            });
        });
    }
});
