// LinkedOut - Feed Management

class FeedManager {
    constructor() {
        this.currentFilter = 'all';
        this.posts = [];
        this.comments = [];
    }
    
    loadFeed() {
        this.posts = window.LinkedOutData.getPosts();
        this.comments = window.LinkedOutData.getComments();
        this.renderPosts();
    }
    
    renderPosts() {
        const container = document.getElementById('posts-feed');
        if (!container) return;
        
        let filteredPosts = this.getFilteredPosts();
        
        // Sort by timestamp (newest first)
        filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (filteredPosts.length === 0) {
            container.innerHTML = '<div class="no-posts">Aucun post à afficher</div>';
            return;
        }
        
        container.innerHTML = filteredPosts.map(post => this.renderPost(post)).join('');
        
        // Add event listeners for post interactions
        this.attachPostEventListeners();
    }
    
    getFilteredPosts() {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        
        switch (this.currentFilter) {
            case 'connections':
                return this.posts.filter(post => 
                    currentUser.connections.includes(post.userId) || post.userId === currentUser.id
                );
            case 'achievements':
                return this.posts.filter(post => 
                    post.content.includes('🏆') || 
                    post.content.toLowerCase().includes('exploit') ||
                    post.content.toLowerCase().includes('record')
                );
            case 'failures':
                return this.posts.filter(post => 
                    post.content.includes('🤦‍♂️') || 
                    post.content.toLowerCase().includes('échec') ||
                    post.content.toLowerCase().includes('raté')
                );
            default:
                return this.posts;
        }
    }
    
    renderPost(post) {
        const user = window.LinkedOutAuth.getUserById(post.userId);
        if (!user) return '';
        
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        const isLiked = post.likedBy && post.likedBy.includes(currentUser.id);
        const initials = window.LinkedOutUtils.StringUtils.getInitials(user.name);
        const timeAgo = window.LinkedOutUtils.DateUtils.timeAgo(post.timestamp);
        const postComments = this.getPostComments(post.id);
        
        return `
            <article class="post" data-post-id="${post.id}">
                <header class="post-header">
                    <div class="post-avatar">${initials}</div>
                    <div class="post-info">
                        <h3>${user.name}</h3>
                        <div class="post-meta">
                            <span class="post-title">${user.title}</span>
                            <span class="post-time">${timeAgo}</span>
                        </div>
                    </div>
                </header>
                
                <div class="post-content">
                    ${this.formatPostContent(post.content)}
                </div>
                
                <footer class="post-actions">
                    <button class="post-action ${isLiked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
                        ${isLiked ? '❤️' : '🤍'} ${post.likes || 0}
                    </button>
                    <button class="post-action" data-action="comment" data-post-id="${post.id}">
                        💬 ${postComments.length}
                    </button>
                    <button class="post-action" data-action="share" data-post-id="${post.id}">
                        🔄 Partager
                    </button>
                </footer>
                
                <div class="post-comments" id="comments-${post.id}" style="display: none;">
                    <div class="comments-list">
                        ${postComments.map(comment => this.renderComment(comment)).join('')}
                    </div>
                    <div class="comment-form">
                        <textarea class="comment-input" placeholder="Ajoutez un commentaire..." rows="2"></textarea>
                        <button class="btn btn-primary btn-sm" onclick="window.LinkedOutFeed.addComment('${post.id}', this)">Commenter</button>
                    </div>
                </div>
            </article>
        `;
    }
    
    renderComment(comment) {
        const user = window.LinkedOutAuth.getUserById(comment.userId);
        if (!user) return '';
        
        const initials = window.LinkedOutUtils.StringUtils.getInitials(user.name);
        const timeAgo = window.LinkedOutUtils.DateUtils.timeAgo(comment.timestamp);
        
        return `
            <div class="comment">
                <div class="comment-avatar">${initials}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${user.name}</span>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                    <div class="comment-text">${this.formatPostContent(comment.content)}</div>
                </div>
            </div>
        `;
    }
    
    formatPostContent(content) {
        // Add line breaks
        let formatted = content.replace(/\n/g, '<br>');
        
        // Make hashtags clickable (basic implementation)
        formatted = formatted.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
        
        // Make mentions clickable (basic implementation)
        formatted = formatted.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
        
        return formatted;
    }
    
    getPostComments(postId) {
        return this.comments.filter(comment => comment.postId === postId);
    }
    
    attachPostEventListeners() {
        // Like buttons
        document.querySelectorAll('[data-action="like"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = e.target.dataset.postId;
                this.toggleLike(postId);
            });
        });
        
        // Comment buttons
        document.querySelectorAll('[data-action="comment"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = e.target.dataset.postId;
                this.toggleComments(postId);
            });
        });
        
        // Share buttons
        document.querySelectorAll('[data-action="share"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = e.target.dataset.postId;
                this.sharePost(postId);
            });
        });
    }
    
    createPost(content) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser) return;
        
        const newPost = {
            id: window.LinkedOutUtils.StringUtils.generateId(),
            userId: currentUser.id,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0,
            likedBy: []
        };
        
        // Add to posts array
        this.posts.unshift(newPost);
        
        // Save to storage
        window.LinkedOutData.savePosts(this.posts);
        
        // Re-render feed
        this.renderPosts();
        
        // Show success notification
        window.LinkedOutUtils.Notifications.show('Post publié avec succès !', 'success');
        
        window.LinkedOutUtils.Debug.log('Post created:', newPost);
    }
    
    toggleLike(postId) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser) return;
        
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        if (!post.likedBy) post.likedBy = [];
        
        const isLiked = post.likedBy.includes(currentUser.id);
        
        if (isLiked) {
            // Remove like
            post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
            post.likes = Math.max(0, (post.likes || 0) - 1);
        } else {
            // Add like
            post.likedBy.push(currentUser.id);
            post.likes = (post.likes || 0) + 1;
        }
        
        // Save changes
        window.LinkedOutData.savePosts(this.posts);
        
        // Update UI
        this.renderPosts();
        
        window.LinkedOutUtils.Debug.log('Like toggled for post:', postId);
    }
    
    toggleComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (!commentsSection) return;
        
        if (commentsSection.style.display === 'none') {
            commentsSection.style.display = 'block';
            // Focus on comment input
            const input = commentsSection.querySelector('.comment-input');
            if (input) input.focus();
        } else {
            commentsSection.style.display = 'none';
        }
    }
    
    addComment(postId, buttonElement) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser) return;
        
        const commentForm = buttonElement.closest('.comment-form');
        const input = commentForm.querySelector('.comment-input');
        const content = input.value.trim();
        
        if (!content) {
            window.LinkedOutUtils.Notifications.show('Veuillez écrire un commentaire', 'warning');
            return;
        }
        
        const newComment = {
            id: window.LinkedOutUtils.StringUtils.generateId(),
            postId: postId,
            userId: currentUser.id,
            content: content,
            timestamp: new Date().toISOString()
        };
        
        // Add to comments
        this.comments.push(newComment);
        
        // Update post comment count
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.comments = (post.comments || 0) + 1;
        }
        
        // Save changes
        window.LinkedOutData.saveComments(this.comments);
        window.LinkedOutData.savePosts(this.posts);
        
        // Clear input
        input.value = '';
        
        // Re-render posts to show new comment
        this.renderPosts();
        
        // Keep comments section open
        setTimeout(() => {
            this.toggleComments(postId);
        }, 100);
        
        window.LinkedOutUtils.Notifications.show('Commentaire ajouté !', 'success');
        
        window.LinkedOutUtils.Debug.log('Comment added:', newComment);
    }
    
    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        const user = window.LinkedOutAuth.getUserById(post.userId);
        if (!user) return;
        
        // Simple share functionality - copy link to clipboard
        const shareText = `Regardez ce post de ${user.name} sur LinkedOut !\n\n"${window.LinkedOutUtils.StringUtils.truncate(post.content, 100)}"`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                window.LinkedOutUtils.Notifications.show('Post copié dans le presse-papiers !', 'success');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
        
        window.LinkedOutUtils.Debug.log('Post shared:', postId);
    }
    
    fallbackShare(text) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            window.LinkedOutUtils.Notifications.show('Post copié dans le presse-papiers !', 'success');
        } catch (err) {
            window.LinkedOutUtils.Notifications.show('Impossible de copier le post', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    filterPosts(filter) {
        this.currentFilter = filter;
        this.renderPosts();
        
        window.LinkedOutUtils.Debug.log('Feed filtered:', filter);
    }
    
    deletePost(postId) {
        const currentUser = window.LinkedOutAuth.getCurrentUser();
        if (!currentUser) return;
        
        const post = this.posts.find(p => p.id === postId);
        if (!post || post.userId !== currentUser.id) {
            window.LinkedOutUtils.Notifications.show('Vous ne pouvez supprimer que vos propres posts', 'error');
            return;
        }
        
        // Remove post
        this.posts = this.posts.filter(p => p.id !== postId);
        
        // Remove associated comments
        this.comments = this.comments.filter(c => c.postId !== postId);
        
        // Save changes
        window.LinkedOutData.savePosts(this.posts);
        window.LinkedOutData.saveComments(this.comments);
        
        // Re-render
        this.renderPosts();
        
        window.LinkedOutUtils.Notifications.show('Post supprimé', 'success');
        
        window.LinkedOutUtils.Debug.log('Post deleted:', postId);
    }
    
    getUserPosts(userId) {
        return this.posts.filter(post => post.userId === userId);
    }
    
    getPostById(postId) {
        return this.posts.find(post => post.id === postId);
    }
}

// Initialize feed manager
window.LinkedOutFeed = new FeedManager();