import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { Work, AccessTime, CheckCircle, Pending, Cancel } from '@mui/icons-material';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/user/applied-jobs');
      setApplications(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9800';
      case 'reviewed': return '#2196f3';
      case 'shortlisted': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Pending sx={{ fontSize: 16 }} />;
      case 'shortlisted': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'rejected': return <Cancel sx={{ fontSize: 16 }} />;
      default: return <Work sx={{ fontSize: 16 }} />;
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
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: 2
      }}>
        <Typography variant="h4" gutterBottom>
          My Applications
        </Typography>
        <Typography variant="subtitle1">
          Track your job applications and their status
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {applications.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Work sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No applications yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Start applying for jobs to see them here
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/jobs')}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
            }}
          >
            Browse Jobs
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {applications.map((app, index) => (
            <Grid key={index} size={12}>
              <Card sx={{ 
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {app.job?.title || 'Job Title'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {app.job?.company || 'Company'} • {app.job?.location || 'Location'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <AccessTime sx={{ fontSize: 14, mr: 0.5, color: '#999' }} />
                        <Typography variant="caption" color="textSecondary">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      {app.matchScore && (
                        <Chip 
                          label={`Match Score: ${app.matchScore}%`}
                          size="small"
                          sx={{ mt: 1, backgroundColor: '#e8f5e9', color: '#4caf50' }}
                        />
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        icon={getStatusIcon(app.status)}
                        label={app.status?.toUpperCase() || 'PENDING'}
                        size="small"
                        sx={{ 
                          backgroundColor: `${getStatusColor(app.status)}20`,
                          color: getStatusColor(app.status),
                          fontWeight: 500
                        }}
                      />
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

export default AppliedJobs;