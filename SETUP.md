# Installation et Configuration - LinkedOut

## 🚀 Installation Rapide

### Méthode 1 : Ouverture directe (Recommandée pour les tests)

1. **Téléchargement**
   ```bash
   git clone https://github.com/votre-repo/linkedout.git
   cd linkedout
   ```

2. **Ouverture directe**
   - Double-cliquez sur `index.html`
   - Ou glissez-déposez le fichier dans votre navigateur

3. **Connexion**
   - Email : `test@linkedout.com`
   - Mot de passe : `password123`

### Méthode 2 : Serveur HTTP Local (Recommandée pour le développement)

#### Option A : Python (si installé)
```bash
cd linkedout
python3 -m http.server 8000
# Ouvrez http://localhost:8000
```

#### Option B : Node.js (si installé)
```bash
cd linkedout
npx serve .
# Ou avec http-server :
npx http-server -p 8000
```

#### Option C : PHP (si installé)
```bash
cd linkedout
php -S localhost:8000
```

## 🔧 Configuration

### Données par Défaut

L'application se configure automatiquement avec :
- 5 utilisateurs de démonstration
- 8 posts dans le fil d'actualité
- 5 offres d'emploi bidons
- 12 badges configurés
- Système d'endorsements pré-rempli

### Personnalisation des Données

#### Ajouter un Utilisateur
Modifiez `js/data.js` section `SAMPLE_USERS` :

```javascript
{
    id: 'user_6',
    name: 'Votre Nom',
    email: 'votre@email.com',
    password: 'motdepasse',
    title: 'Votre Titre Professionnel',
    unemploymentStart: '2024-01-01',
    avatar: null,
    skills: [
        { name: 'Votre Compétence', endorsements: 0 }
    ],
    connections: [],
    badges: [],
    bio: 'Votre bio humoristique',
    failures: ['Votre échec mémorable']
}
```

#### Ajouter une Offre d'Emploi
Modifiez `js/data.js` section `SAMPLE_JOBS` :

```javascript
{
    id: 'job_6',
    title: 'Titre du Poste',
    company: 'Nom de l\'Entreprise',
    location: 'Lieu de Travail',
    salary: 'Salaire Proposé',
    type: 'Type de Contrat',
    description: 'Description humoristique',
    requirements: [
        'Compétence requise 1',
        'Compétence requise 2'
    ],
    tags: ['Tag1', 'Tag2'],
    posted: '2024-01-26T10:00:00Z',
    applications: 0
}
```

#### Ajouter un Badge
Modifiez `js/data.js` section `BADGE_DEFINITIONS` :

```javascript
{
    id: 'mon_badge',
    title: 'Titre du Badge',
    description: 'Description du badge',
    icon: '🏆',
    requirement: 'condition_personnalisee'
}
```

Puis ajoutez la logique dans `js/badges.js` :

```javascript
case 'condition_personnalisee':
    return /* votre condition */;
```

### Personnalisation du Style

#### Couleurs
Modifiez les variables CSS dans `styles/main.css` :

```css
:root {
    --primary-color: #0077b5;    /* Couleur principale */
    --accent-color: #ff6b35;     /* Couleur d'accent */
    --success-color: #057642;    /* Couleur de succès */
    /* ... autres couleurs */
}
```

#### Fonts
Changez la police dans `styles/main.css` :

```css
:root {
    --font-family: "Votre Police", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

#### Espacements
Ajustez les espacements :

```css
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
}
```

## 🔍 Résolution de Problèmes

### Problèmes Courants

#### "Les données ne se sauvegardent pas"
- **Cause** : Restrictions localStorage du navigateur
- **Solution** : Utilisez un serveur HTTP local au lieu d'ouvrir directement les fichiers

#### "Les images/icônes ne s'affichent pas"
- **Cause** : Protocole `file://` bloque les ressources
- **Solution** : Utilisez un serveur HTTP local

#### "L'application est lente"
- **Cause** : Trop de données en localStorage
- **Solution** : Effacez le localStorage :
  ```javascript
  localStorage.clear();
  location.reload();
  ```

#### "Erreur JavaScript"
- **Cause** : Incompatibilité navigateur
- **Solution** : Utilisez un navigateur moderne (Chrome, Firefox, Safari, Edge récents)

### Debug et Développement

#### Activer les Logs de Debug
Ouvrez la console développeur (F12) pour voir les logs détaillés.

#### Inspecter les Données
```javascript
// Console du navigateur
console.log('Utilisateurs:', window.LinkedOutData.getUsers());
console.log('Posts:', window.LinkedOutData.getPosts());
console.log('Utilisateur actuel:', window.LinkedOutAuth.getCurrentUser());
```

#### Réinitialiser les Données
```javascript
// Console du navigateur
window.LinkedOutData.reset();
location.reload();
```

## 🛠️ Configuration Avancée

### Variables d'Environnement Simulées

Modifiez `js/utils.js` pour personnaliser le comportement :

```javascript
const CONFIG = {
    DEBUG_MODE: true,
    AUTO_SAVE_INTERVAL: 5000,
    MAX_POSTS_IN_FEED: 50,
    NOTIFICATION_DURATION: 3000
};
```

### Hooks et Extensions

L'architecture modulaire permet d'ajouter facilement des fonctionnalités :

```javascript
// Exemple : Hook après connexion
window.LinkedOutAuth.onLogin = function(user) {
    console.log('Utilisateur connecté:', user.name);
    // Votre code personnalisé
};
```

### Base de Données Alternative

Pour utiliser une vraie base de données, remplacez les méthodes dans `js/data.js` :

```javascript
const DataManager = {
    async getUsers() {
        const response = await fetch('/api/users');
        return response.json();
    },
    
    async saveUsers(users) {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(users)
        });
    }
    // ... autres méthodes
};
```

## 📱 Déploiement

### GitHub Pages
1. Pushez votre code sur GitHub
2. Allez dans Settings > Pages
3. Sélectionnez la branche `main`
4. Votre site sera disponible à `https://username.github.io/linkedout`

### Netlify
1. Glissez-déposez le dossier sur [Netlify Drop](https://app.netlify.com/drop)
2. Ou connectez votre repository GitHub

### Serveur Web Standard
Uploadez tous les fichiers dans le répertoire web de votre serveur.

## 🔒 Sécurité

### Pour Usage en Production
- [ ] Remplacez localStorage par une vraie base de données
- [ ] Ajoutez l'authentification côté serveur
- [ ] Implémentez la validation côté serveur
- [ ] Utilisez HTTPS
- [ ] Ajoutez la protection CSRF
- [ ] Sanitisez toutes les entrées utilisateur

### Limitations Actuelles
- Données stockées en local (non sécurisé)
- Pas d'authentification réelle
- Pas de validation côté serveur
- Adapté pour démonstration/prototype uniquement

## ✅ Vérification de l'Installation

Après installation, vérifiez que :
- [ ] Page de connexion s'affiche correctement
- [ ] Connexion avec compte démo fonctionne
- [ ] Navigation entre pages opérationnelle  
- [ ] Données de démonstration visibles
- [ ] Interactions utilisateur réactives
- [ ] Responsive design sur mobile
- [ ] Console sans erreurs JavaScript

---

**Installation réussie ! Vous pouvez maintenant explorer LinkedOut.** 🎉