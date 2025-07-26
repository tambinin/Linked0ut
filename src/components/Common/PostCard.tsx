import React, { useState } from 'react';
import {
  Card,
  CardActions,
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  Collapse,
  styled,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { colors } from '../../styles/theme';
import { Post, SAMPLE_USERS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: theme.spacing(2, 2, 1, 2),
}));

const AuthorInfo = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  flex: 1,
}));

const PostContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 1, 2),
}));

const PostText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  lineHeight: 1.5,
  color: colors.greyText,
  whiteSpace: 'pre-line',
  wordBreak: 'break-word',
}));

const PostActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderTop: `1px solid ${colors.greyMedium}`,
  justifyContent: 'space-around',
}));

const ActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: 1,
  color: active ? colors.blue : colors.greyDark,
  backgroundColor: active ? `${colors.blue}08` : 'transparent',
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: theme.spacing(1),
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: active ? `${colors.blue}12` : colors.greyLight,
  },
}));

const CommentSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${colors.greyMedium}`,
  padding: theme.spacing(1, 2),
}));

const CommentInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

const TimeDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: colors.greyDark,
}));

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
}

const PostCardComponent: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Find the post author
  const author = SAMPLE_USERS.find(u => u.id === post.userId);
  
  // Check if current user liked this post
  const isLiked = user ? post.likedBy.includes(user.id) : false;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = () => {
    onLike(post.id);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleShare = () => {
    onShare(post.id);
    // Copy post content to clipboard
    navigator.clipboard.writeText(`${author?.name}: ${post.content}`);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `il y a ${diffMins}min`;
    } else if (diffHours < 24) {
      return `il y a ${diffHours}h`;
    } else {
      return `il y a ${diffDays}j`;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!author) return null;

  return (
    <PostCard>
      <PostHeader>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            fontSize: '1rem',
            bgcolor: colors.blue,
            color: colors.white,
          }}
        >
          {getUserInitials(author.name)}
        </Avatar>
        
        <AuthorInfo>
          <Typography variant="body1" fontWeight={600} color="text.primary">
            {author.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {author.title}
          </Typography>
          <TimeDisplay>
            {formatTimeAgo(post.timestamp)}
          </TimeDisplay>
        </AuthorInfo>

        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ color: colors.greyDark }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 200 }
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>
            Suivre {author.name}
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>
            Masquer ce post
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>
            Signaler
          </MenuItem>
        </Menu>
      </PostHeader>

      <PostContent>
        <PostText>
          {post.content}
        </PostText>
      </PostContent>

      {/* Engagement Stats */}
      {(post.likes > 0 || post.comments > 0) && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {post.likes > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: colors.blue,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 0.5,
                  }}
                >
                  <ThumbUpIcon sx={{ fontSize: '10px', color: colors.white }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {post.likes}
                </Typography>
              </Box>
            )}
            
            {post.comments > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
                onClick={() => setShowComments(!showComments)}
              >
                {post.comments} commentaire{post.comments > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      <PostActions>
        <ActionButton
          active={isLiked}
          startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          onClick={handleLike}
        >
          J'aime
        </ActionButton>
        
        <ActionButton
          startIcon={<CommentIcon />}
          onClick={() => setShowComments(!showComments)}
        >
          Commenter
        </ActionButton>
        
        <ActionButton
          startIcon={<ShareIcon />}
          onClick={handleShare}
        >
          Partager
        </ActionButton>
      </PostActions>

      {/* Comment Section */}
      <Collapse in={showComments}>
        <CommentSection>
          <CommentInput>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.75rem',
                bgcolor: colors.blue,
                color: colors.white,
              }}
            >
              {user ? getUserInitials(user.name) : 'U'}
            </Avatar>
            <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Ajoutez un commentaire..."
                variant="outlined"
                size="small"
                fullWidth
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    fontSize: '0.875rem',
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                sx={{ color: colors.blue }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </CommentInput>

          {/* Placeholder for existing comments */}
          {post.comments > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textAlign: 'center', py: 1 }}>
              Voir les {post.comments} commentaires...
            </Typography>
          )}
        </CommentSection>
      </Collapse>
    </PostCard>
  );
};

export default PostCardComponent;