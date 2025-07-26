import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  styled,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { colors } from '../../styles/theme';
import { SAMPLE_JOBS } from '../../data/mockData';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '320px',
  position: 'sticky',
  top: '70px', // Height of header + some margin
  height: 'calc(100vh - 80px)',
  overflowY: 'auto',
  paddingLeft: theme.spacing(2),
  [theme.breakpoints.down('xl')]: {
    display: 'none',
  },
}));

const SidebarCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 2, 1, 2),
}));

const JobItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  alignItems: 'flex-start',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: colors.greyLight,
  },
}));

const AdCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  position: 'relative',
}));

const AdBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  fontSize: '0.625rem',
  height: '20px',
  backgroundColor: colors.greyLight,
  color: colors.greyDark,
}));

const TrendingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
}));

interface SidebarRightProps {}

const SidebarRight: React.FC<SidebarRightProps> = () => {
  // Get featured jobs (first 3)
  const featuredJobs = SAMPLE_JOBS.slice(0, 3);

  // Trending topics related to unemployment humor
  const trendingTopics = [
    { topic: 'Procrastination professionnelle', posts: '1,234 posts' },
    { topic: 'Netflix Expert', posts: '987 posts' },
    { topic: 'Art de la sieste', posts: '765 posts' },
    { topic: 'Chômage créatif', posts: '543 posts' },
    { topic: 'Optimisation du temps libre', posts: '432 posts' },
  ];

  // Suggested connections
  const suggestedConnections = [
    {
      id: 'suggest_1',
      name: 'Pierre Feignant',
      title: 'Consultant en évitement de tâches',
      mutualConnections: 3,
    },
    {
      id: 'suggest_2',
      name: 'Lucie Oisive',
      title: 'Spécialiste en optimisation de canapé',
      mutualConnections: 2,
    },
    {
      id: 'suggest_3',
      name: 'Marc Relax',
      title: 'Expert en pause café prolongée',
      mutualConnections: 5,
    },
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SidebarContainer>
      {/* Featured Jobs */}
      <SidebarCard>
        <CardHeader>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>
            Emplois recommandés
          </Typography>
          <InfoIcon fontSize="small" color="action" />
        </CardHeader>
        <Divider />
        <List disablePadding>
          {featuredJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <JobItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {job.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {job.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {job.location} • {job.salary}
                      </Typography>
                      <Chip
                        label={job.type}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          mt: 0.5, 
                          fontSize: '0.625rem', 
                          height: '20px',
                          borderColor: colors.yellow,
                          color: colors.greyText,
                        }}
                      />
                    </Box>
                  }
                />
              </JobItem>
              {index < featuredJobs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ p: 2, pt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              textTransform: 'none',
              borderColor: colors.blue,
              color: colors.blue,
            }}
          >
            Voir tous les emplois
          </Button>
        </Box>
      </SidebarCard>

      {/* Trending Topics */}
      <TrendingCard>
        <CardHeader>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>
            Tendances pour vous
          </Typography>
          <TrendingUpIcon fontSize="small" color="action" />
        </CardHeader>
        <Divider />
        <List disablePadding>
          {trendingTopics.slice(0, 4).map((trend, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ py: 1.5, px: 2, cursor: 'pointer', '&:hover': { backgroundColor: colors.greyLight } }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      #{trend.topic}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {trend.posts}
                    </Typography>
                  }
                />
              </ListItem>
              {index < trendingTopics.slice(0, 4).length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </TrendingCard>

      {/* Suggested Connections */}
      <SidebarCard>
        <CardHeader>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>
            Personnes que vous pourriez connaître
          </Typography>
          <InfoIcon fontSize="small" color="action" />
        </CardHeader>
        <Divider />
        <List disablePadding>
          {suggestedConnections.slice(0, 2).map((connection, index) => (
            <React.Fragment key={connection.id}>
              <ListItem sx={{ py: 1.5, px: 2, alignItems: 'flex-start' }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    fontSize: '0.875rem',
                    bgcolor: colors.blue,
                    color: colors.white,
                  }}
                >
                  {getUserInitials(connection.name)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {connection.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                    {connection.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1.5 }}>
                    {connection.mutualConnections} connexions en commun
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderColor: colors.blue,
                      color: colors.blue,
                      fontSize: '0.75rem',
                      py: 0.5,
                    }}
                  >
                    Se connecter
                  </Button>
                </Box>
              </ListItem>
              {index < suggestedConnections.slice(0, 2).length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </SidebarCard>

      {/* Promotional Ad (Parody) */}
      <AdCard>
        <AdBadge label="Publicité" />
        <CardContent sx={{ pt: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600} color={colors.blue} sx={{ fontSize: '0.875rem' }}>
              Formation "Maître de la Procrastination"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 1 }}>
              Apprenez les techniques avancées pour reporter efficacement toutes vos tâches importantes.
            </Typography>
            <Typography variant="body2" fontWeight={600} color={colors.yellow} sx={{ mt: 1, fontSize: '0.75rem' }}>
              -50% si vous vous inscrivez... plus tard
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            fullWidth
            sx={{
              textTransform: 'none',
              bgcolor: colors.yellow,
              color: colors.greyText,
              '&:hover': {
                bgcolor: '#E8C442',
              },
            }}
          >
            Reporter l'inscription
          </Button>
        </CardContent>
      </AdCard>

      {/* Footer Info */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.625rem', lineHeight: 1.4 }}>
          À propos • Accessibilité • Centre d'aide • Confidentialité • Conditions • Préférences publicitaires
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.625rem', mt: 1 }}>
          LinkedOut Corporation © 2024
        </Typography>
      </Box>
    </SidebarContainer>
  );
};

export default SidebarRight;