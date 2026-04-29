import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');
db.all('SELECT * FROM users', (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Utilisateurs dans la base:');
    rows.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Nom: ${user.name}, Email: ${user.email}, Rôle: ${user.role}`);
    });
  }
  db.close();
});
