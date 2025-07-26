# LinkedOut - Le LinkedIn des Chômeurs

Bienvenue sur **LinkedOut**, le réseau social qui célèbre l'art de ne pas travailler ! 

LinkedOut est une parodie humoristique de LinkedIn, créée pour mettre en avant les "compétences" en glandouille, les échecs professionnels mémorables, et connecter les experts en procrastination du monde entier.

## 🎯 Fonctionnalités

### ✅ Système d'authentification complet
- Connexion et inscription avec validation
- Gestion des sessions utilisateur
- Compte de démonstration inclus (`test@linkedout.com` / `password123`)

### ✅ Profil utilisateur personnalisable
- Compteur de jours sans emploi en temps réel
- Section "Compétences inutiles" avec endorsements
- Historique des échecs professionnels mémorables
- Système de badges d'inactivité
- Bio et informations personnalisables

### ✅ Système d'endorsements
- Recommandations absurdes entre utilisateurs
- Compétences comme "Expert en Netflix", "Maître du scroll infini"
- Interface intuitive pour donner/recevoir des endorsements

### ✅ Fil d'actualité interactif
- Publication de posts sur vos exploits de glandouille
- Système de likes et commentaires
- Filtres par type de contenu (exploits, échecs, etc.)
- Partage d'échecs professionnels

### ✅ Offres d'emploi bidons
- Annonces parodiques hilarantes
- "Testeur de canapé, 0€/h", "Ambassadeur du manque de motivation"
- Système de candidature bidon avec messages humoristiques
- Filtres et recherche avancée

### ✅ Réseautage de glandeurs
- Connexion avec d'autres experts en inactivité
- Recherche d'utilisateurs par compétences
- Demandes de connexion avec suggestions intelligentes
- Statistiques du réseau étendu

### ✅ Badges et statistiques
- Système de déblocage automatique de badges
- "Centenaire du Chômage", "Maître Netflix", "Jamais Convoqué"
- Statistiques personnelles détaillées
- Analyse du réseau de connexions

### ✅ Interface responsive
- Design moderne inspiré de LinkedIn
- Mobile-friendly avec breakpoints adaptatifs
- Mode sombre supporté
- Couleurs et animations soignées

### ✅ Données de démonstration
- 5 profils d'utilisateurs pré-créés avec historiques complets
- 8 posts humoristiques dans le fil d'actualité
- 5 offres d'emploi absurdes
- Système d'endorsements pré-rempli
- Badges et statistiques d'exemple

## 🚀 Installation et utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur HTTP local (optionnel pour le développement)

### Installation
1. Clonez ou téléchargez le repository
2. Ouvrez `index.html` dans votre navigateur
   - Ou servez les fichiers via un serveur HTTP local :
   ```bash
   python3 -m http.server 8000
   # Puis ouvrez http://localhost:8000
   ```

### Utilisation
1. **Connexion** : Utilisez le compte de démo ou créez un nouveau compte
   - Email : `test@linkedout.com`
   - Mot de passe : `password123`
2. **Exploration** : Naviguez entre les différentes sections
3. **Interaction** : Likez des posts, endorsez des compétences, postulez à des emplois bidons
4. **Personnalisation** : Modifiez votre profil, ajoutez des compétences et des échecs

## 🏗️ Architecture technique

### Structure des fichiers
```
LinkedOut/
├── index.html              # Page de connexion/inscription
├── dashboard.html           # Tableau de bord principal
├── profile.html            # Page de profil utilisateur
├── jobs.html               # Offres d'emploi bidons
├── network.html            # Réseautage
├── styles/
│   ├── main.css            # Styles principaux
│   ├── components.css      # Composants réutilisables
│   └── responsive.css      # Styles responsive
├── js/
│   ├── auth.js             # Gestion authentification
│   ├── profile.js          # Gestion des profils
│   ├── feed.js             # Fil d'actualité
│   ├── endorsements.js     # Système d'endorsements
│   ├── jobs.js             # Offres d'emploi
│   ├── network.js          # Réseautage
│   ├── badges.js           # Système de badges
│   ├── data.js             # Données de test
│   └── utils.js            # Fonctions utilitaires
├── assets/
│   ├── images/             # Images par défaut
│   └── icons/              # Icônes pour badges
└── README.md               # Cette documentation
```

### Technologies utilisées
- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec Grid et Flexbox
- **JavaScript ES6+** : Logique applicative vanilla
- **localStorage** : Persistance des données côté client

### Fonctionnalités techniques
- Architecture modulaire orientée composants
- Gestion d'état centralisée
- Système de notification temps réel
- Recherche et filtrage avancés
- Gestion des erreurs et validation
- Support du mode hors ligne

## 🎨 Design et UX

### Inspirations
- Interface LinkedIn pour la familiarité
- Couleurs professionnelles avec touches humoristiques
- Icônes et emojis pour l'aspect ludique

### Responsive Design
- Mobile-first approach
- Breakpoints : 480px, 768px, 1200px
- Grilles CSS adaptatives
- Navigation mobile optimisée

### Accessibilité
- Contraste suffisant
- Navigation au clavier
- Textes alternatifs
- Support des lecteurs d'écran

## 🔧 Développement

### Ajout de nouvelles fonctionnalités
1. Créer les composants HTML nécessaires
2. Ajouter les styles CSS correspondants
3. Implémenter la logique JavaScript
4. Mettre à jour les données de test si nécessaire

### Personnalisation
- Modifiez les variables CSS dans `:root` pour changer les couleurs
- Ajoutez de nouvelles compétences dans `js/data.js`
- Créez de nouveaux badges dans le système de badges

### Tests
- Testez sur différents navigateurs
- Vérifiez la responsivité sur mobile
- Validez les interactions utilisateur
- Contrôlez la persistance des données

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :
1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🎭 Disclaimer

LinkedOut est une parodie humoristique créée à des fins de divertissement et d'apprentissage. Ce projet n'a aucun lien officiel avec LinkedIn Corporation.

---

**Créé avec ❤️ et beaucoup de procrastination**