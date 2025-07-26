import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  Container,
  styled,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { colors } from '../styles/theme.js';

const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.greyLight} 100%)`,
  padding: theme.spacing(3),
}));

const LoginCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  color: colors.blue,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

const Tagline = styled(Typography)(({ theme }) => ({
  color: colors.greyDark,
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  fontSize: '0.875rem',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    backgroundColor: colors.blue,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  color: colors.greyDark,
  '&.Mui-selected': {
    color: colors.blue,
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.blue,
  color: colors.white,
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#1E3A6F',
  },
  '&:disabled': {
    backgroundColor: colors.greyMedium,
  },
}));

const DemoInfo = styled(Box)(({ theme }) => ({
  backgroundColor: colors.greyLight,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  textAlign: 'center',
}));

// Component for TabPanel - removed TypeScript interface

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Erreur de connexion');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.title) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Erreur lors de l\'inscription');
    }
  };

  const handleDemoLogin = () => {
    setLoginData({
      email: 'test@linkedout.com',
      password: 'password123',
    });
  };

  return (
    <LoginContainer maxWidth={false}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Logo>LinkedOut</Logo>
        <Tagline>Le réseau social qui célèbre l'art de ne pas travailler</Tagline>
      </Box>

      <LoginCard>
        <CardContent sx={{ p: 4 }}>
          <StyledTabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <StyledTab label="Connexion" />
            <StyledTab label="Inscription" />
          </StyledTabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Tab */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleLoginSubmit}>
              <FormContainer>
                <Typography variant="h5" fontWeight={600} color="text.primary" textAlign="center">
                  Bienvenue dans votre chômage professionnel
                </Typography>
                
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
                
                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                
                <SubmitButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </SubmitButton>
              </FormContainer>
            </form>

            <DemoInfo>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Compte de démonstration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                test@linkedout.com / password123
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleDemoLogin}
                sx={{
                  textTransform: 'none',
                  borderColor: colors.blue,
                  color: colors.blue,
                }}
              >
                Utiliser le compte démo
              </Button>
            </DemoInfo>
          </TabPanel>

          {/* Register Tab */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleRegisterSubmit}>
              <FormContainer>
                <Typography variant="h5" fontWeight={600} color="text.primary" textAlign="center">
                  Rejoindre la communauté des inactifs
                </Typography>
                
                <TextField
                  label="Nom complet"
                  variant="outlined"
                  fullWidth
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
                
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
                
                <TextField
                  label="Titre professionnel"
                  variant="outlined"
                  fullWidth
                  value={registerData.title}
                  onChange={(e) => setRegisterData({ ...registerData, title: e.target.value })}
                  placeholder="Ex: Expert en procrastination avancée"
                  required
                />
                
                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  helperText="Minimum 6 caractères"
                  required
                />
                
                <SubmitButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </SubmitButton>
              </FormContainer>
            </form>
          </TabPanel>
        </CardContent>
      </LoginCard>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          LinkedOut est une parodie humoristique créée à des fins de divertissement
        </Typography>
      </Box>
    </LoginContainer>
  );
};

export default Login;