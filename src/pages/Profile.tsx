import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  styled,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import Header from '../components/Layout/Header';
import SidebarLeft from '../components/Layout/SidebarLeft';
import SidebarRight from '../components/Layout/SidebarRight';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/theme';
import { BADGE_DEFINITIONS } from '../data/mockData';

const ProfileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px !important',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 3),
  },
}));

const MainLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  marginTop: theme.spacing(10),
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

const ProfileCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  overflow: 'visible',
  position: 'relative',
}));

const CoverBox = styled(Box)(({ theme }) => ({
  height: '120px',
  background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.yellow} 100%)`,
  borderRadius: `${theme.spacing(1)} ${theme.spacing(1)} 0 0`,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  position: 'absolute',
  top: '60px',
  left: theme.spacing(3),
  border: `4px solid ${colors.white}`,
  backgroundColor: colors.blue,
  color: colors.white,
  fontSize: '2rem',
  fontWeight: 600,
}));

const BadgeItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const Profile: React.FC = () => {
  const { user } = useAuth();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const calculateUnemploymentDays = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEarnedBadges = () => {
    if (!user) return [];
    return user.badges
      .filter(badge => badge.earned)
      .map(userBadge => {
        const badgeDefinition = BADGE_DEFINITIONS.find(def => def.id === userBadge.id);
        return { ...badgeDefinition, ...userBadge };
      })
      .filter(badge => badge.title); // Filter out undefined badges
  };

  if (!user) return null;

  const unemploymentDays = calculateUnemploymentDays(user.unemploymentStart);
  const earnedBadges = getEarnedBadges();

  return (
    <>
      <Header />
      <ProfileContainer>
        <MainLayout>
          <SidebarLeft />
          
          <MainContent>
            {/* Profile Header */}
            <ProfileCard>
              <CoverBox />
              <ProfileAvatar>
                {getUserInitials(user.name)}
              </ProfileAvatar>
              
              <CardContent sx={{ pt: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                      {user.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      {user.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🏆 {unemploymentDays} jours de chômage professionnel
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{
                      borderColor: colors.blue,
                      color: colors.blue,
                    }}
                  >
                    Modifier le profil
                  </Button>
                </Box>

                {user.bio && (
                  <Typography variant="body1" color="text.primary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {user.bio}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color={colors.blue}>
                      {user.connections.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Connexions
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color={colors.blue}>
                      {user.skills.reduce((total, skill) => total + skill.endorsements, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Endorsements
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color={colors.blue}>
                      {earnedBadges.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Badges obtenus
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </ProfileCard>

            {/* Skills Section */}
            <ProfileCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Compétences inutiles
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{ color: colors.blue }}
                  >
                    Ajouter
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={`${skill.name} (${skill.endorsements})`}
                      variant="outlined"
                      sx={{
                        borderColor: colors.blue,
                        color: colors.blue,
                        '&:hover': {
                          backgroundColor: `${colors.blue}08`,
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </ProfileCard>

            {/* Badges Section */}
            <ProfileCard>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Badges de l'inactivité
                </Typography>
                
                {earnedBadges.length > 0 ? (
                  earnedBadges.map((badge) => (
                    <BadgeItem key={badge.id}>
                      <Typography variant="h4" sx={{ mr: 2 }}>
                        {badge.icon}
                      </Typography>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {badge.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {badge.description}
                        </Typography>
                        {badge.earnedDate && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            Obtenu le {new Date(badge.earnedDate).toLocaleDateString('fr-FR')}
                          </Typography>
                        )}
                      </Box>
                    </BadgeItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun badge obtenu pour le moment. Continuez à procrastiner !
                  </Typography>
                )}
              </CardContent>
            </ProfileCard>

            {/* Failures Section */}
            {user.failures.length > 0 && (
              <ProfileCard>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Échecs professionnels mémorables
                  </Typography>
                  
                  <List>
                    {user.failures.map((failure, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '8px' }}>🤦‍♂️</span>
                                {failure}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < user.failures.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </ProfileCard>
            )}
          </MainContent>
          
          <SidebarRight />
        </MainLayout>
      </ProfileContainer>
    </>
  );
};

export default Profile;