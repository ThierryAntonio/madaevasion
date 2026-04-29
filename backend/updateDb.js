const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        db.serialize(() => {
            // Delete existing circuits
            db.run("DELETE FROM circuits", (err) => {
                if (err) console.error(err);
                console.log('Old circuits deleted');
                
                // Insert new ones
                const defaultCircuits = [
                    ['Aventure Nord', 'Découvrez la beauté sauvage de la région d\'Antsiranana (Diego Suarez), entre mer d\'émeraude et Tsingy.', 600, '7 jours', 'https://images.unsplash.com/photo-1558285549-2a06ee0681a0?auto=format&fit=crop&w=800&q=80'],
                    ['Allées des Baobabs', 'Un paysage iconique au coucher du soleil dans la région de Morondava. Une expérience magique.', 350, '5 jours', 'https://images.unsplash.com/photo-1518481358983-6f81a7051410?auto=format&fit=crop&w=800&q=80'],
                    ['Parc National Ankarafantsika', 'Explorez la faune et la flore exceptionnelles de ce parc national. Lémuriens et oiseaux rares au rendez-vous.', 450, '6 jours', 'https://images.unsplash.com/photo-1617415124036-69e1f576e27b?auto=format&fit=crop&w=800&q=80']
                ];
                const stmt = db.prepare("INSERT INTO circuits (title, description, price, duration, imageUrl) VALUES (?, ?, ?, ?, ?)");
                defaultCircuits.forEach(circuit => stmt.run(circuit));
                stmt.finalize(() => {
                    console.log('New circuits inserted');
                    db.close();
                });
            });
        });
    }
});
