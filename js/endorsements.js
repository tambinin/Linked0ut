// LinkedOut - Endorsements System

class EndorsementsManager {
    constructor() {
        this.users = [];
    }
    
    init() {
        this.users = window.LinkedOutData.getUsers();
    }
    
    endorseSkill(userId, skillName) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser || currentUser.id === userId) return false;
        
        const targetUser = this.users.find(u => u.id === userId);
        if (!targetUser) return false;
        
        const skill = targetUser.skills.find(s => s.name === skillName);
        if (!skill) return false;
        
        // Check if already endorsed by this user
        if (!skill.endorsedBy) skill.endorsedBy = [];
        
        if (skill.endorsedBy.includes(currentUser.id)) {
            window.LinkedOutUtils.Notifications.show('Vous avez déjà recommandé cette compétence', 'warning');
            return false;
        }
        
        // Add endorsement
        skill.endorsements = (skill.endorsements || 0) + 1;
        skill.endorsedBy.push(currentUser.id);
        
        // Save changes
        window.LinkedOutData.saveUsers(this.users);
        
        // Update current user if it's the target
        if (userId === currentUser.id) {
            window.LinkedOutAuth.updateCurrentUser(targetUser);
        }
        
        window.LinkedOutUtils.Notifications.show(`Vous avez recommandé "${skillName}" !`, 'success');
        return true;
    }
    
    removeEndorsement(userId, skillName) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser) return false;
        
        const targetUser = this.users.find(u => u.id === userId);
        if (!targetUser) return false;
        
        const skill = targetUser.skills.find(s => s.name === skillName);
        if (!skill || !skill.endorsedBy) return false;
        
        const endorsementIndex = skill.endorsedBy.indexOf(currentUser.id);
        if (endorsementIndex === -1) return false;
        
        // Remove endorsement
        skill.endorsements = Math.max(0, (skill.endorsements || 0) - 1);
        skill.endorsedBy.splice(endorsementIndex, 1);
        
        // Save changes
        window.LinkedOutData.saveUsers(this.users);
        
        // Update current user if it's the target
        if (userId === currentUser.id) {
            window.LinkedOutAuth.updateCurrentUser(targetUser);
        }
        
        window.LinkedOutUtils.Notifications.show(`Recommandation retirée pour "${skillName}"`, 'success');
        return true;
    }
    
    addSkill(userId, skillName) {
        const targetUser = this.users.find(u => u.id === userId);
        if (!targetUser) return false;
        
        // Check if skill already exists
        if (targetUser.skills.find(s => s.name === skillName)) {
            window.LinkedOutUtils.Notifications.show('Cette compétence existe déjà', 'warning');
            return false;
        }
        
        // Add new skill
        const newSkill = {
            name: skillName,
            endorsements: 0,
            endorsedBy: []
        };
        
        targetUser.skills.push(newSkill);
        
        // Save changes
        window.LinkedOutData.saveUsers(this.users);
        
        // Update current user if it's the target
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (currentUser && userId === currentUser.id) {
            window.LinkedOutAuth.updateCurrentUser(targetUser);
        }
        
        window.LinkedOutUtils.Notifications.show(`Compétence "${skillName}" ajoutée !`, 'success');
        return true;
    }
    
    removeSkill(userId, skillName) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser || currentUser.id !== userId) return false;
        
        const targetUser = this.users.find(u => u.id === userId);
        if (!targetUser) return false;
        
        // Remove skill
        targetUser.skills = targetUser.skills.filter(s => s.name !== skillName);
        
        // Save changes
        window.LinkedOutData.saveUsers(this.users);
        
        // Update current user
        window.LinkedOutAuth.updateCurrentUser(targetUser);
        
        window.LinkedOutUtils.Notifications.show(`Compétence "${skillName}" supprimée`, 'success');
        return true;
    }
    
    getTopSkills(limit = 10) {
        const allSkills = [];
        
        this.users.forEach(user => {
            user.skills.forEach(skill => {
                const existing = allSkills.find(s => s.name === skill.name);
                if (existing) {
                    existing.totalEndorsements += skill.endorsements || 0;
                    existing.userCount += 1;
                } else {
                    allSkills.push({
                        name: skill.name,
                        totalEndorsements: skill.endorsements || 0,
                        userCount: 1
                    });
                }
            });
        });
        
        return allSkills
            .sort((a, b) => b.totalEndorsements - a.totalEndorsements)
            .slice(0, limit);
    }
    
    getUserEndorsements(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return [];
        
        return user.skills.map(skill => ({
            ...skill,
            endorsers: skill.endorsedBy ? skill.endorsedBy.map(id => {
                const endorser = this.users.find(u => u.id === id);
                return endorser ? { id: endorser.id, name: endorser.name } : null;
            }).filter(Boolean) : []
        }));
    }
    
    canEndorse(userId, skillName) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser || currentUser.id === userId) return false;
        
        const targetUser = this.users.find(u => u.id === userId);
        if (!targetUser) return false;
        
        const skill = targetUser.skills.find(s => s.name === skillName);
        if (!skill) return false;
        
        return !skill.endorsedBy || !skill.endorsedBy.includes(currentUser.id);
    }
    
    renderSkillsList(userId, containerId, editable = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        const isOwnProfile = currentUser && currentUser.id === userId;
        
        container.innerHTML = user.skills.map(skill => {
            const canEndorse = this.canEndorse(userId, skill.name);
            const hasEndorsed = !canEndorse && currentUser && currentUser.id !== userId;
            
            return `
                <div class="skill-item" data-skill="${skill.name}">
                    <div class="skill-info">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-endorsements">${skill.endorsements || 0}</span>
                    </div>
                    <div class="skill-actions">
                        ${!isOwnProfile && canEndorse ? 
                            `<button class="endorse-btn" onclick="window.LinkedOutEndorsements.endorseSkill('${userId}', '${skill.name}')">
                                + Recommander
                            </button>` : 
                            !isOwnProfile && hasEndorsed ?
                            `<button class="endorse-btn endorsed" onclick="window.LinkedOutEndorsements.removeEndorsement('${userId}', '${skill.name}')">
                                ✓ Recommandé
                            </button>` : ''
                        }
                        ${isOwnProfile && editable ? 
                            `<button class="btn btn-secondary btn-sm" onclick="window.LinkedOutEndorsements.removeSkill('${userId}', '${skill.name}')">
                                Supprimer
                            </button>` : ''
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        if (isOwnProfile && editable) {
            container.innerHTML += `
                <div class="add-skill-form">
                    <input type="text" id="new-skill-input" placeholder="Ajouter une compétence..." class="form-control">
                    <button class="btn btn-primary" onclick="window.LinkedOutEndorsements.addSkillFromInput('${userId}')">Ajouter</button>
                </div>
            `;
        }
    }
    
    addSkillFromInput(userId) {
        const input = document.getElementById('new-skill-input');
        if (!input) return;
        
        const skillName = input.value.trim();
        if (!skillName) {
            window.LinkedOutUtils.Notifications.show('Veuillez entrer un nom de compétence', 'warning');
            return;
        }
        
        if (this.addSkill(userId, skillName)) {
            input.value = '';
            // Re-render skills list
            this.renderSkillsList(userId, 'skills-list', true);
        }
    }
    
    getSkillTrends() {
        const skills = this.getTopSkills(5);
        return skills.map(skill => ({
            name: skill.name,
            trend: '+' + Math.floor(Math.random() * 25 + 5) + '%', // Mock trend data
            totalEndorsements: skill.totalEndorsements
        }));
    }
}

// Initialize endorsements manager
window.LinkedOutEndorsements = new EndorsementsManager();