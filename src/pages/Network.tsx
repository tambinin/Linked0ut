import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  Divider,
  Chip,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import Header from '../components/Layout/Header';
import SidebarLeft from '../components/Layout/SidebarLeft';
import SidebarRight from '../components/Layout/SidebarRight';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/theme';
import { User, SAMPLE_USERS } from '../data/mockData';

const NetworkContainer = styled(Container)(({ theme }) => ({
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

const NetworkCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
}));

const UserCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const ConnectButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.blue,
  color: colors.white,
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#1E3A6F',
  },
}));

const Network: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionRequests, setConnectionRequests] = useState<string[]>([]);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getConnections = (): User[] => {
    if (!user) return [];
    return SAMPLE_USERS.filter(u => user.connections.includes(u.id));
  };

  const getSuggestions = (): User[] => {
    if (!user) return [];
    return SAMPLE_USERS.filter(u => 
      u.id !== user.id && 
      !user.connections.includes(u.id) &&
      !connectionRequests.includes(u.id)
    );
  };

  const getFilteredUsers = (users: User[]) => {
    if (!searchTerm) return users;
    return users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleConnect = (userId: string) => {
    setConnectionRequests(prev => [...prev, userId]);
  };

  const calculateUnemploymentDays = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getConnectionReason = (targetUser: User): string => {
    if (!user) return '';
    
    // Find common skills
    const commonSkills = user.skills.filter(skill =>
      targetUser.skills.some(tSkill => tSkill.name === skill.name)
    );
    
    if (commonSkills.length > 0) {
      return `Compétence en commun : ${commonSkills[0].name}`;
    }
    
    // Check unemployment period similarity
    const userDays = calculateUnemploymentDays(user.unemploymentStart);
    const targetDays = calculateUnemploymentDays(targetUser.unemploymentStart);
    const dayDiff = Math.abs(userDays - targetDays);
    
    if (dayDiff < 30) {
      return 'Période de chômage similaire';
    }
    
    return 'Profils similaires dans l\'inactivité';
  };

  if (!user) return null;

  const connections = getConnections();
  const suggestions = getSuggestions();

  return (
    <>
      <Header />
      <NetworkContainer>
        <MainLayout>
          <SidebarLeft />
          
          <MainContent>
            {/* Header */}
            <NetworkCard>
              <CardContent>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  Mon réseau de glandeurs
                </Typography>
                
                <TextField
                  fullWidth
                  placeholder="Rechercher des connections..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Tabs
                  value={tabValue}
                  onChange={(e, newValue) => setTabValue(newValue)}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: colors.blue,
                    },
                  }}
                >
                  <Tab 
                    label={`Mes connexions (${connections.length})`}
                    sx={{ 
                      textTransform: 'none', 
                      fontSize: '0.875rem',
                      color: colors.greyDark,
                      '&.Mui-selected': { color: colors.blue },
                    }} 
                  />
                  <Tab 
                    label={`Suggestions (${suggestions.length})`}
                    sx={{ 
                      textTransform: 'none', 
                      fontSize: '0.875rem',
                      color: colors.greyDark,
                      '&.Mui-selected': { color: colors.blue },
                    }} 
                  />
                </Tabs>
              </CardContent>
            </NetworkCard>

            {/* Connections Tab */}
            {tabValue === 0 && (
              <NetworkCard>
                <CardContent sx={{ p: 0 }}>
                  <List disablePadding>
                    {getFilteredUsers(connections).map((connection, index) => (
                      <React.Fragment key={connection.id}>
                        <UserCard>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              fontSize: '1.25rem',
                              bgcolor: colors.blue,
                              color: colors.white,
                              mr: 2,
                            }}
                          >
                            {getUserInitials(connection.name)}
                          </Avatar>
                          
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {connection.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {connection.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {calculateUnemploymentDays(connection.unemploymentStart)} jours de chômage
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                              {connection.skills.slice(0, 2).map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill.name}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '0.625rem',
                                    height: '20px',
                                    borderColor: colors.blue,
                                    color: colors.blue,
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: colors.blue,
                              color: colors.blue,
                              textTransform: 'none',
                            }}
                          >
                            Message
                          </Button>
                        </UserCard>
                        {index < getFilteredUsers(connections).length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                    
                    {getFilteredUsers(connections).length === 0 && (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                          {searchTerm ? 'Aucune connexion trouvée' : 'Aucune connexion pour le moment'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Explorez les suggestions pour étendre votre réseau !'}
                        </Typography>
                      </Box>
                    )}
                  </List>
                </CardContent>
              </NetworkCard>
            )}

            {/* Suggestions Tab */}
            {tabValue === 1 && (
              <NetworkCard>
                <CardContent sx={{ p: 0 }}>
                  <List disablePadding>
                    {getFilteredUsers(suggestions).map((suggestion, index) => (
                      <React.Fragment key={suggestion.id}>
                        <UserCard>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              fontSize: '1.25rem',
                              bgcolor: colors.blue,
                              color: colors.white,
                              mr: 2,
                            }}
                          >
                            {getUserInitials(suggestion.name)}
                          </Avatar>
                          
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {suggestion.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {suggestion.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                              {getConnectionReason(suggestion)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {calculateUnemploymentDays(suggestion.unemploymentStart)} jours de chômage
                            </Typography>
                          </Box>
                          
                          {connectionRequests.includes(suggestion.id) ? (
                            <Button
                              variant="outlined"
                              size="small"
                              disabled
                              startIcon={<CheckIcon />}
                              sx={{
                                borderColor: colors.greyMedium,
                                color: colors.greyDark,
                                textTransform: 'none',
                              }}
                            >
                              Invité
                            </Button>
                          ) : (
                            <ConnectButton
                              size="small"
                              startIcon={<PersonAddIcon />}
                              onClick={() => handleConnect(suggestion.id)}
                            >
                              Se connecter
                            </ConnectButton>
                          )}
                        </UserCard>
                        {index < getFilteredUsers(suggestions).length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                    
                    {getFilteredUsers(suggestions).length === 0 && (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                          Aucune suggestion trouvée
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Tous les glandeurs disponibles ont déjà été contactés !
                        </Typography>
                      </Box>
                    )}
                  </List>
                </CardContent>
              </NetworkCard>
            )}
          </MainContent>
          
          <SidebarRight />
        </MainLayout>
      </NetworkContainer>
    </>
  );
};

export default Network;