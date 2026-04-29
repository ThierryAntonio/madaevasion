# 🌴 MadaÉvasion - Agence de Voyage à Madagascar

**Plateforme complète de réservation de voyages avec tableau de bord admin et client**

## 🚀 Fonctionnalités

### 👤 Gestion des Utilisateurs
- **Inscription** : Création de compte client avec validation
- **Connexion** : Authentification sécurisée avec JWT
- **Rôles** : Admin et Client avec permissions différenciées
- **Sécurité** : Protection des routes sensibles

### 🎯 Système de Réservation
- **Réservation client** : Sélection de date de voyage personnalisée
- **Validation admin** : Accepter/Refuser les demandes de réservation
- **Suivi en temps réel** : Mise à jour instantanée des statuts
- **Notifications** : Emails simulés pour chaque action

### 📊 Tableaux de Bord
- **Dashboard Admin** :
  - Gestion des réservations (en attente/confirmées/refusées)
  - CRUD complet des circuits
  - Statistiques et suivi des activités
  
- **Dashboard Client** :
  - Vue des réservations personnelles
  - Statuts détaillés avec couleurs distinctives
  - Historique complet des demandes

### 🎨 Design & UX
- **Interface moderne** : Design épuré avec animations fluides
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Animations** : Transitions douces et effets visuels attractifs
- **Accessibilité** : Navigation intuitive et ergonomique

## 🛠️ Stack Technique

### Frontend
- **React** : Framework JavaScript avec hooks
- **Vite** : Build tool ultra-rapide
- **CSS3** : Animations modernes et design responsive
- **Fetch API** : Communication avec le backend

### Backend
- **Node.js** : Runtime JavaScript serveur
- **Express** : Framework web minimaliste
- **SQLite** : Base de données légère et efficace
- **JWT** : Authentification par tokens sécurisés
- **bcrypt** : Hashage des mots de passe

## 📁 Structure du Projet

```
madagascar-voyage/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reservationsController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── reservationsRoutes.js
│   ├── db.js
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── public/
    │   └── images/
    ├── package.json
    └── vite.config.js
```

## 🚀 Installation & Démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Installation Backend
```bash
cd backend
npm install
npm start
```

### Installation Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👥 Comptes de Démonstration

### Admin
- **Email** : admin@madevasion.com
- **Mot de passe** : admin123
- **Permissions** : Accès complet au tableau de bord admin

### Client
- **Email** : client@madevasion.com
- **Mot de passe** : client123
- **Permissions** : Réservation et suivi personnel

## 🎯 Flux Utilisateur

### 1. Client fait une réservation
1. Connexion au site
2. Parcours des circuits disponibles
3. Clic sur "Réserver"
4. Sélection de la date de voyage
5. Confirmation instantanée
6. Email de confirmation "en attente"

### 2. Admin traite la demande
1. Connexion au tableau de bord admin
2. Vue des réservations en attente
3. Clic sur "Accepter" ou "Refuser"
4. Mise à jour instantanée du statut
5. Email automatique au client

### 3. Client suit le statut
1. Accès à "Mes réservations"
2. Vue en temps réel du statut
3. Mise à jour automatique toutes les 5 secondes
4. Affichage final : confirmée/refusée

## 🎨 Personnalisation

### Couleurs du Thème
```css
--primary: #FF7E5F;    /* Orange tropical */
--secondary: #FEB47B;   /* Orange clair */
--bg-color: #F8F9FA;   /* Gris très clair */
--text-dark: #2D3436;   /* Texte principal */
--text-light: #636E72;   /* Texte secondaire */
```

## 📊 Fonctionnalités Avancées

### Sécurité
- **JWT Tokens** : Authentification stateless
- **Middleware** : Protection des routes admin
- **Hashage** : bcrypt pour les mots de passe
- **CORS** : Configuration sécurisée

### Performance
- **Lazy Loading** : Chargement optimisé
- **Caching** : Mise en cache intelligente
- **Optimisation** : Bundle minimal et rapide
- **Responsive** : Media queries optimisées

## 🚀 Déploiement

### Production
```bash
# Build frontend
npm run build

# Démarrer backend en production
NODE_ENV=production npm start
```

### Docker (Optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contribuer

### Guidelines
1. Fork le projet
2. Créer une branche feature
3. Faire les modifications avec messages clairs
4. Tester toutes les fonctionnalités
5. Soumettre une Pull Request

### Standards de Code
- **JavaScript** : ES6+ avec hooks React
- **CSS** : CSS3 avec variables personnalisées
- **Components** : Réutilisables et documentés
- **API** : RESTful avec codes HTTP appropriés

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou suggestion :
- **Email** : antoniojunioe2@gmail.com
- **WhatsApp** : +261 38 58 344 40
- **Adresse** : Antsiranana 201, Madagascar

---

<div align="center">
  <p>🌴 **MadaÉvasion** - Découvrez les merveilles de Madagascar</p>
  <p>✨ Créé avec ❤️ pour les voyageurs du monde entier</p>
</div>
