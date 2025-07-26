// LinkedOut - Profile Management

class ProfileManager {
    constructor() {
        this.currentProfile = null;
        this.users = [];
    }
    
    init(userId) {
        this.users = window.LinkedOutData.getUsers();
        this.currentProfile = this.users.find(u => u.id === userId);
        
        if (!this.currentProfile) {
            window.LinkedOutUtils.Notifications.show('Profil non trouvé', 'error');
            return false;
        }
        
        window.LinkedOutUtils.Debug.log('Profile manager initialized for:', this.currentProfile.name);
        return true;
    }
    
    updateProfile(userId, updates) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return false;
        
        // Validate updates
        if (updates.name && !window.LinkedOutUtils.Validator.required(updates.name)) {
            window.LinkedOutUtils.Notifications.show('Le nom est requis', 'error');
            return false;
        }
        
        if (updates.email && !window.LinkedOutUtils.Validator.email(updates.email)) {
            window.LinkedOutUtils.Notifications.show('Email invalide', 'error');
            return false;
        }
        
        if (updates.unemploymentStart && !window.LinkedOutUtils.Validator.date(updates.unemploymentStart)) {
            window.LinkedOutUtils.Notifications.show('Date invalide', 'error');
            return false;
        }
        
        // Apply updates
        Object.assign(user, updates);
        
        // Update current profile if it's the same user
        if (this.currentProfile && this.currentProfile.id === userId) {
            Object.assign(this.currentProfile, updates);
        }
        
        // Save to storage
        window.LinkedOutData.saveUsers(this.users);
        
        window.LinkedOutUtils.Notifications.show('Profil mis à jour !', 'success');
        return true;
    }
    
    calculateProfileCompleteness(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return 0;
        
        let score = 0;
        const maxScore = 100;
        
        // Basic info (40%)
        if (user.name) score += 10;
        if (user.title) score += 10;
        if (user.bio && user.bio.length > 20) score += 10;
        if (user.unemploymentStart) score += 10;
        
        // Skills (20%)
        if (user.skills && user.skills.length >= 3) score += 20;
        else if (user.skills && user.skills.length > 0) score += 10;
        
        // Social activity (25%)
        const posts = window.LinkedOutData.getPosts().filter(p => p.userId === userId);
        if (posts.length >= 5) score += 15;
        else if (posts.length > 0) score += 5;
        
        if (user.connections && user.connections.length >= 3) score += 10;
        else if (user.connections && user.connections.length > 0) score += 5;
        
        // Engagement (15%)
        const earnedBadges = user.badges ? user.badges.filter(b => b.earned).length : 0;
        if (earnedBadges >= 3) score += 15;
        else if (earnedBadges > 0) score += 5;
        
        return Math.min(score, maxScore);
    }
    
    getProfileCompletnessTips(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return [];
        
        const tips = [];
        
        if (!user.bio || user.bio.length < 20) {
            tips.push('Ajoutez une bio plus détaillée');
        }
        
        if (!user.skills || user.skills.length < 3) {
            tips.push('Ajoutez plus de compétences');
        }
        
        const posts = window.LinkedOutData.getPosts().filter(p => p.userId === userId);
        if (posts.length < 3) {
            tips.push('Publiez plus de posts');
        }
        
        if (!user.connections || user.connections.length < 3) {
            tips.push('Connectez-vous avec d\'autres utilisateurs');
        }
        
        if (!user.failures || user.failures.length < 3) {
            tips.push('Partagez plus d\'échecs professionnels');
        }
        
        const earnedBadges = user.badges ? user.badges.filter(b => b.earned).length : 0;
        if (earnedBadges < 3) {
            tips.push('Débloquez plus de badges');
        }
        
        return tips;
    }
    
    addProfilePicture(userId, imageData) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return false;
        
        // In a real app, this would upload to a server
        // For now, we'll store as base64 in localStorage (not recommended for production)
        user.avatar = imageData;
        
        // Update current profile if it's the same user
        if (this.currentProfile && this.currentProfile.id === userId) {
            this.currentProfile.avatar = imageData;
        }
        
        // Save to storage
        window.LinkedOutData.saveUsers(this.users);
        
        window.LinkedOutUtils.Notifications.show('Photo de profil mise à jour !', 'success');
        return true;
    }
    
    removeProfilePicture(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return false;
        
        user.avatar = null;
        
        // Update current profile if it's the same user
        if (this.currentProfile && this.currentProfile.id === userId) {
            this.currentProfile.avatar = null;
        }
        
        // Save to storage
        window.LinkedOutData.saveUsers(this.users);
        
        window.LinkedOutUtils.Notifications.show('Photo de profil supprimée', 'success');
        return true;
    }
    
    getProfileStats(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        const posts = window.LinkedOutData.getPosts().filter(p => p.userId === userId);
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
        const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
        const totalEndorsements = user.skills ? user.skills.reduce((sum, skill) => sum + (skill.endorsements || 0), 0) : 0;
        const earnedBadges = user.badges ? user.badges.filter(b => b.earned).length : 0;
        const unemploymentDays = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
        
        return {
            connections: user.connections ? user.connections.length : 0,
            posts: posts.length,
            likes: totalLikes,
            comments: totalComments,
            endorsements: totalEndorsements,
            badges: earnedBadges,
            unemploymentDays: unemploymentDays,
            skills: user.skills ? user.skills.length : 0,
            failures: user.failures ? user.failures.length : 0
        };
    }
    
    getRecentActivity(userId, limit = 10) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return [];
        
        const activities = [];
        
        // Recent posts
        const posts = window.LinkedOutData.getPosts()
            .filter(p => p.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 3);
        
        posts.forEach(post => {
            activities.push({
                type: 'post',
                icon: '📝',
                text: `Post publié: "${window.LinkedOutUtils.StringUtils.truncate(post.content, 50)}"`,
                timestamp: post.timestamp
            });
        });
        
        // Recent badges
        const recentBadges = user.badges
            ? user.badges.filter(b => b.earned)
                .sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate))
                .slice(0, 3)
            : [];
        
        const badgeDefinitions = window.LinkedOutData.getBadges();
        recentBadges.forEach(userBadge => {
            const definition = badgeDefinitions.find(b => b.id === userBadge.id);
            if (definition) {
                activities.push({
                    type: 'badge',
                    icon: '🏆',
                    text: `Badge "${definition.title}" obtenu`,
                    timestamp: userBadge.earnedDate
                });
            }
        });
        
        // Recent endorsements (mock data)
        if (user.skills && user.skills.length > 0) {
            activities.push({
                type: 'endorsement',
                icon: '👍',
                text: 'Nouveaux endorsements reçus',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
            });
        }
        
        // Sort by timestamp and limit
        return activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
    
    exportProfile(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        const stats = this.getProfileStats(userId);
        const activity = this.getRecentActivity(userId);
        
        const exportData = {
            profile: {
                name: user.name,
                title: user.title,
                bio: user.bio,
                unemploymentStart: user.unemploymentStart,
                unemploymentDays: stats.unemploymentDays
            },
            stats: stats,
            skills: user.skills || [],
            badges: user.badges || [],
            failures: user.failures || [],
            recentActivity: activity,
            exportDate: new Date().toISOString()
        };
        
        return exportData;
    }
    
    importProfile(userId, importData) {
        const user = this.users.find(u => u.id === userId);
        if (!user || !importData) return false;
        
        try {
            // Import basic profile data
            if (importData.profile) {
                if (importData.profile.name) user.name = importData.profile.name;
                if (importData.profile.title) user.title = importData.profile.title;
                if (importData.profile.bio) user.bio = importData.profile.bio;
                if (importData.profile.unemploymentStart) user.unemploymentStart = importData.profile.unemploymentStart;
            }
            
            // Import skills
            if (importData.skills && Array.isArray(importData.skills)) {
                user.skills = importData.skills;
            }
            
            // Import failures
            if (importData.failures && Array.isArray(importData.failures)) {
                user.failures = importData.failures;
            }
            
            // Update current profile if it's the same user
            if (this.currentProfile && this.currentProfile.id === userId) {
                Object.assign(this.currentProfile, user);
            }
            
            // Save to storage
            window.LinkedOutData.saveUsers(this.users);
            
            window.LinkedOutUtils.Notifications.show('Profil importé avec succès !', 'success');
            return true;
            
        } catch (error) {
            window.LinkedOutUtils.Debug.error('Error importing profile:', error);
            window.LinkedOutUtils.Notifications.show('Erreur lors de l\'importation', 'error');
            return false;
        }
    }
    
    searchProfiles(query, filters = {}) {
        let results = this.users.filter(user => {
            const searchText = query.toLowerCase();
            return user.name.toLowerCase().includes(searchText) ||
                   user.title.toLowerCase().includes(searchText) ||
                   (user.bio && user.bio.toLowerCase().includes(searchText)) ||
                   (user.skills && user.skills.some(skill => 
                       skill.name.toLowerCase().includes(searchText)
                   ));
        });
        
        // Apply filters
        if (filters.minUnemploymentDays) {
            results = results.filter(user => 
                window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart) >= filters.minUnemploymentDays
            );
        }
        
        if (filters.hasSkill) {
            results = results.filter(user =>
                user.skills && user.skills.some(skill =>
                    skill.name.toLowerCase().includes(filters.hasSkill.toLowerCase())
                )
            );
        }
        
        if (filters.minConnections) {
            results = results.filter(user =>
                user.connections && user.connections.length >= filters.minConnections
            );
        }
        
        return results;
    }
    
    generateProfileUrl(userId) {
        return `profile.html?id=${userId}`;
    }
    
    getProfileFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        
        if (userId) {
            return this.users.find(u => u.id === userId);
        }
        
        // Default to current user
        return window.LinkedOutAuth.getCurrentUser();
    }
    
    renderProfileCard(userId, containerId, compact = false) {
        const user = this.users.find(u => u.id === userId);
        const container = document.getElementById(containerId);
        
        if (!user || !container) return false;
        
        const initials = window.LinkedOutUtils.StringUtils.getInitials(user.name);
        const unemploymentDays = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
        const stats = this.getProfileStats(userId);
        
        if (compact) {
            container.innerHTML = `
                <div class="profile-card-compact">
                    <div class="profile-avatar-small">${initials}</div>
                    <div class="profile-info">
                        <h4>${user.name}</h4>
                        <p>${user.title}</p>
                        <div class="profile-stats-compact">
                            <span>${unemploymentDays} jours</span>
                            <span>${stats.connections} connexions</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="profile-card-full">
                    <div class="profile-header">
                        <div class="profile-avatar-large">${initials}</div>
                        <h2>${user.name}</h2>
                        <p>${user.title}</p>
                        <div class="unemployment-badge">
                            ${unemploymentDays} jours sans emploi
                        </div>
                    </div>
                    <div class="profile-stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">${stats.connections}</span>
                            <span class="stat-label">Connexions</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${stats.endorsements}</span>
                            <span class="stat-label">Endorsements</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${stats.badges}</span>
                            <span class="stat-label">Badges</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${stats.posts}</span>
                            <span class="stat-label">Posts</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return true;
    }
}

// Initialize profile manager
window.LinkedOutProfile = new ProfileManager();