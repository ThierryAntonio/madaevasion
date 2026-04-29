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
            db.run("UPDATE circuits SET imageUrl = '/images/aventurenord.jpg' WHERE title = 'Aventure Nord'");
            db.run("UPDATE circuits SET imageUrl = '/images/baobab.jpg' WHERE title = 'Allées des Baobabs'");
            db.run("UPDATE circuits SET imageUrl = '/images/ankarafanstika.jpg' WHERE title = 'Parc National Ankarafantsika'");
            console.log("Images updated successfully!");
        });
    }
});
