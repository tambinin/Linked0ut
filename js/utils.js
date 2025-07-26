// LinkedOut - Utility Functions

// Local Storage utilities
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// Date utilities
const DateUtils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    formatDateTime: (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    timeAgo: (date) => {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}j`;
        
        return DateUtils.formatDate(date);
    },
    
    daysSince: (startDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const diffTime = Math.abs(now - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};

// DOM utilities
const DOM = {
    createElement: (tag, className = '', innerHTML = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    show: (element) => {
        if (element) element.classList.remove('hidden');
    },
    
    hide: (element) => {
        if (element) element.classList.add('hidden');
    },
    
    toggle: (element) => {
        if (element) element.classList.toggle('hidden');
    },
    
    addActive: (element) => {
        if (element) element.classList.add('active');
    },
    
    removeActive: (element) => {
        if (element) element.classList.remove('active');
    },
    
    toggleActive: (element) => {
        if (element) element.classList.toggle('active');
    }
};

// String utilities
const StringUtils = {
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    getInitials: (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substr(0, 2);
    },
    
    truncate: (text, length = 100) => {
        if (text.length <= length) return text;
        return text.substr(0, length) + '...';
    },
    
    slugify: (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    },
    
    capitalize: (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
};

// Validation utilities
const Validator = {
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    password: (password) => {
        return password.length >= 6;
    },
    
    required: (value) => {
        return value && value.trim().length > 0;
    },
    
    date: (date) => {
        return !isNaN(Date.parse(date));
    }
};

// Animation utilities
const Animations = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const fadeEffect = setInterval(() => {
            if (!element.style.opacity) {
                element.style.opacity = 0;
            }
            if (element.style.opacity < 1) {
                element.style.opacity = parseFloat(element.style.opacity) + 0.1;
            } else {
                clearInterval(fadeEffect);
            }
        }, duration / 10);
    },
    
    fadeOut: (element, duration = 300) => {
        element.style.opacity = '1';
        
        const fadeEffect = setInterval(() => {
            if (element.style.opacity > 0) {
                element.style.opacity = parseFloat(element.style.opacity) - 0.1;
            } else {
                clearInterval(fadeEffect);
                element.style.display = 'none';
            }
        }, duration / 10);
    },
    
    slideDown: (element, duration = 300) => {
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        const increment = targetHeight / (duration / 10);
        
        const slideEffect = setInterval(() => {
            const currentHeight = parseInt(element.style.height);
            if (currentHeight < targetHeight) {
                element.style.height = Math.min(currentHeight + increment, targetHeight) + 'px';
            } else {
                clearInterval(slideEffect);
                element.style.height = 'auto';
            }
        }, 10);
    }
};

// Notification system
const Notifications = {
    show: (message, type = 'success', duration = 3000) => {
        const notification = DOM.createElement('div', `notification ${type}`, message);
        
        // Create container if it doesn't exist
        let container = document.querySelector('.notifications-container');
        if (!container) {
            container = DOM.createElement('div', 'notifications-container');
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            Animations.fadeOut(notification, 300);
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        return notification;
    }
};

// Debug utilities
const Debug = {
    log: (...args) => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('[LinkedOut]', ...args);
        }
    },
    
    error: (...args) => {
        console.error('[LinkedOut Error]', ...args);
    },
    
    warn: (...args) => {
        console.warn('[LinkedOut Warning]', ...args);
    }
};

// Export utilities for use in other files
window.LinkedOutUtils = {
    Storage,
    DateUtils,
    DOM,
    StringUtils,
    Validator,
    Animations,
    Notifications,
    Debug
};