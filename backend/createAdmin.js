import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./database.sqlite');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['Admin', 'admin@madevasion.com', hashedPassword, 'admin'],
    function(err) {
      if (err) {
        console.error('Erreur création admin:', err);
      } else {
        console.log('Compte admin créé avec succès!');
        console.log('Email: admin@madevasion.com');
        console.log('Mot de passe: admin123');
      }
      db.close();
    }
  );
}

createAdmin();
