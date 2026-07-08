import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom
} from '@mui/material';
import {
  Work,
  LocationOn,
  Business,
  AttachMoney,
  AccessTime,
  School,
  Build,
  Description,
  Person,
  Email,
  Phone,
  CheckCircle,
  ErrorOutline,
  ArrowBack
} from '@mui/icons-material';
import API from '../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    checkIfApplied();
    calculateMatchScore();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/jobs/${id}`);
      setJob(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load job details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await API.get('/user/applied-jobs');
      const appliedJobs = response.data.data || [];
      setApplied(appliedJobs.some(j => j.job === id));
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const calculateMatchScore = async () => {
    try {
      const response = await API.get('/resumes/my-resume');
      if (response.data.success && response.data.data) {
        const resume = response.data.data;
        const jobSkills = job?.requirements?.skills || [];
        const candidateSkills = resume.parsedData?.skills || [];
        
        const matchedSkills = candidateSkills.filter(skill =>
          jobSkills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        const score = jobSkills.length > 0
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;
        
        setMatchScore(score);
      }
    } catch (err) {
      console.error('Error calculating match score:', err);
    }
  };

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await API.post(`/jobs/${id}/apply`);
      setApplied(true);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Job not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/jobs')}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/jobs')}
          sx={{ mb: 3, color: '#667eea' }}
        >
          Back to Jobs
        </Button>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Fade in timeout={500}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    {job.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business sx={{ fontSize: 20, mr: 1, color: '#667eea' }} />
                    <Typography variant="h6" color="textSecondary">
                      {job.company}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 20, mr: 1, color: '#667eea' }} />
                    <Typography variant="body1" color="textSecondary">
                      {job.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Chip
                      label={job.type}
                      sx={{
                        backgroundColor: '#e8f5e9',
                        color: '#4caf50',
                        fontWeight: 500
                      }}
                    />
                    {job.status === 'active' && (
                      <Chip
                        label="Active"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#2196f3'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ mr: 1, color: '#667eea' }} />
                    Job Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {job.description}
                  </Typography>
                </Box>

                {/* Requirements */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Build sx={{ mr: 1, color: '#667eea' }} />
                    Requirements
                  </Typography>
                  
                  {job.requirements?.skills?.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {job.requirements.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            sx={{
                              backgroundColor: '#f0f4ff',
                              color: '#667eea',
                              '&:hover': {
                                backgroundColor: '#e0e8ff'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {job.requirements?.experience && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Experience:
                      </Typography>
                      <Chip
                        label={job.requirements.experience}
                        sx={{
                          backgroundColor: '#fff3e0',
                          color: '#ff9800'
                        }}
                      />
                    </Box>
                  )}

                  {job.requirements?.education && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Education:
                      </Typography>
                      <Chip
                        label={job.requirements.education}
                        sx={{
                          backgroundColor: '#e8f5e9',
                          color: '#4caf50'
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Salary Info */}
                {job.salary?.min && job.salary?.max && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney sx={{ mr: 1, color: '#667eea' }} />
                      Salary
                    </Typography>
                    <Typography variant="body1">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} per year
                    </Typography>
                  </Box>
                )}

                {/* Posted Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#999' }}>
                  <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption">
                    Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Apply Card */}
            <Zoom in timeout={700}>
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Apply for this position
                  </Typography>
                  
                  {matchScore !== null && (
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Your Match Score
                      </Typography>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={matchScore}
                          size={80}
                          thickness={4}
                          sx={{
                            color: matchScore > 70 ? '#4caf50' : matchScore > 40 ? '#ff9800' : '#f44336'
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="h6" component="div" sx={{ color: '#667eea' }}>
                            {matchScore}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleApply}
                    disabled={applied || applying}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fe0 30%, #6a3f9e 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(102,126,234,0.3)'
                      },
                      transition: 'transform 0.3s, box-shadow 0.3s'
                    }}
                  >
                    {applied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'}
                  </Button>

                  {applied && (
                    <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ mt: 2 }}>
                      You have successfully applied for this position!
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Zoom>

            {/* Company Info */}
            <Fade in timeout={900}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    About {job.company}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>
                      {job.company?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{job.company}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {job.industry || 'Technology'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocationOn sx={{ color: '#667eea', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Location" secondary={job.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Work sx={{ color: '#667eea', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Job Type" secondary={job.type} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccessTime sx={{ color: '#667eea', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Posted" 
                        secondary={new Date(job.createdAt).toLocaleDateString()} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default JobDetails;