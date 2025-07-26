import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  styled,
} from '@mui/material';
import {
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  Group as GroupIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/theme';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '270px',
  position: 'sticky',
  top: '70px', // Height of header + some margin
  height: 'calc(100vh - 80px)',
  overflowY: 'auto',
  paddingRight: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  overflow: 'visible',
  position: 'relative',
}));

const CoverBox = styled(Box)(({ theme }) => ({
  height: '54px',
  background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.yellow} 100%)`,
  borderRadius: `${theme.spacing(1)} ${theme.spacing(1)} 0 0`,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 72,
  height: 72,
  position: 'absolute',
  top: '18px',
  left: '50%',
  transform: 'translateX(-50%)',
  border: `3px solid ${colors.white}`,
  backgroundColor: colors.blue,
  color: colors.white,
  fontSize: '1.5rem',
  fontWeight: 600,
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const UnemploymentCounter = styled(Box)(({ theme }) => ({
  backgroundColor: colors.yellow,
  color: colors.greyText,
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(0.5),
  textAlign: 'center',
  margin: theme.spacing(1, 2, 2, 2),
}));

const StatsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2, 2),
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const QuickLinksCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
}));

const QuickLinkItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: colors.greyLight,
  },
}));

const SidebarLeft = () => {
  const { user } = useAuth();

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const calculateUnemploymentDays = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEndorsementCount = () => {
    return user?.skills.reduce((total, skill) => total + skill.endorsements, 0) || 0;
  };

  if (!user) return null;

  const unemploymentDays = calculateUnemploymentDays(user.unemploymentStart);
  const totalEndorsements = getEndorsementCount();

  return (
    <SidebarContainer>
      {/* Profile Card */}
      <ProfileCard>
        <CoverBox />
        <ProfileAvatar>
          {getUserInitials(user.name)}
        </ProfileAvatar>
        
        <ProfileInfo>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {user.title}
          </Typography>
          {user.bio && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
              {user.bio.length > 80 ? `${user.bio.substring(0, 80)}...` : user.bio}
            </Typography>
          )}
        </ProfileInfo>

        <UnemploymentCounter>
          <Typography variant="body2" fontWeight={600}>
            🏆 Compteur de chômage
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
            {unemploymentDays} jours
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
            Depuis le {new Date(user.unemploymentStart).toLocaleDateString('fr-FR')}
          </Typography>
        </UnemploymentCounter>

        <Divider />

        <StatsBox>
          <StatItem>
            <Typography variant="body2" color="text.secondary">
              Connexions
            </Typography>
            <Typography variant="body2" fontWeight={600} color={colors.blue}>
              {user.connections.length}
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="body2" color="text.secondary">
              Endorsements
            </Typography>
            <Typography variant="body2" fontWeight={600} color={colors.blue}>
              {totalEndorsements}
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="body2" color="text.secondary">
              Badges
            </Typography>
            <Typography variant="body2" fontWeight={600} color={colors.blue}>
              {user.badges.filter(b => b.earned).length}
            </Typography>
          </StatItem>
        </StatsBox>
      </ProfileCard>

      {/* Quick Links */}
      <QuickLinksCard>
        <CardContent sx={{ p: 0 }}>
          <List disablePadding>
            <QuickLinkItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Mon profil"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </QuickLinkItem>
            
            <QuickLinkItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <GroupIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Mes connexions"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </QuickLinkItem>
            
            <QuickLinkItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <BookmarkIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Éléments sauvegardés"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </QuickLinkItem>
            
            <QuickLinkItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EventIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Événements de glandouille"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </QuickLinkItem>
          </List>
        </CardContent>
      </QuickLinksCard>

      {/* Recent Skills */}
      <QuickLinksCard>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, fontSize: '1rem' }}>
            Compétences récentes
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {user.skills.slice(0, 4).map((skill, index) => (
              <Chip
                key={index}
                label={skill.name}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  borderColor: colors.blue,
                  color: colors.blue,
                  '&:hover': {
                    backgroundColor: `${colors.blue}08`,
                  },
                }}
              />
            ))}
          </Box>
          {user.skills.length > 4 && (
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ mt: 1, cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Voir toutes les compétences ({user.skills.length})
            </Typography>
          )}
        </CardContent>
      </QuickLinksCard>
    </SidebarContainer>
  );
};

export default SidebarLeft;