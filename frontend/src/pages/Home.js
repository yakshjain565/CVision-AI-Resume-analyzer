import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import {
  Menu as MenuIcon,
  UploadFile,
  Work,
  TrendingUp,
  CheckCircle,
  School,
  People,
  Security
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <UploadFile sx={{ fontSize: 40 }} />,
      title: 'AI Resume Analysis',
      description: 'Get instant ATS score and detailed feedback on your resume with our advanced AI algorithm.',
      color: '#2196F3',
      delay: 100,
      path: '/dashboard',
      buttonText: 'Try Now'
    },
    {
      icon: <Work sx={{ fontSize: 40 }} />,
      title: 'Smart Job Matching',
      description: 'Find the perfect job matches based on your skills, experience, and preferences.',
      color: '#4CAF50',
      delay: 200,
      path: '/jobs',
      buttonText: 'Browse Jobs'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Career Growth',
      description: 'Get personalized recommendations to improve your resume and advance your career.',
      color: '#FF9800',
      delay: 300,
      path: '/dashboard',
      buttonText: 'Improve Now'
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      title: 'ATS Optimization',
      description: 'Optimize your resume for Applicant Tracking Systems and increase interview chances.',
      color: '#9C27B0',
      delay: 400,
      path: '/dashboard',
      buttonText: 'Optimize'
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Skill Development',
      description: 'Identify skill gaps and get curated learning resources to boost your career.',
      color: '#E91E63',
      delay: 500,
      path: '/dashboard',
      buttonText: 'Learn More'
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Recruiter Dashboard',
      description: 'Powerful tools for recruiters to find and manage top candidates efficiently.',
      color: '#00BCD4',
      delay: 600,
      path: '/dashboard',
      buttonText: 'For Recruiters'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: <People /> },
    { value: '50K+', label: 'Resumes Analyzed', icon: <UploadFile /> },
    { value: '95%', label: 'Success Rate', icon: <CheckCircle /> },
    { value: '24/7', label: 'AI Support', icon: <Security /> }
  ];

  const handleNavigation = (path) => {
    const token = localStorage.getItem('token');
    if (path === '/dashboard' && !token) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Navigation */}
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.8)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              CVision
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/jobs')}>Jobs</Button>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
            {isMobile && (
              <IconButton color="inherit" edge="end">
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section - Purple Gradient Background */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 0 },
          // Purple gradient background (your original)
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.1,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%)',
              animation: `${float} 20s infinite linear`,
            }
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      color: 'white',
                      mb: 2,
                      lineHeight: 1.2,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    AI-Powered Resume Analyzer & Job Matching Platform
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      mb: 4,
                      lineHeight: 1.6
                    }}
                  >
                    Upload your resume and let our AI analyze it, find matching jobs, 
                    and get personalized suggestions to improve your chances.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() => navigate('/register')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        backgroundColor: 'white',
                        color: '#667eea',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                        animation: `${pulse} 2s infinite`
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={() => navigate('/jobs')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      Browse Jobs
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Zoom in timeout={1000}>
                <Box
                  sx={{
                    animation: `${float} 6s infinite ease-in-out`,
                    textAlign: 'center'
                  }}
                >
                  <img
                    src="/resumeanalyser.png"
                    alt="Resume Analysis"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: 500,
                      filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))'
                    }}
                  />
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid
              key={index}
              size={{
                xs: 6,
                sm: 6,
                md: 3
              }}>
              <Fade in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 4,
                    transform: 'translateY(0)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 30px rgba(102,126,234,0.3)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ fontSize: 40, mb: 2 }}>{stat.icon}</Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Why Choose CVision?
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Our AI-powered platform helps you stand out in the competitive job market
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.333% - 16px)'
                  },
                  maxWidth: 380,
                }}
              >
                <Fade in timeout={feature.delay}>
                  <Card
                    onClick={() => handleNavigation(feature.path)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: `0 20px 30px ${feature.color}40`,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                          color: 'white',
                          mb: 2,
                          mx: 'auto'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {feature.description.length > 100 
                          ? feature.description.substring(0, 100) + '...' 
                          : feature.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(feature.path);
                        }}
                        sx={{
                          color: feature.color,
                          borderColor: feature.color,
                          '&:hover': {
                            borderColor: feature.color,
                            backgroundColor: `${feature.color}10`,
                          }
                        }}
                      >
                        {feature.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Ready to Boost Your Career?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
            Join thousands of professionals who have improved their resumes and landed their dream jobs
          </Typography>
          <Button
            size="large"
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              backgroundColor: 'white',
              color: '#667eea',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'scale(1.05)'
              },
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                CVision
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                AI-Powered Resume Analyzer & Job Matching Platform helping professionals land their dream jobs.
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Product
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer' }}>
                Features
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer' }}>
                Pricing
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer' }}>
                FAQ
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Company
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer' }}>
                About
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer' }}>
                Blog
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, cursor: 'pointer' }}>
                Contact
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Subscribe
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                Get the latest updates and job opportunities
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '4px',
                    border: 'none',
                    outline: 'none'
                  }}
                />
                <Button variant="contained" sx={{ bgcolor: '#667eea' }}>
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
            © 2026 CVision. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;