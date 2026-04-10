Blog Personnel
Documentation complète du projet
React  ·  Flask  ·  SQLite  ·  JWT  ·  Bootstrap


Présentation du projet

Ce projet est une application de blog personnel développée dans le cadre du cours DSIA – ISI. Elle suit l'architecture MVC et utilise React pour le frontend, Flask pour le backend, et SQLite comme base de données.
 Objectif : Créer un blog personnel complet avec gestion des utilisateurs, articles, amis et commentaires, connecté via une API REST sécurisée par JWT.

Fonctionnalités principales
•	Inscription et connexion avec authentification JWT
•	Tableau de bord personnalisé avec fil d'actualité
•	Gestion complète des articles (créer, modifier, supprimer)
•	Articles publics ou privés avec option de commentaires
•	Système d'amis : invitation, acceptation, blocage
•	Recherche d'utilisateurs par nom ou username
•	Commentaires sur les articles

  Structure du projet

Backend (Flask)	 Frontend (React)
app.py
config.py
models.py
requirements.txt
routes/auth.py
routes/articles.py
routes/friends.py
routes/users.py	src/App.js
src/index.js
src/api/index.js
src/context/AuthContext.js
src/pages/LoginPage.js
src/pages/DashboardPage.js
src/pages/MyArticlesPage.js
src/pages/FriendsPage.js
src/pages/SearchPage.js


 Installation et lancement

Prérequis
•	Python 3.8 ou supérieur  →  python.org
•	Node.js 16 ou supérieur  →  nodejs.org
•	Git Bash (Windows) ou Terminal (Mac/Linux)

1. Lancer le Backend Flask
Ouvrir un terminal dans le dossier backend/ et exécuter les commandes suivantes :
# Aller dans le dossier backend
cd blog-projet/backend

# Créer l'environnement virtuel
python -m venv venv

# Activer le venv (Windows Git Bash)
source venv/Scripts/activate

# Activer le venv (Mac / Linux)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer Flask
python app.py

 Le serveur Flask démarre sur http://localhost:5000 — La base de données SQLite est créée automatiquement avec des données de démonstration.

2. Lancer le Frontend React
Ouvrir un deuxième terminal dans le dossier frontend/ :
# Aller dans le dossier frontend
cd blog-projet/frontend

# Installer les dépendances npm
npm install

# Lancer l'application React
npm start

 L'application React démarre sur http://localhost:3000 et s'ouvre automatiquement dans le navigateur.

 Important : Les deux terminaux (Flask ET React) doivent rester ouverts en même temps pendant l'utilisation.

Comptes de démonstration
Nom d'utilisateur	Mot de passe
amadou	1234
fatou	1234
moussa	1234


 
 Documentation de l'API REST

Toutes les routes (sauf /api/auth/login et /api/auth/register) nécessitent un token JWT dans le header :
Authorization: Bearer <votre_token_jwt>

Authentification
Méthode	Route	Description
POST	/api/auth/register	Créer un nouveau compte
POST	/api/auth/login	Se connecter et obtenir un token JWT
GET	/api/auth/me	Obtenir le profil de l'utilisateur connecté

Articles
Méthode	Route	Description
GET	/api/articles/	Fil d'actualité (mes articles + amis)
GET	/api/articles/mine	Uniquement mes articles
POST	/api/articles/	Créer un nouvel article
PUT	/api/articles/<id>	Modifier un article
DELETE	/api/articles/<id>	Supprimer un article
GET	/api/articles/<id>/comments	Lister les commentaires
POST	/api/articles/<id>/comments	Ajouter un commentaire
DELETE	/api/articles/comments/<id>	Supprimer un commentaire

Amis
Méthode	Route	Description
GET	/api/friends/	Toutes mes relations
POST	/api/friends/invite/<id>	Envoyer une invitation
PUT	/api/friends/<id>/accept	Accepter une invitation
DELETE	/api/friends/<id>/decline	Refuser ou annuler
PUT	/api/friends/<id>/block	Bloquer un utilisateur
DELETE	/api/friends/<id>	Retirer un ami

Utilisateurs
Méthode	Route	Description
GET	/api/users/search?q=...	Rechercher par nom ou username
GET	/api/users/<id>	Voir le profil d'un utilisateur


  Technologies utilisées

  Backend	  Frontend
•	Flask 2.3 — framework web Python
•	Flask-SQLAlchemy — ORM base de données
•	Flask-JWT-Extended — authentification JWT
•	Flask-CORS — gestion des origines croisées
•	SQLite — base de données légère
•	Werkzeug — hashage des mots de passe	•	React 18 — bibliothèque UI
•	Bootstrap 5 — framework CSS
•	Axios — client HTTP pour l'API
•	Context API — gestion de l'état global
•	Google Fonts — typographie (Playfair Display)


Fonctionnalités implémentées

✅	Inscription avec nom complet, username et mot de passe
✅	Connexion sécurisée avec JWT (token stocké dans localStorage)
✅	Tableau de bord avec fil d'actualité personnalisé
✅	Création d'articles avec titre, contenu, visibilité et commentaires
✅	Modification et suppression des articles
✅	Articles publics visibles par les amis, privés uniquement par l'auteur
✅	Envoi et réception d'invitations d'amitié
✅	Acceptation et refus des invitations
✅	Blocage d'utilisateurs (masque leurs articles du fil)
✅	Suppression d'amis
✅	Recherche d'utilisateurs par nom ou username
✅	Ajout et suppression de commentaires
✅	Interface responsive avec Bootstrap 5


Projet réalisé dans le cadre du cours DSIA – ISI
Date de début : 17/03/2024  ·  Stack : React + Flask + SQLite

