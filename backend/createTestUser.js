import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./database.sqlite');

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('client123', 10);
  
  db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['Client Test', 'client@madevasion.com', hashedPassword, 'client'],
    function(err) {
      if (err) {
        console.error('Erreur création client:', err);
      } else {
        console.log('Compte client créé avec succès!');
        console.log('Email: client@madevasion.com');
        console.log('Mot de passe: client123');
      }
      db.close();
    }
  );
}

createTestUser();
