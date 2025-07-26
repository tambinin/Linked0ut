// LinkedOut - Network Management

class NetworkManager {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.filteredUsers = [];
        this.currentFilters = {};
    }
    
    init() {
        this.users = window.LinkedOutData.getUsers();
        this.currentUser = window.LinkedOutAuth.getCurrentUser();
        this.filteredUsers = [...this.users];
        
        window.LinkedOutUtils.Debug.log('Network manager initialized');
    }
    
    loadConnections() {
        const container = document.getElementById('connections-grid');
        if (!container) return;
        
        if (!this.currentUser.connections || this.currentUser.connections.length === 0) {
            container.innerHTML = `
                <div class="no-connections">
                    <h3>Aucune connexion encore</h3>
                    <p>Commencez à vous connecter avec d'autres glandeurs professionnels !</p>
                    <button class="btn btn-primary" onclick="switchNetworkTab('discover')">Découvrir des profils</button>
                </div>
            `;
            return;
        }
        
        const connections = this.currentUser.connections.map(connectionId => {
            return this.users.find(u => u.id === connectionId);
        }).filter(Boolean);
        
        container.innerHTML = connections.map(user => this.renderConnectionCard(user)).join('');
    }
    
    loadDiscover() {
        const container = document.getElementById('discover-grid');
        if (!container) return;
        
        // Get users that are not current user and not already connected
        const suggestedUsers = this.users.filter(user => 
            user.id !== this.currentUser.id && 
            !this.currentUser.connections.includes(user.id)
        );
        
        if (suggestedUsers.length === 0) {
            container.innerHTML = `
                <div class="no-suggestions">
                    <h3>Vous êtes connecté à tous les glandeurs !</h3>
                    <p>Félicitations ! Votre réseau de paresse est complet.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = suggestedUsers.map(user => this.renderDiscoverCard(user)).join('');
    }
    
    loadRequests() {
        const container = document.getElementById('requests-list');
        if (!container) return;
        
        const requests = window.LinkedOutAuth.getPendingConnectionRequests();
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="no-requests">
                    <h3>Aucune demande de connexion</h3>
                    <p>Personne ne veut encore faire partie de votre réseau de glandeurs.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = requests.map(request => {
            const fromUser = window.LinkedOutAuth.getUserById(request.fromUserId);
            if (!fromUser) return '';
            
            return this.renderRequestCard(fromUser, request.id);
        }).join('');
    }
    
    renderConnectionCard(user) {
        const initials = window.LinkedOutUtils.StringUtils.getInitials(user.name);
        const unemploymentDays = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
        const totalEndorsements = user.skills.reduce((sum, skill) => sum + (skill.endorsements || 0), 0);
        const mutualConnections = this.getMutualConnections(user.id);
        
        return `
            <div class="connection-card">
                <div class="connection-header">
                    <div class="connection-avatar">${initials}</div>
                    <div class="connection-info">
                        <h3 class="connection-name">${user.name}</h3>
                        <p class="connection-title">${user.title}</p>
                        <p class="connection-unemployment">${unemploymentDays} jours de chômage</p>
                    </div>
                </div>
                
                <div class="connection-stats">
                    <div class="stat-item">
                        <span class="stat-number">${user.connections.length}</span>
                        <span class="stat-label">Connexions</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${totalEndorsements}</span>
                        <span class="stat-label">Endorsements</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${user.skills.length}</span>
                        <span class="stat-label">Compétences</span>
                    </div>
                </div>
                
                <div class="connection-skills">
                    ${user.skills.slice(0, 3).map(skill => 
                        `<span class="skill-tag">${skill.name}</span>`
                    ).join('')}
                    ${user.skills.length > 3 ? `<span class="skill-more">+${user.skills.length - 3}</span>` : ''}
                </div>
                
                ${mutualConnections.length > 0 ? `
                    <div class="mutual-connections">
                        <small>${mutualConnections.length} connexion(s) en commun</small>
                    </div>
                ` : ''}
                
                <div class="connection-actions">
                    <button class="btn btn-secondary" onclick="viewUserProfile('${user.id}')">Voir le profil</button>
                    <button class="btn btn-primary" onclick="sendMessage('${user.id}')">Message</button>
                </div>
            </div>
        `;
    }
    
    renderDiscoverCard(user) {
        const initials = window.LinkedOutUtils.StringUtils.getInitials(user.name);
        const unemploymentDays = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
        const totalEndorsements = user.skills.reduce((sum, skill) => sum + (skill.endorsements || 0), 0);
        const mutualConnections = this.getMutualConnections(user.id);
        const connectionReason = this.getConnectionReason(user);
        
        return `
            <div class="discover-card">
                <div class="discover-header">
                    <div class="discover-avatar">${initials}</div>
                    <div class="discover-info">
                        <h3 class="discover-name">${user.name}</h3>
                        <p class="discover-title">${user.title}</p>
                        <p class="discover-unemployment">${unemploymentDays} jours de chômage</p>
                    </div>
                </div>
                
                <div class="connection-reason">
                    <span class="reason-icon">💡</span>
                    <span class="reason-text">${connectionReason}</span>
                </div>
                
                <div class="discover-stats">
                    <div class="stat-item">
                        <span class="stat-number">${user.connections.length}</span>
                        <span class="stat-label">Connexions</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${totalEndorsements}</span>
                        <span class="stat-label">Endorsements</span>
                    </div>
                </div>
                
                <div class="discover-skills">
                    ${user.skills.slice(0, 2).map(skill => 
                        `<span class="skill-tag">${skill.name}</span>`
                    ).join('')}
                </div>
                
                ${mutualConnections.length > 0 ? `
                    <div class="mutual-connections">
                        <small>${mutualConnections.length} connexion(s) en commun</small>
                    </div>
                ` : ''}
                
                <div class="discover-actions">
                    <button class="btn btn-secondary" onclick="viewUserProfile('${user.id}')">Voir le profil</button>
                    <button class="btn btn-primary" onclick="sendConnectionRequest('${user.id}')">Se connecter</button>
                </div>
            </div>
        `;
    }
    
    renderRequestCard(user, requestId) {
        const initials = window.LinkedOutUtils.StringUtils.getInitials(user.name);
        const unemploymentDays = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
        const mutualConnections = this.getMutualConnections(user.id);
        
        return `
            <div class="request-card">
                <div class="request-header">
                    <div class="request-avatar">${initials}</div>
                    <div class="request-info">
                        <h3 class="request-name">${user.name}</h3>
                        <p class="request-title">${user.title}</p>
                        <p class="request-unemployment">${unemploymentDays} jours de chômage</p>
                        <p class="request-message">Souhaite se connecter avec vous</p>
                    </div>
                </div>
                
                <div class="request-skills">
                    ${user.skills.slice(0, 3).map(skill => 
                        `<span class="skill-tag">${skill.name}</span>`
                    ).join('')}
                </div>
                
                ${mutualConnections.length > 0 ? `
                    <div class="mutual-connections">
                        <small>${mutualConnections.length} connexion(s) en commun</small>
                    </div>
                ` : ''}
                
                <div class="request-actions">
                    <button class="btn btn-secondary" onclick="viewUserProfile('${user.id}')">Voir le profil</button>
                    <button class="btn btn-success" onclick="acceptConnectionRequest('${requestId}')">Accepter</button>
                    <button class="btn btn-danger" onclick="rejectConnectionRequest('${requestId}')">Refuser</button>
                </div>
            </div>
        `;
    }
    
    getMutualConnections(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user || !user.connections) return [];
        
        return this.currentUser.connections.filter(connectionId => 
            user.connections.includes(connectionId)
        );
    }
    
    getConnectionReason(user) {
        const reasons = [];
        
        // Check for similar skills
        const commonSkills = user.skills.filter(skill => 
            this.currentUser.skills.some(mySkill => 
                mySkill.name.toLowerCase() === skill.name.toLowerCase()
            )
        );
        
        if (commonSkills.length > 0) {
            reasons.push(`Compétences similaires: ${commonSkills[0].name}`);
        }
        
        // Check unemployment duration
        const userDays = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
        const myDays = window.LinkedOutUtils.DateUtils.daysSince(this.currentUser.unemploymentStart);
        
        if (Math.abs(userDays - myDays) < 100) {
            reasons.push('Période de chômage similaire');
        }
        
        // Check mutual connections
        const mutualConnections = this.getMutualConnections(user.id);
        if (mutualConnections.length > 0) {
            reasons.push('Connexions en commun');
        }
        
        // Default reasons
        const defaultReasons = [
            'Expert en glandouille comme vous',
            'Profil de chômeur professionnel',
            'Pourrait partager des techniques de procrastination',
            'Niveau de paresse compatible',
            'Candidat idéal pour votre réseau'
        ];
        
        if (reasons.length === 0) {
            reasons.push(defaultReasons[Math.floor(Math.random() * defaultReasons.length)]);
        }
        
        return reasons[0];
    }
    
    searchUsers(query) {
        const searchTerm = query.toLowerCase().trim();
        const results = this.users.filter(user => 
            user.id !== this.currentUser.id &&
            !this.currentUser.connections.includes(user.id) &&
            (
                user.name.toLowerCase().includes(searchTerm) ||
                user.title.toLowerCase().includes(searchTerm) ||
                (user.bio && user.bio.toLowerCase().includes(searchTerm)) ||
                user.skills.some(skill => skill.name.toLowerCase().includes(searchTerm))
            )
        );
        
        const container = document.getElementById('discover-grid');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>Aucun glandeur trouvé</h3>
                    <p>Essayez avec d'autres mots-clés</p>
                </div>
            `;
        } else {
            container.innerHTML = results.map(user => this.renderDiscoverCard(user)).join('');
        }
        
        window.LinkedOutUtils.Debug.log('Search results:', results.length, 'users found for:', query);
    }
    
    applyFilters(filters) {
        this.currentFilters = filters;
        
        let filtered = this.users.filter(user => 
            user.id !== this.currentUser.id &&
            !this.currentUser.connections.includes(user.id)
        );
        
        // Filter by unemployment duration
        if (filters.unemployment) {
            filtered = filtered.filter(user => {
                const days = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
                switch (filters.unemployment) {
                    case 'novice': return days < 100;
                    case 'intermediate': return days >= 100 && days <= 365;
                    case 'expert': return days > 365 && days <= 1000;
                    case 'legend': return days > 1000;
                    default: return true;
                }
            });
        }
        
        // Filter by skills
        if (filters.skill) {
            filtered = filtered.filter(user => 
                user.skills.some(skill => 
                    skill.name.toLowerCase().includes(filters.skill.toLowerCase())
                )
            );
        }
        
        // Filter by badges
        if (filters.badges) {
            filtered = filtered.filter(user => 
                user.badges && user.badges.some(badge => 
                    badge.earned && badge.id.includes(filters.badges)
                )
            );
        }
        
        // Update discover grid
        const container = document.getElementById('discover-grid');
        if (container) {
            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <h3>Aucun glandeur correspondant</h3>
                        <p>Essayez de modifier vos filtres</p>
                    </div>
                `;
            } else {
                container.innerHTML = filtered.map(user => this.renderDiscoverCard(user)).join('');
            }
        }
        
        window.LinkedOutUtils.Debug.log('Applied filters:', filters, 'Results:', filtered.length);
    }
    
    clearFilters() {
        this.currentFilters = {};
        this.loadDiscover();
        
        window.LinkedOutUtils.Debug.log('Filters cleared');
    }
    
    sendConnectionRequest(userId) {
        if (window.LinkedOutAuth.sendConnectionRequest(userId)) {
            // Update the UI to show request sent
            const button = document.querySelector(`button[onclick="sendConnectionRequest('${userId}')"]`);
            if (button) {
                button.textContent = 'Demande envoyée';
                button.disabled = true;
                button.classList.remove('btn-primary');
                button.classList.add('btn-secondary');
            }
        }
    }
    
    acceptConnectionRequest(requestId) {
        if (window.LinkedOutAuth.acceptConnectionRequest(requestId)) {
            this.loadRequests();
            this.loadConnections();
            this.updateNetworkStats();
        }
    }
    
    rejectConnectionRequest(requestId) {
        if (window.LinkedOutAuth.rejectConnectionRequest(requestId)) {
            this.loadRequests();
            this.updateNetworkStats();
        }
    }
    
    updateNetworkStats() {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        const pendingRequests = window.LinkedOutAuth.getPendingConnectionRequests();
        
        document.getElementById('total-connections').textContent = currentUser.connections.length;
        document.getElementById('connections-count').textContent = currentUser.connections.length;
        document.getElementById('pending-requests').textContent = pendingRequests.length;
        document.getElementById('requests-count').textContent = pendingRequests.length;
        
        // Calculate extended network
        let extendedNetwork = new Set(currentUser.connections);
        currentUser.connections.forEach(connectionId => {
            const connection = window.LinkedOutAuth.getUserById(connectionId);
            if (connection && connection.connections) {
                connection.connections.forEach(id => {
                    if (id !== currentUser.id) {
                        extendedNetwork.add(id);
                    }
                });
            }
        });
        document.getElementById('network-size').textContent = extendedNetwork.size;
    }
    
    getNetworkInsights() {
        const connections = this.currentUser.connections.map(id => 
            this.users.find(u => u.id === id)
        ).filter(Boolean);
        
        // Calculate insights
        const totalUnemploymentDays = connections.reduce((sum, user) => 
            sum + window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart), 0
        );
        
        const avgUnemploymentDays = connections.length > 0 ? 
            Math.round(totalUnemploymentDays / connections.length) : 0;
        
        // Find most common skill
        const skillCounts = {};
        connections.forEach(user => {
            user.skills.forEach(skill => {
                skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
            });
        });
        
        const topSkill = Object.keys(skillCounts).reduce((a, b) => 
            skillCounts[a] > skillCounts[b] ? a : b, 'Aucune'
        );
        
        return {
            avgUnemploymentDays,
            topSkill,
            totalConnections: connections.length,
            newConnectionsThisWeek: 2 // Mock data
        };
    }
    
    exportConnections() {
        const connections = this.currentUser.connections.map(id => {
            const user = this.users.find(u => u.id === id);
            return user ? {
                name: user.name,
                title: user.title,
                unemploymentDays: window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart),
                skills: user.skills.map(s => s.name).join(', '),
                connections: user.connections.length
            } : null;
        }).filter(Boolean);
        
        return {
            exportDate: new Date().toISOString(),
            totalConnections: connections.length,
            user: this.currentUser.name,
            connections: connections
        };
    }
    
    recommendConnections() {
        // Get users not already connected
        const candidates = this.users.filter(user => 
            user.id !== this.currentUser.id &&
            !this.currentUser.connections.includes(user.id)
        );
        
        // Score each candidate
        const scored = candidates.map(user => {
            let score = 0;
            
            // Similar skills
            const commonSkills = user.skills.filter(skill => 
                this.currentUser.skills.some(mySkill => 
                    mySkill.name.toLowerCase() === skill.name.toLowerCase()
                )
            );
            score += commonSkills.length * 10;
            
            // Similar unemployment duration
            const userDays = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
            const myDays = window.LinkedOutUtils.DateUtils.daysSince(this.currentUser.unemploymentStart);
            const daysDiff = Math.abs(userDays - myDays);
            if (daysDiff < 50) score += 15;
            else if (daysDiff < 100) score += 10;
            else if (daysDiff < 200) score += 5;
            
            // Mutual connections
            const mutualConnections = this.getMutualConnections(user.id);
            score += mutualConnections.length * 5;
            
            // Activity level (more endorsements = more active)
            const totalEndorsements = user.skills.reduce((sum, skill) => sum + (skill.endorsements || 0), 0);
            if (totalEndorsements > 50) score += 10;
            else if (totalEndorsements > 20) score += 5;
            
            return { user, score };
        });
        
        // Sort by score and return top recommendations
        return scored
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map(item => item.user);
    }
}

// Initialize network manager
window.LinkedOutNetwork = new NetworkManager();

// Global functions for HTML onclick handlers
window.sendConnectionRequest = (userId) => window.LinkedOutNetwork.sendConnectionRequest(userId);
window.acceptConnectionRequest = (requestId) => window.LinkedOutNetwork.acceptConnectionRequest(requestId);
window.rejectConnectionRequest = (requestId) => window.LinkedOutNetwork.rejectConnectionRequest(requestId);

window.viewUserProfile = (userId) => {
    // For demo, just show a notification
    const user = window.LinkedOutAuth.getUserById(userId);
    if (user) {
        window.LinkedOutUtils.Notifications.show(`Visualisation du profil de ${user.name}`, 'success');
    }
};

window.sendMessage = (userId) => {
    // For demo, just show a notification
    const user = window.LinkedOutAuth.getUserById(userId);
    if (user) {
        window.LinkedOutUtils.Notifications.show(`Message envoyé à ${user.name} !`, 'success');
    }
};