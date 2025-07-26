// LinkedOut - Badges System

class BadgesManager {
    constructor() {
        this.badgeDefinitions = [];
        this.users = [];
    }
    
    init() {
        this.badgeDefinitions = window.LinkedOutData.getBadges();
        this.users = window.LinkedOutData.getUsers();
    }
    
    checkAndAwardBadges(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return [];
        
        const newBadges = [];
        
        this.badgeDefinitions.forEach(badgeDefinition => {
            // Check if user already has this badge
            if (user.badges.find(b => b.id === badgeDefinition.id && b.earned)) {
                return;
            }
            
            // Check if user meets requirements
            if (this.checkBadgeRequirement(user, badgeDefinition)) {
                this.awardBadge(userId, badgeDefinition.id);
                newBadges.push(badgeDefinition);
            }
        });
        
        return newBadges;
    }
    
    checkBadgeRequirement(user, badgeDefinition) {
        const requirement = badgeDefinition.requirement;
        
        switch (requirement) {
            case 'unemployment_days >= 100':
                return window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart) >= 100;
                
            case 'unemployment_days >= 365':
                return window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart) >= 365;
                
            case 'skill_netflix >= 30':
                const netflixSkill = user.skills.find(s => s.name.toLowerCase().includes('netflix'));
                return netflixSkill && netflixSkill.endorsements >= 30;
                
            case 'skill_couch >= 25':
                const couchSkill = user.skills.find(s => 
                    s.name.toLowerCase().includes('canapé') || 
                    s.name.toLowerCase().includes('sieste') ||
                    s.name.toLowerCase().includes('couch')
                );
                return couchSkill && couchSkill.endorsements >= 25;
                
            case 'no_interviews_6_months':
                // Mock data - in real app this would check interview history
                return window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart) >= 180;
                
            case 'delivery_orders >= 50':
                // Mock data - in real app this would check delivery history
                return window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart) >= 30;
                
            case 'gaming_hours >= 500':
                const gamingSkill = user.skills.find(s => 
                    s.name.toLowerCase().includes('gaming') || 
                    s.name.toLowerCase().includes('jeu') ||
                    s.name.toLowerCase().includes('game')
                );
                return gamingSkill && gamingSkill.endorsements >= 40;
                
            case 'social_media_posts >= 100':
                // Mock data - in real app this would check post history
                const posts = window.LinkedOutData.getPosts();
                const userPosts = posts.filter(p => p.userId === user.id);
                return userPosts.length >= 5; // Lowered for demo
                
            case 'creative_excuses >= 20':
                const excuseSkill = user.skills.find(s => 
                    s.name.toLowerCase().includes('excuse') || 
                    s.name.toLowerCase().includes('évitement') ||
                    s.name.toLowerCase().includes('créat')
                );
                return excuseSkill && excuseSkill.endorsements >= 15;
                
            case 'late_wake_ups >= 100':
                // Mock data - award to users with certain skills
                const brunchSkill = user.skills.find(s => 
                    s.name.toLowerCase().includes('brunch') || 
                    s.name.toLowerCase().includes('réveil') ||
                    s.name.toLowerCase().includes('matin')
                );
                return brunchSkill && brunchSkill.endorsements >= 20;
                
            case 'procrastination_level >= 1000':
                const procrastSkill = user.skills.find(s => 
                    s.name.toLowerCase().includes('procrastination') || 
                    s.name.toLowerCase().includes('remise') ||
                    s.name.toLowerCase().includes('report')
                );
                return procrastSkill && procrastSkill.endorsements >= 35;
                
            case 'coffee_breaks >= 365':
                const coffeeSkill = user.skills.find(s => 
                    s.name.toLowerCase().includes('café') || 
                    s.name.toLowerCase().includes('pause') ||
                    s.name.toLowerCase().includes('coffee')
                );
                return coffeeSkill && coffeeSkill.endorsements >= 25;
                
            default:
                return false;
        }
    }
    
    awardBadge(userId, badgeId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return false;
        
        // Check if badge already exists
        const existingBadge = user.badges.find(b => b.id === badgeId);
        if (existingBadge) {
            existingBadge.earned = true;
            existingBadge.earnedDate = new Date().toISOString();
        } else {
            user.badges.push({
                id: badgeId,
                earned: true,
                earnedDate: new Date().toISOString()
            });
        }
        
        // Save changes
        window.LinkedOutData.saveUsers(this.users);
        
        // Update current user if it's the target
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (currentUser && userId === currentUser.id) {
            window.LinkedOutAuth.updateCurrentUser(user);
        }
        
        const badgeDefinition = this.badgeDefinitions.find(b => b.id === badgeId);
        if (badgeDefinition) {
            window.LinkedOutUtils.Notifications.show(
                `Nouveau badge débloqué : ${badgeDefinition.title} ${badgeDefinition.icon}!`, 
                'success', 
                5000
            );
        }
        
        window.LinkedOutUtils.Debug.log('Badge awarded:', badgeId, 'to user:', userId);
        return true;
    }
    
    getUserBadges(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return [];
        
        return this.badgeDefinitions.map(definition => {
            const userBadge = user.badges.find(b => b.id === definition.id);
            return {
                ...definition,
                earned: userBadge ? userBadge.earned : false,
                earnedDate: userBadge ? userBadge.earnedDate : null,
                progress: this.getBadgeProgress(user, definition)
            };
        });
    }
    
    getBadgeProgress(user, badgeDefinition) {
        const requirement = badgeDefinition.requirement;
        
        switch (requirement) {
            case 'unemployment_days >= 100':
                const days100 = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
                return Math.min(100, Math.max(0, days100));
                
            case 'unemployment_days >= 365':
                const days365 = window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart);
                return Math.min(100, Math.max(0, (days365 / 365) * 100));
                
            case 'skill_netflix >= 30':
                const netflixSkill = user.skills.find(s => s.name.toLowerCase().includes('netflix'));
                const netflixEndorsements = netflixSkill ? netflixSkill.endorsements : 0;
                return Math.min(100, Math.max(0, (netflixEndorsements / 30) * 100));
                
            default:
                return 0;
        }
    }
    
    renderBadges(userId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const userBadges = this.getUserBadges(userId);
        
        container.innerHTML = userBadges.map(badge => {
            const earnedClass = badge.earned ? 'earned' : 'locked';
            const earnedDate = badge.earnedDate ? 
                window.LinkedOutUtils.DateUtils.formatDate(badge.earnedDate) : '';
            
            return `
                <div class="badge ${earnedClass}" data-badge-id="${badge.id}">
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-content">
                        <div class="badge-title">${badge.title}</div>
                        <div class="badge-description">${badge.description}</div>
                        ${badge.earned ? 
                            `<div class="badge-earned-date">Obtenu le ${earnedDate}</div>` :
                            `<div class="badge-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${badge.progress}%"></div>
                                </div>
                                <div class="progress-text">${Math.round(badge.progress)}%</div>
                            </div>`
                        }
                    </div>
                </div>
            `;
        }).join('');
    }
    
    getRecentBadges(userId, limit = 3) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return [];
        
        const earnedBadges = user.badges
            .filter(b => b.earned)
            .map(userBadge => {
                const definition = this.badgeDefinitions.find(d => d.id === userBadge.id);
                return definition ? { ...definition, ...userBadge } : null;
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate));
        
        return earnedBadges.slice(0, limit);
    }
    
    getBadgeStats() {
        const stats = {
            totalBadges: this.badgeDefinitions.length,
            totalAwarded: 0,
            mostEarnedBadge: null,
            rarest: null
        };
        
        const badgeCounts = {};
        
        this.users.forEach(user => {
            user.badges.forEach(badge => {
                if (badge.earned) {
                    stats.totalAwarded++;
                    badgeCounts[badge.id] = (badgeCounts[badge.id] || 0) + 1;
                }
            });
        });
        
        if (Object.keys(badgeCounts).length > 0) {
            const sortedBadges = Object.entries(badgeCounts)
                .sort((a, b) => b[1] - a[1]);
            
            stats.mostEarnedBadge = {
                id: sortedBadges[0][0],
                count: sortedBadges[0][1]
            };
            
            stats.rarest = {
                id: sortedBadges[sortedBadges.length - 1][0],
                count: sortedBadges[sortedBadges.length - 1][1]
            };
        }
        
        return stats;
    }
    
    autoCheckBadges() {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser) return;
        
        // Check for new badges every time user performs an action
        this.checkAndAwardBadges(currentUser.id);
    }
    
    // Category-based badge filtering
    getBadgesByCategory() {
        const categories = {
            unemployment: [],
            skills: [],
            social: [],
            lifestyle: []
        };
        
        this.badgeDefinitions.forEach(badge => {
            if (badge.id.includes('unemployed')) {
                categories.unemployment.push(badge);
            } else if (badge.id.includes('skill') || badge.id.includes('netflix') || badge.id.includes('gaming')) {
                categories.skills.push(badge);
            } else if (badge.id.includes('social') || badge.id.includes('excuse')) {
                categories.social.push(badge);
            } else {
                categories.lifestyle.push(badge);
            }
        });
        
        return categories;
    }
}

// Initialize badges manager
window.LinkedOutBadges = new BadgesManager();