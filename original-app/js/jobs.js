// LinkedOut - Jobs Management

class JobsManager {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.appliedJobs = [];
        this.currentFilters = {};
        this.currentSort = 'date';
    }
    
    init() {
        this.jobs = window.LinkedOutData.getJobs();
        this.filteredJobs = [...this.jobs];
        this.appliedJobs = window.LinkedOutUtils.Storage.get('appliedJobs', []);
        
        window.LinkedOutUtils.Debug.log('Jobs manager initialized with', this.jobs.length, 'jobs');
    }
    
    loadJobs() {
        this.renderFeaturedJobs();
        this.renderJobs();
    }
    
    renderFeaturedJobs() {
        const container = document.getElementById('featured-jobs');
        if (!container) return;
        
        // Show first 3 jobs as featured
        const featuredJobs = this.jobs.slice(0, 3);
        
        container.innerHTML = featuredJobs.map(job => this.renderJobCard(job, true)).join('');
    }
    
    renderJobs() {
        const container = document.getElementById('jobs-container');
        if (!container) return;
        
        if (this.filteredJobs.length === 0) {
            container.innerHTML = `
                <div class="no-jobs">
                    <h3>Aucun emploi trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                    <button class="btn btn-primary" onclick="clearFilters()">Effacer les filtres</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredJobs.map(job => this.renderJobCard(job, false)).join('');
        
        // Update jobs count
        const jobsCount = document.getElementById('jobs-count');
        if (jobsCount) {
            jobsCount.textContent = `${this.filteredJobs.length} emplois trouvés`;
        }
    }
    
    renderJobCard(job, featured = false) {
        const hasApplied = this.appliedJobs.includes(job.id);
        const timeAgo = window.LinkedOutUtils.DateUtils.timeAgo(job.posted);
        const cardClass = featured ? 'job-card featured' : 'job-card';
        
        return `
            <div class="${cardClass}" data-job-id="${job.id}">
                <div class="job-header">
                    <div class="job-main-info">
                        <h3 class="job-title">${job.title}</h3>
                        <p class="job-company">${job.company}</p>
                        <p class="job-location">📍 ${job.location}</p>
                    </div>
                    <div class="job-meta">
                        <span class="job-salary">${job.salary}</span>
                        <span class="job-type">${job.type}</span>
                    </div>
                </div>
                
                <div class="job-description">
                    ${window.LinkedOutUtils.StringUtils.truncate(job.description, 150)}
                </div>
                
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>
                
                <div class="job-footer">
                    <div class="job-stats">
                        <span class="job-posted">Publié ${timeAgo}</span>
                        <span class="job-applications">${job.applications || 0} candidatures</span>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn-secondary" onclick="viewJobDetails('${job.id}')">
                            Voir détails
                        </button>
                        <button class="btn ${hasApplied ? 'btn-success' : 'btn-primary'}" 
                                onclick="quickApply('${job.id}')"
                                ${hasApplied ? 'disabled' : ''}>
                            ${hasApplied ? '✓ Candidature envoyée' : 'Postuler'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    searchJobs(query) {
        if (!query.trim()) {
            this.filteredJobs = [...this.jobs];
        } else {
            const searchTerm = query.toLowerCase().trim();
            this.filteredJobs = this.jobs.filter(job => 
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm) ||
                job.location.toLowerCase().includes(searchTerm) ||
                job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        this.applyCurrentFilters();
        this.sortJobs(this.currentSort);
        this.renderJobs();
        
        window.LinkedOutUtils.Debug.log('Search results:', this.filteredJobs.length, 'jobs found for:', query);
    }
    
    filterJobs(filters) {
        this.currentFilters = filters;
        this.applyCurrentFilters();
        this.renderJobs();
        
        window.LinkedOutUtils.Debug.log('Applied filters:', filters);
    }
    
    applyCurrentFilters() {
        let filtered = [...this.jobs];
        
        // Apply search if exists
        const searchInput = document.getElementById('job-search');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm) ||
                job.location.toLowerCase().includes(searchTerm) ||
                job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply filters
        if (this.currentFilters.salary) {
            filtered = filtered.filter(job => {
                const salary = job.salary.toLowerCase();
                switch (this.currentFilters.salary) {
                    case '0': return salary.includes('0€');
                    case 'negative': return salary.includes('négatif');
                    case 'dreams': return salary.includes('rêves');
                    case 'negotiable': return salary.includes('négociable');
                    default: return true;
                }
            });
        }
        
        if (this.currentFilters.type) {
            filtered = filtered.filter(job => job.type === this.currentFilters.type);
        }
        
        if (this.currentFilters.location) {
            filtered = filtered.filter(job => {
                const location = job.location.toLowerCase();
                switch (this.currentFilters.location) {
                    case 'home': return location.includes('domicile') || location.includes('lit');
                    case 'couch': return location.includes('canapé');
                    case 'remote': return location.includes('remote');
                    case 'imagination': return location.includes('imagination');
                    case 'nowhere': return location.includes('nulle part');
                    default: return true;
                }
            });
        }
        
        if (this.currentFilters.experience) {
            // Mock experience filtering based on requirements
            filtered = filtered.filter(job => {
                const requirements = job.requirements ? job.requirements.join(' ').toLowerCase() : '';
                switch (this.currentFilters.experience) {
                    case 'none': return requirements.includes('aucune') || requirements.includes('débutant');
                    case 'negative': return requirements.includes('négatif');
                    case 'sleeping': return requirements.includes('sommeil') || requirements.includes('sieste');
                    case 'procrastination': return requirements.includes('procrastination');
                    default: return true;
                }
            });
        }
        
        this.filteredJobs = filtered;
    }
    
    sortJobs(sortBy) {
        this.currentSort = sortBy;
        
        switch (sortBy) {
            case 'date':
                this.filteredJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
                break;
            case 'salary':
                this.filteredJobs.sort((a, b) => {
                    // Simple salary comparison (mock)
                    const aSalary = a.salary.includes('0€') ? 0 : 1;
                    const bSalary = b.salary.includes('0€') ? 0 : 1;
                    return aSalary - bSalary;
                });
                break;
            case 'applications':
                this.filteredJobs.sort((a, b) => (b.applications || 0) - (a.applications || 0));
                break;
            case 'random':
                this.filteredJobs.sort(() => Math.random() - 0.5);
                break;
        }
        
        this.renderJobs();
    }
    
    clearFilters() {
        this.currentFilters = {};
        this.filteredJobs = [...this.jobs];
        this.renderJobs();
        
        // Clear search input
        const searchInput = document.getElementById('job-search');
        if (searchInput) searchInput.value = '';
        
        window.LinkedOutUtils.Debug.log('Filters cleared');
    }
    
    viewJobDetails(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return;
        
        const modal = document.getElementById('job-details-modal');
        const title = document.getElementById('modal-job-title');
        const content = document.getElementById('job-details-content');
        const applyBtn = document.getElementById('apply-job-btn');
        
        title.textContent = job.title;
        applyBtn.dataset.jobId = jobId;
        
        const hasApplied = this.appliedJobs.includes(jobId);
        applyBtn.textContent = hasApplied ? 'Déjà postulé' : 'Postuler (en vain)';
        applyBtn.disabled = hasApplied;
        
        content.innerHTML = `
            <div class="job-details-full">
                <div class="job-header-full">
                    <h2>${job.title}</h2>
                    <div class="job-company-info">
                        <h3>${job.company}</h3>
                        <p>📍 ${job.location}</p>
                        <div class="job-meta-full">
                            <span class="job-salary-full">${job.salary}</span>
                            <span class="job-type-full">${job.type}</span>
                        </div>
                    </div>
                </div>
                
                <div class="job-section">
                    <h4>Description du poste</h4>
                    <p>${job.description}</p>
                </div>
                
                <div class="job-section">
                    <h4>Qualifications requises</h4>
                    <ul>
                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="job-section">
                    <h4>Compétences</h4>
                    <div class="job-tags-full">
                        ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="job-section">
                    <h4>Informations supplémentaires</h4>
                    <div class="job-info-grid">
                        <div class="info-item">
                            <span class="info-label">Publié le:</span>
                            <span class="info-value">${window.LinkedOutUtils.DateUtils.formatDate(job.posted)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Candidatures:</span>
                            <span class="info-value">${job.applications || 0}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Statut:</span>
                            <span class="info-value">Ouvert (mais inutile)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        window.LinkedOutUtils.Debug.log('Viewing job details:', job.title);
    }
    
    applyToJob(jobId) {
        if (this.appliedJobs.includes(jobId)) {
            window.LinkedOutUtils.Notifications.show('Vous avez déjà postulé à cet emploi', 'warning');
            return false;
        }
        
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return false;
        
        // Add to applied jobs
        this.appliedJobs.push(jobId);
        window.LinkedOutUtils.Storage.set('appliedJobs', this.appliedJobs);
        
        // Increment application count
        job.applications = (job.applications || 0) + 1;
        
        // Save updated jobs
        const allJobs = window.LinkedOutData.getJobs();
        const jobIndex = allJobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
            allJobs[jobIndex] = job;
            window.LinkedOutData.saveJobs ? window.LinkedOutData.saveJobs(allJobs) : 
                window.LinkedOutUtils.Storage.set('jobs', allJobs);
        }
        
        // Show success message with humor
        const messages = [
            'Candidature envoyée dans le vide !',
            'Félicitations ! Vous venez de perdre 30 secondes de votre vie.',
            'Votre candidature a été ajoutée à la pile "jamais lues".',
            'Bravo ! Vous excellez dans l\'art de l\'inutilité.',
            'Candidature reçue ! (Elle sera ignorée avec professionnalisme)'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        window.LinkedOutUtils.Notifications.show(randomMessage, 'success');
        
        // Re-render jobs to update UI
        this.renderJobs();
        
        // Update recent applications
        this.updateRecentApplications();
        
        window.LinkedOutUtils.Debug.log('Applied to job:', job.title);
        return true;
    }
    
    quickApply(jobId) {
        return this.applyToJob(jobId);
    }
    
    updateRecentApplications() {
        const container = document.getElementById('recent-applications');
        if (!container) return;
        
        if (this.appliedJobs.length === 0) {
            container.innerHTML = '<p class="no-applications">Aucune candidature envoyée</p>';
            return;
        }
        
        // Show last 5 applications
        const recentApplications = this.appliedJobs.slice(-5).reverse();
        
        container.innerHTML = recentApplications.map(jobId => {
            const job = this.jobs.find(j => j.id === jobId);
            if (!job) return '';
            
            return `
                <div class="application-item">
                    <div class="application-job">
                        <div class="application-title">${job.title}</div>
                        <div class="application-company">${job.company}</div>
                    </div>
                    <div class="application-status">
                        <span class="status-badge pending">En attente</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    getJobs() {
        return this.jobs;
    }
    
    getAppliedJobs() {
        return this.appliedJobs;
    }
    
    getJobById(jobId) {
        return this.jobs.find(job => job.id === jobId);
    }
    
    getJobsByCompany(company) {
        return this.jobs.filter(job => job.company.toLowerCase().includes(company.toLowerCase()));
    }
    
    getJobsByType(type) {
        return this.jobs.filter(job => job.type === type);
    }
    
    getJobStats() {
        const stats = {
            total: this.jobs.length,
            applied: this.appliedJobs.length,
            pending: this.appliedJobs.length, // All applications are pending in this mock
            rejected: 0, // No rejections yet (they're coming!)
            avgSalary: '0€/h', // Average of nothing
            topCompany: 'Aucune',
            newestJob: null,
            hottestJob: null
        };
        
        // Find newest job
        if (this.jobs.length > 0) {
            stats.newestJob = this.jobs.reduce((newest, job) => 
                new Date(job.posted) > new Date(newest.posted) ? job : newest
            );
        }
        
        // Find job with most applications
        if (this.jobs.length > 0) {
            stats.hottestJob = this.jobs.reduce((hottest, job) => 
                (job.applications || 0) > (hottest.applications || 0) ? job : hottest
            );
        }
        
        return stats;
    }
    
    exportApplications() {
        const applications = this.appliedJobs.map(jobId => {
            const job = this.getJobById(jobId);
            return {
                jobId: jobId,
                title: job ? job.title : 'Emploi introuvable',
                company: job ? job.company : 'Entreprise inconnue',
                appliedDate: new Date().toISOString(), // Mock date
                status: 'pending'
            };
        });
        
        const exportData = {
            applications: applications,
            totalApplied: this.appliedJobs.length,
            exportDate: new Date().toISOString(),
            user: window.LinkedOutAuth.getCurrentUser().name
        };
        
        return exportData;
    }
    
    generateCoverLetter(jobId) {
        const job = this.getJobById(jobId);
        if (!job) return '';
        
        const user = window.LinkedOutAuth.getCurrentUser();
        const templates = [
            `Cher ${job.company},\n\nJe suis ${user.name}, expert en ${user.title.toLowerCase()}. Votre offre pour ${job.title} m'intéresse car elle correspond parfaitement à mon profil de non-travailleur professionnel.\n\nCordialement,\n${user.name}`,
            
            `Bonjour,\n\nAprès ${window.LinkedOutUtils.DateUtils.daysSince(user.unemploymentStart)} jours de chômage intensif, je pense être le candidat idéal pour ${job.title}. Mon expertise en procrastination et ma motivation négative sont exactement ce que vous cherchez.\n\nBien à vous,\n${user.name}`,
            
            `Madame, Monsieur,\n\nVotre annonce pour ${job.title} a retenu mon attention car j'ai exactement les compétences que vous ne recherchez pas. Mon CV parle de lui-même (il ne dit rien d'intéressant).\n\nSalutations,\n${user.name}`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }
}

// Initialize jobs manager
window.LinkedOutJobs = new JobsManager();

// Global functions for HTML onclick handlers
window.viewJobDetails = (jobId) => window.LinkedOutJobs.viewJobDetails(jobId);
window.quickApply = (jobId) => window.LinkedOutJobs.quickApply(jobId);