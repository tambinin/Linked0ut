import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import Header from '../components/Layout/Header';
import SidebarLeft from '../components/Layout/SidebarLeft';
import SidebarRight from '../components/Layout/SidebarRight';
import { colors } from '../styles/theme.js';
import { Job, SAMPLE_JOBS } from '../data/mockData.js';

const JobsContainer = styled(Container)(({ theme }) => ({
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

const SearchCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
}));

const JobCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: colors.white,
  border: `1px solid ${colors.greyMedium}`,
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    transform: 'translateY(-1px)',
  },
}));

const JobHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

const JobDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: colors.greyDark,
  fontSize: '0.875rem',
}));

const JobDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.blue,
  color: colors.white,
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  '&:hover': {
    backgroundColor: '#1E3A6F',
  },
}));

const Jobs = () => {
  const [jobs] = useState(SAMPLE_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (jobId) => {
    setAppliedJobs(prev => [...prev, jobId]);
  };

  const formatPostedTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  return (
    <>
      <Header />
      <JobsContainer>
        <MainLayout>
          <SidebarLeft />
          
          <MainContent>
            {/* Search Section */}
            <SearchCard>
              <CardContent>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                  Offres d'emploi bidons
                </Typography>
                
                <TextField
                  fullWidth
                  placeholder="Rechercher des emplois inexistants..."
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
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </CardContent>
            </SearchCard>

            {/* Jobs List */}
            <Box>
              {filteredJobs.map((job) => (
                <JobCard key={job.id}>
                  <CardContent>
                    <JobHeader>
                      <Box>
                        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 0.5 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body1" fontWeight={500} color="text.primary">
                          {job.company}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={job.type}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: colors.yellow,
                          color: colors.greyText,
                          backgroundColor: `${colors.yellow}12`,
                        }}
                      />
                    </JobHeader>

                    <JobDetails>
                      <JobDetailItem>
                        <LocationIcon fontSize="small" />
                        <Typography variant="body2">{job.location}</Typography>
                      </JobDetailItem>
                      
                      <JobDetailItem>
                        <MoneyIcon fontSize="small" />
                        <Typography variant="body2">{job.salary}</Typography>
                      </JobDetailItem>
                      
                      <JobDetailItem>
                        <PeopleIcon fontSize="small" />
                        <Typography variant="body2">{job.applications} candidatures</Typography>
                      </JobDetailItem>
                    </JobDetails>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {job.description}
                    </Typography>

                    {job.requirements.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                          Compétences requises :
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <Chip
                              key={index}
                              label={req}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.75rem',
                                borderColor: colors.blue,
                                color: colors.blue,
                              }}
                            />
                          ))}
                          {job.requirements.length > 3 && (
                            <Chip
                              label={`+${job.requirements.length - 3} autres`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.75rem',
                                borderColor: colors.greyMedium,
                                color: colors.greyDark,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Publié {formatPostedTime(job.posted)}
                      </Typography>
                      
                      {appliedJobs.includes(job.id) ? (
                        <Button
                          variant="outlined"
                          disabled
                          sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            color: colors.greyDark,
                            borderColor: colors.greyMedium,
                          }}
                        >
                          ✓ Candidature envoyée
                        </Button>
                      ) : (
                        <ApplyButton onClick={() => handleApply(job.id)}>
                          Postuler (pour rigoler)
                        </ApplyButton>
                      )}
                    </Box>
                  </CardContent>
                </JobCard>
              ))}
              
              {filteredJobs.length === 0 && (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Aucun emploi trouvé
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Essayez de modifier vos critères de recherche.
                  </Typography>
                </Card>
              )}
            </Box>
          </MainContent>
          
          <SidebarRight />
        </MainLayout>
      </JobsContainer>
    </>
  );
};

export default Jobs;