import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  Tabs,
  Tab,
  styled,
} from '@mui/material';
import {
  Photo as PhotoIcon,
  VideoCall as VideoIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import Header from '../components/Layout/Header';
import SidebarLeft from '../components/Layout/SidebarLeft';
import SidebarRight from '../components/Layout/SidebarRight';
import PostCard from '../components/Common/PostCard';
import NotificationToast from '../components/Common/NotificationToast';
import { useAuth } from '../context/AuthContext.jsx';
import { colors } from '../styles/theme.js';
import { SAMPLE_POSTS, SAMPLE_NOTIFICATIONS } from '../data/mockData.js';

const DashboardContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px !important',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 3),
  },
}));

const MainLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  marginTop: theme.spacing(10), // Space for fixed header
  minHeight: 'calc(100vh - 80px)',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: '550px',
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    margin: 0,
  },
}));

const PostComposer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const ComposerInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const ComposerActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${colors.greyMedium}`,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  color: colors.greyDark,
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5, 1.5),
  '&:hover': {
    backgroundColor: colors.greyLight,
  },
}));

const FeedFilters = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
}));

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [filterTab, setFilterTab] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Initialize posts
  useEffect(() => {
    const savedPosts = localStorage.getItem('linkedout_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(SAMPLE_POSTS);
      localStorage.setItem('linkedout_posts', JSON.stringify(SAMPLE_POSTS));
    }
  }, []);

  // Auto-display humorous notifications
  useEffect(() => {
    if (!user) return;

    // Schedule notifications to appear over time
    const scheduleNotifications = () => {
      const shuffledNotifications = [...SAMPLE_NOTIFICATIONS].sort(() => Math.random() - 0.5);
      
      shuffledNotifications.forEach((notification, index) => {
        setTimeout(() => {
          setNotifications(prev => [...prev, { ...notification, displayId: Date.now() + index }]);
        }, (index + 1) * 8000); // Show one every 8 seconds
      });
    };

    // Start showing notifications after 3 seconds
    const initialTimeout = setTimeout(scheduleNotifications, 3000);

    return () => clearTimeout(initialTimeout);
  }, [user]);

  const removeNotification = (displayId) => {
    setNotifications(prev => prev.filter(n => n.displayId !== displayId));
  };

  // Initialize posts
  useEffect(() => {
    const savedPosts = localStorage.getItem('linkedout_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(SAMPLE_POSTS);
      localStorage.setItem('linkedout_posts', JSON.stringify(SAMPLE_POSTS));
    }
  }, []);

  // Filter posts based on selected tab
  useEffect(() => {
    let filtered = [...posts].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    switch (filterTab) {
      case 1: // Mes connexions
        if (user) {
          filtered = filtered.filter(post => 
            user.connections.includes(post.userId) || post.userId === user.id
          );
        }
        break;
      case 2: // Exploits (posts with trophy emoji)
        filtered = filtered.filter(post => post.content.includes('🏆'));
        break;
      case 3: // Échecs (posts with facepalm emoji)
        filtered = filtered.filter(post => post.content.includes('🤦‍♂️') || post.content.includes('😅'));
        break;
      default:
        // All posts
        break;
    }

    setFilteredPosts(filtered);
  }, [posts, filterTab, user]);

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handlePostSubmit = () => {
    if (!postText.trim() || !user) return;

    const newPost = {
      id: `post_${Date.now()}`,
      userId: user.id,
      content: postText.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      likedBy: [],
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('linkedout_posts', JSON.stringify(updatedPosts));
    setPostText('');
  };

  const handleLike = (postId) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(user.id);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== user.id)
            : [...post.likedBy, user.id],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('linkedout_posts', JSON.stringify(updatedPosts));
  };

  const handleComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('linkedout_posts', JSON.stringify(updatedPosts));
  };

  const handleShare = (postId) => {
    // For now, just show a success message
    console.log(`Post ${postId} shared!`);
  };

  const insertQuickText = (text) => {
    setPostText(prev => prev + (prev ? '\n\n' : '') + text);
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <DashboardContainer>
        <MainLayout>
          <SidebarLeft />
          
          <MainContent>
            {/* Post Composer */}
            <PostComposer>
              <CardContent>
                <ComposerInput>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      fontSize: '1rem',
                      bgcolor: colors.blue,
                      color: colors.white,
                    }}
                  >
                    {getUserInitials(user.name)}
                  </Avatar>
                  
                  <TextField
                    placeholder="Partagez vos exploits de glandouille..."
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </ComposerInput>

                <ComposerActions>
                  <ActionButtons>
                    <ActionButton
                      startIcon={<PhotoIcon />}
                      onClick={() => insertQuickText('🏆 Nouveau record personnel !')}
                    >
                      Exploit
                    </ActionButton>
                    <ActionButton
                      startIcon={<VideoIcon />}
                      onClick={() => insertQuickText('🤦‍♂️ Échec mémorable du jour :')}
                    >
                      Échec
                    </ActionButton>
                    <ActionButton
                      startIcon={<ArticleIcon />}
                      onClick={() => insertQuickText('💡 Astuce pour optimiser son chômage :')}
                    >
                      Astuce
                    </ActionButton>
                  </ActionButtons>

                  <Button
                    variant="contained"
                    onClick={handlePostSubmit}
                    disabled={!postText.trim()}
                    sx={{
                      bgcolor: colors.blue,
                      color: colors.white,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        bgcolor: '#1E3A6F',
                      },
                    }}
                  >
                    Publier
                  </Button>
                </ComposerActions>
              </CardContent>
            </PostComposer>

            {/* Feed Filters */}
            <FeedFilters>
              <Tabs
                value={filterTab}
                onChange={(e, newValue) => setFilterTab(newValue)}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: colors.blue,
                  },
                }}
              >
                <Tab 
                  label="Tous les posts" 
                  sx={{ 
                    textTransform: 'none', 
                    fontSize: '0.875rem',
                    color: colors.greyDark,
                    '&.Mui-selected': { color: colors.blue },
                  }} 
                />
                <Tab 
                  label="Mes connexions" 
                  sx={{ 
                    textTransform: 'none', 
                    fontSize: '0.875rem',
                    color: colors.greyDark,
                    '&.Mui-selected': { color: colors.blue },
                  }} 
                />
                <Tab 
                  label="Exploits 🏆" 
                  sx={{ 
                    textTransform: 'none', 
                    fontSize: '0.875rem',
                    color: colors.greyDark,
                    '&.Mui-selected': { color: colors.blue },
                  }} 
                />
                <Tab 
                  label="Échecs 🤦‍♂️" 
                  sx={{ 
                    textTransform: 'none', 
                    fontSize: '0.875rem',
                    color: colors.greyDark,
                    '&.Mui-selected': { color: colors.blue },
                  }} 
                />
              </Tabs>
            </FeedFilters>

            {/* Posts Feed */}
            <Box>
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))
              ) : (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Aucun post à afficher dans cette catégorie.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Commencez par publier votre premier exploit de glandouille !
                  </Typography>
                </Card>
              )}
            </Box>
          </MainContent>
          
          <SidebarRight />
        </MainLayout>
      </DashboardContainer>

      {/* Auto-displaying notifications */}
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.displayId}
          notification={notification}
          onClose={() => removeNotification(notification.displayId)}
        />
      ))}
    </>
  );
};

export default Dashboard;