import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import API from '../services/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Work,
  Assessment,
  TrendingUp,
  CheckCircle,
  School,
  ErrorOutline,
  People
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [userData, setUserData] = useState({
    name: 'John Doe',
    role: 'Software Engineer',
    userRole: 'jobseeker',
    resumeScore: 78,
    atsCompatibility: 85,
    resumeFileName: 'No resume uploaded yet'
  });

  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [adminStats] = useState({
    newJobs: 12,
    topCandidates: 8
  });

  // Fetch resume data on component mount
  useEffect(() => {
    fetchResumeData();
    fetchJobMatches();
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData(prev => ({ ...prev, userRole: user.role || 'jobseeker' }));
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/resumes/my-resume');
      if (response.data.success && response.data.data) {
        const resume = response.data.data;
        setUserData(prev => ({
          ...prev,
          name: resume.parsedData?.name || prev.name,
          resumeFileName: resume.fileName || 'No resume uploaded',
          resumeScore: resume.atsScore || 0,
          atsCompatibility: resume.atsAnalysis?.compatibility || 0
        }));

        if (resume.atsAnalysis?.missingKeywords) {
          setMissingSkills(resume.atsAnalysis.missingKeywords);
        }

        if (resume.atsAnalysis?.suggestions) {
          setSuggestions(resume.atsAnalysis.suggestions);
        }
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching resume:', error);
      if (error.response?.status !== 404) {
        setError('Failed to load resume data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJobMatches = async () => {
    try {
      const response = await API.get('/jobs/matches/my');
      if (response.data.success) {
        setJobMatches(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Handle successful resume upload
  const handleUploadSuccess = (resumeData) => {
    console.log('Upload successful:', resumeData);
    
    setUserData(prev => ({
      ...prev,
      name: resumeData.parsedData?.name || prev.name,
      resumeFileName: resumeData.fileName,
      resumeScore: resumeData.atsScore || prev.resumeScore,
      atsCompatibility: resumeData.atsAnalysis?.compatibility || prev.atsCompatibility
    }));

    if (resumeData.atsAnalysis?.missingKeywords) {
      setMissingSkills(resumeData.atsAnalysis.missingKeywords);
    }

    if (resumeData.atsAnalysis?.suggestions) {
      setSuggestions(resumeData.atsAnalysis.suggestions);
    }

    // Refresh job matches after resume upload
    fetchJobMatches();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          boxShadow: '0 10px 30px rgba(102,126,234,0.3)'
        }}
      >
        <Typography variant="h4" gutterBottom>
          CVision - AI Resume Analyser & Job Match
        </Typography>
        <Typography variant="subtitle1">
          Welcome back, {userData.name}
        </Typography>
      </Paper>

      {/* Recruiter Actions - UPDATED with My Jobs button */}
      {userData.userRole === 'recruiter' && (
        <Fade in timeout={500}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 3, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
              border: '1px solid #667eea30',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Work sx={{ color: '#667eea', mr: 2, fontSize: 30 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Recruiter Dashboard
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage your jobs and applications
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/my-jobs')}
                startIcon={<People />}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fe0 30%, #6a3f9e 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(102,126,234,0.3)'
                  },
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
              >
                My Jobs
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/post-job')}
                startIcon={<Work />}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fe0 30%, #6a3f9e 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(102,126,234,0.3)'
                  },
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
              >
                Post New Job
              </Button>
            </Box>
          </Paper>
        </Fade>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<ErrorOutline />}>
          {error}
        </Alert>
      )}

      {/* MAIN GRID CONTAINER - FIXED */}
      <Grid container spacing={3}>
        {/* Left Column - FIXED */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Upload Section */}
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />

          {/* Resume Analysis */}
          <Paper 
            sx={{ 
              p: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 30px rgba(102,126,234,0.15)'
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Resume Analysis
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>
                {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">{userData.name} | {userData.role}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {userData.resumeFileName}
                </Typography>
              </Box>
            </Box>

            {/* Stats Grid - FIXED */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 4 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(102,126,234,0.2)',
                      borderColor: '#667eea'
                    }
                  }}
                >
                  <Assessment sx={{ color: '#667eea', fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">{userData.resumeScore}/100</Typography>
                  <Typography variant="caption">Resume Score</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(102,126,234,0.2)',
                      borderColor: '#667eea'
                    }
                  }}
                >
                  <TrendingUp sx={{ color: '#4caf50', fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">{userData.atsCompatibility}%</Typography>
                  <Typography variant="caption">ATS Compatibility</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(102,126,234,0.2)',
                      borderColor: '#667eea'
                    }
                  }}
                >
                  <School sx={{ color: '#ff9800', fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">B.Sc.</Typography>
                  <Typography variant="caption">Education</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Missing Skills:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {missingSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        backgroundColor: '#fff3e0',
                        color: '#ff9800',
                        borderColor: '#ff9800',
                        '&:hover': {
                          backgroundColor: '#ffe0b2'
                        }
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Top Suggestions to Improve Your Resume:
                </Typography>
                <List dense>
                  {suggestions.map((suggestion, index) => (
                    <ListItem 
                      key={index}
                      sx={{
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          backgroundColor: 'rgba(102,126,234,0.05)',
                          borderRadius: 1
                        }
                      }}
                    >
                      <CheckCircle sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Paper>
        </Grid>

        {/* Right Column - FIXED */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Job Matches */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 30px rgba(102,126,234,0.15)'
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Job Matches
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Found {jobMatches.length} Matching Jobs
            </Typography>
            
            {jobMatches.length > 0 ? (
              jobMatches.map((job) => (
                <Card 
                  key={job._id || job.id} 
                  sx={{ 
                    mb: 2, 
                    border: '1px solid #e0e0e0',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 20px rgba(102,126,234,0.2)',
                      borderColor: '#667eea'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">{job.title}</Typography>
                      <Chip 
                        label={`${job.matchPercentage || job.match}% Match`}
                        sx={{
                          backgroundColor: (job.matchPercentage || job.match) > 80 ? '#e8f5e9' : 
                                         (job.matchPercentage || job.match) > 70 ? '#e3f2fd' : '#fff3e0',
                          color: (job.matchPercentage || job.match) > 80 ? '#4caf50' : 
                                 (job.matchPercentage || job.match) > 70 ? '#2196f3' : '#ff9800',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {job.company}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      Required: {job.requirements?.skills?.join(', ') || job.required?.join(', ')}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      fullWidth 
                      sx={{ 
                        mt: 1,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#764ba2',
                          backgroundColor: 'rgba(102,126,234,0.05)'
                        }
                      }}
                      onClick={() => window.open(`/jobs/${job._id || job.id}`, '_blank')}
                    >
                      Apply Now 
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 3 }}>
                No job matches found. Upload your resume to see matches.
              </Typography>
            )}
          </Paper>

          {/* Admin Dashboard */}
          <Paper 
            sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
              border: '1px solid #667eea30',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 30px rgba(102,126,234,0.15)'
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Admin Dashboard
            </Typography>
            
            {/* Admin Stats Grid - FIXED */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    background: 'white',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 10px 20px rgba(102,126,234,0.2)'
                    }
                  }}
                >
                  <Work sx={{ color: '#667eea', fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">{adminStats.newJobs}</Typography>
                  <Typography variant="caption">New Job Listings</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    background: 'white',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 10px 20px rgba(102,126,234,0.2)'
                    }
                  }}
                >
                  <TrendingUp sx={{ color: '#764ba2', fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">{adminStats.topCandidates}</Typography>
                  <Typography variant="caption">Top Candidates Found</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;