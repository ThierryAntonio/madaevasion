import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'client@madevasion.com', 
        password: 'client123' 
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('Connexion réussie!');
    } else {
      console.log('Erreur de connexion:', data.error);
    }
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

testLogin();
