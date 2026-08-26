import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import { Work, LocationOn, People, Visibility } from '@mui/icons-material';
import API from '../services/api';

const MyPostedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/jobs/my-posts');
      setJobs(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: 2
      }}>
        <Typography variant="h4" gutterBottom>
          My Posted Jobs
        </Typography>
        <Typography variant="subtitle1">
          Manage your job postings and view applicants
        </Typography>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {jobs.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Work sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">No jobs posted yet</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Start by posting your first job
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/post-job')}
            sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
          >
            Post New Job
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid key={job._id} size={12}>
              <Card sx={{ 
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>{job.title}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Chip icon={<Work sx={{ fontSize: 16 }} />} label={job.type} size="small" sx={{ backgroundColor: '#e8f5e9', color: '#4caf50' }} />
                        <Chip icon={<LocationOn sx={{ fontSize: 16 }} />} label={job.location} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        📊 {job.applications || 0} applications received
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
                      <Button
                        variant="contained"
                        startIcon={<People />}
                        onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                        sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                      >
                        View Applicants ({job.applicants?.length || 0})
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        sx={{ borderColor: '#667eea', color: '#667eea' }}
                      >
                        View Job
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyPostedJobs;