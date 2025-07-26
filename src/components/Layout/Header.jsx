import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  styled,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/theme';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.greyMedium}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  zIndex: theme.zIndex.drawer + 1,
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: colors.blue,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: colors.blue,
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '2px',
  backgroundColor: alpha(colors.greyLight, 0.8),
  border: `1px solid ${colors.greyMedium}`,
  '&:hover': {
    backgroundColor: alpha(colors.greyLight, 1),
  },
  '&:focus-within': {
    border: `2px solid ${colors.blue}`,
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: '100%',
  maxWidth: '280px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.greyDark,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: colors.greyText,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: 0,
  color: active ? colors.blue : colors.greyDark,
  backgroundColor: active ? alpha(colors.blue, 0.08) : 'transparent',
  borderBottom: active ? `2px solid ${colors.blue}` : '2px solid transparent',
  '&:hover': {
    backgroundColor: alpha(colors.greyDark, 0.08),
    color: colors.greyText,
  },
  minWidth: '80px',
  height: '52px',
}));

const NavLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  marginTop: theme.spacing(0.5),
  lineHeight: 1,
}));

const ProfileButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: 0,
  color: colors.greyDark,
  textTransform: 'none',
  minWidth: '80px',
  height: '52px',
  '&:hover': {
    backgroundColor: alpha(colors.greyDark, 0.08),
  },
}));

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Left Section: Logo and Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Logo onClick={() => navigate('/dashboard')}>
            LinkedOut
          </Logo>
          
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchContainer>
        </Box>

        {/* Center Section: Navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          flex: 1,
          maxWidth: '400px',
        }}>
          <NavButton
            active={isActive('/dashboard')}
            onClick={() => handleNavigation('/dashboard')}
          >
            <HomeIcon fontSize="small" />
            <NavLabel>Accueil</NavLabel>
          </NavButton>
          
          <NavButton
            active={isActive('/network')}
            onClick={() => handleNavigation('/network')}
          >
            <PeopleIcon fontSize="small" />
            <NavLabel>Réseau</NavLabel>
          </NavButton>
          
          <NavButton
            active={isActive('/jobs')}
            onClick={() => handleNavigation('/jobs')}
          >
            <WorkIcon fontSize="small" />
            <NavLabel>Emplois</NavLabel>
          </NavButton>
          
          <NavButton
            onClick={() => {/* TODO: Notifications */}}
          >
            <Badge badgeContent={3} color="error" variant="dot">
              <NotificationsIcon fontSize="small" />
            </Badge>
            <NavLabel>Notifications</NavLabel>
          </NavButton>
        </Box>

        {/* Right Section: Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <ProfileButton
            onClick={handleProfileMenuOpen}
            active={isActive('/profile')}
          >
            <Avatar
              sx={{ 
                width: 24, 
                height: 24, 
                fontSize: '0.75rem',
                bgcolor: colors.blue,
                color: colors.white,
              }}
            >
              {user ? getUserInitials(user.name) : 'U'}
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <NavLabel>Moi</NavLabel>
              <ArrowDropDownIcon fontSize="small" sx={{ ml: 0.5 }} />
            </Box>
          </ProfileButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <MenuItem
              onClick={() => {
                navigate('/profile');
                handleMenuClose();
              }}
              sx={{ py: 1.5 }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Voir le profil
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ py: 1.5, color: colors.greyText }}
            >
              Se déconnecter
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;