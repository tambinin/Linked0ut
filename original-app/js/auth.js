// LinkedOut - Authentication System

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        // Check if user is already logged in
        const savedUser = window.LinkedOutUtils.Storage.get('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
        }
        
        // Initialize event listeners if on auth page
        if (document.body.classList.contains('auth-page')) {
            this.initAuthPage();
        }
        
        window.LinkedOutUtils.Debug.log('Auth manager initialized');
    }
    
    initAuthPage() {
        // Tab switching
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update tabs
                tabs.forEach(t => window.LinkedOutUtils.DOM.removeActive(t));
                window.LinkedOutUtils.DOM.addActive(tab);
                
                // Update forms
                forms.forEach(form => {
                    if (form.id === `${targetTab}-form`) {
                        window.LinkedOutUtils.DOM.addActive(form);
                    } else {
                        window.LinkedOutUtils.DOM.removeActive(form);
                    }
                });
            });
        });
        
        // Form submissions
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }
    
    handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Validate input
        if (!window.LinkedOutUtils.Validator.email(email)) {
            window.LinkedOutUtils.Notifications.show('Email invalide', 'error');
            return;
        }
        
        if (!window.LinkedOutUtils.Validator.password(password)) {
            window.LinkedOutUtils.Notifications.show('Mot de passe trop court (min 6 caractères)', 'error');
            return;
        }
        
        // Find user
        const users = window.LinkedOutData.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            window.LinkedOutUtils.Notifications.show('Email ou mot de passe incorrect', 'error');
            return;
        }
        
        // Log in user
        this.login(user);
    }
    
    handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const unemploymentStart = formData.get('unemploymentStart');
        
        // Validate input
        if (!window.LinkedOutUtils.Validator.required(name)) {
            window.LinkedOutUtils.Notifications.show('Le nom est requis', 'error');
            return;
        }
        
        if (!window.LinkedOutUtils.Validator.email(email)) {
            window.LinkedOutUtils.Notifications.show('Email invalide', 'error');
            return;
        }
        
        if (!window.LinkedOutUtils.Validator.password(password)) {
            window.LinkedOutUtils.Notifications.show('Mot de passe trop court (min 6 caractères)', 'error');
            return;
        }
        
        if (!window.LinkedOutUtils.Validator.date(unemploymentStart)) {
            window.LinkedOutUtils.Notifications.show('Date de début de chômage invalide', 'error');
            return;
        }
        
        // Check if email already exists
        const users = window.LinkedOutData.getUsers();
        if (users.find(u => u.email === email)) {
            window.LinkedOutUtils.Notifications.show('Cet email est déjà utilisé', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: window.LinkedOutUtils.StringUtils.generateId(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            title: 'Nouveau membre de la communauté des inactifs',
            unemploymentStart: unemploymentStart,
            avatar: null,
            skills: [
                { name: 'Débutant en procrastination', endorsements: 1 },
                { name: 'Apprenti glandeur', endorsements: 0 }
            ],
            connections: [],
            badges: [],
            bio: 'Nouveau sur LinkedOut, prêt à découvrir l\'art de ne rien faire !',
            failures: ['Inscription sur LinkedOut... wait, c\'est un succès ça ?']
        };
        
        // Add user to database
        users.push(newUser);
        window.LinkedOutData.saveUsers(users);
        
        // Log in the new user
        this.login(newUser);
    }
    
    login(user) {
        this.currentUser = user;
        window.LinkedOutUtils.Storage.set('currentUser', user);
        
        window.LinkedOutUtils.Notifications.show(`Bienvenue ${user.name} !`, 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
        window.LinkedOutUtils.Debug.log('User logged in:', user.name);
    }
    
    logout() {
        this.currentUser = null;
        window.LinkedOutUtils.Storage.remove('currentUser');
        
        window.LinkedOutUtils.Notifications.show('Déconnexion réussie', 'success');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
        window.LinkedOutUtils.Debug.log('User logged out');
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    updateCurrentUser(updates) {
        if (!this.currentUser) return false;
        
        // Update current user object
        Object.assign(this.currentUser, updates);
        
        // Update in storage
        window.LinkedOutUtils.Storage.set('currentUser', this.currentUser);
        
        // Update in users database
        const users = window.LinkedOutData.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...this.currentUser };
            window.LinkedOutData.saveUsers(users);
        }
        
        window.LinkedOutUtils.Debug.log('User updated:', this.currentUser.name);
        return true;
    }
    
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.LinkedOutUtils.Notifications.show('Vous devez être connecté pour accéder à cette page', 'error');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
    
    // Get user by ID
    getUserById(userId) {
        const users = window.LinkedOutData.getUsers();
        return users.find(u => u.id === userId);
    }
    
    // Search users
    searchUsers(query) {
        const users = window.LinkedOutData.getUsers();
        const currentUserId = this.currentUser ? this.currentUser.id : null;
        
        return users.filter(user => {
            if (user.id === currentUserId) return false; // Exclude current user
            
            const searchText = query.toLowerCase().trim();
            return user.name.toLowerCase().includes(searchText) ||
                   user.title.toLowerCase().includes(searchText) ||
                   user.email.toLowerCase().includes(searchText);
        });
    }
    
    // Connection management
    sendConnectionRequest(targetUserId) {
        if (!this.currentUser) return false;
        
        const requests = window.LinkedOutUtils.Storage.get('connectionRequests', []);
        
        // Check if request already exists
        const existingRequest = requests.find(r => 
            r.fromUserId === this.currentUser.id && r.toUserId === targetUserId
        );
        
        if (existingRequest) {
            window.LinkedOutUtils.Notifications.show('Demande de connexion déjà envoyée', 'warning');
            return false;
        }
        
        // Check if already connected
        if (this.currentUser.connections.includes(targetUserId)) {
            window.LinkedOutUtils.Notifications.show('Vous êtes déjà connectés', 'warning');
            return false;
        }
        
        // Create request
        const newRequest = {
            id: window.LinkedOutUtils.StringUtils.generateId(),
            fromUserId: this.currentUser.id,
            toUserId: targetUserId,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        requests.push(newRequest);
        window.LinkedOutUtils.Storage.set('connectionRequests', requests);
        
        window.LinkedOutUtils.Notifications.show('Demande de connexion envoyée !', 'success');
        return true;
    }
    
    acceptConnectionRequest(requestId) {
        if (!this.currentUser) return false;
        
        const requests = window.LinkedOutUtils.Storage.get('connectionRequests', []);
        const request = requests.find(r => r.id === requestId);
        
        if (!request || request.toUserId !== this.currentUser.id) {
            return false;
        }
        
        // Add to connections
        const users = window.LinkedOutData.getUsers();
        const fromUser = users.find(u => u.id === request.fromUserId);
        const toUser = users.find(u => u.id === request.toUserId);
        
        if (fromUser && toUser) {
            fromUser.connections.push(toUser.id);
            toUser.connections.push(fromUser.id);
            
            // Update current user if it's one of them
            if (toUser.id === this.currentUser.id) {
                this.currentUser.connections.push(fromUser.id);
                window.LinkedOutUtils.Storage.set('currentUser', this.currentUser);
            }
            
            window.LinkedOutData.saveUsers(users);
        }
        
        // Remove request
        const updatedRequests = requests.filter(r => r.id !== requestId);
        window.LinkedOutUtils.Storage.set('connectionRequests', updatedRequests);
        
        window.LinkedOutUtils.Notifications.show('Connexion acceptée !', 'success');
        return true;
    }
    
    rejectConnectionRequest(requestId) {
        if (!this.currentUser) return false;
        
        const requests = window.LinkedOutUtils.Storage.get('connectionRequests', []);
        const updatedRequests = requests.filter(r => r.id !== requestId);
        window.LinkedOutUtils.Storage.set('connectionRequests', updatedRequests);
        
        window.LinkedOutUtils.Notifications.show('Demande rejetée', 'success');
        return true;
    }
    
    getPendingConnectionRequests() {
        if (!this.currentUser) return [];
        
        const requests = window.LinkedOutUtils.Storage.get('connectionRequests', []);
        return requests.filter(r => r.toUserId === this.currentUser.id && r.status === 'pending');
    }
}

// Initialize auth manager
window.LinkedOutAuth = new AuthManager();