import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Grid,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Person,
  Email,
  Assessment,
  MoreVert,
  CheckCircle,
  Cancel,
  Visibility,
  ArrowBack
} from '@mui/icons-material';
import API from '../services/api';

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    fetchJobAndApplicants();
  }, [id]);

  const fetchJobAndApplicants = async () => {
    try {
      setLoading(true);
      const [jobRes, applicantsRes] = await Promise.all([
        API.get(`/jobs/${id}`),
        API.get(`/jobs/${id}/applicants`)
      ]);
      setJob(jobRes.data.data);
      setApplicants(applicantsRes.data.data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicantId, status) => {
    try {
      await API.put(`/jobs/${id}/applicants/${applicantId}`, { status });
      fetchJobAndApplicants();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, applicant) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplicant(applicant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApplicant(null);
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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 3, color: '#667eea' }}
      >
        Back to Dashboard
      </Button>

      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: 2
      }}>
        <Typography variant="h4" gutterBottom>
          Applicants for {job?.title}
        </Typography>
        <Typography variant="subtitle1">
          {job?.company} • {job?.location}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Total Applicants: {applicants.length}
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {applicants.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Person sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No applicants yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Check back later for applications
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {applicants.map((applicant, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ 
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: '#667eea', width: 56, height: 56 }}>
                        {applicant.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {applicant.user?.name || 'Unknown'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Email sx={{ fontSize: 14, color: '#999' }} />
                          <Typography variant="body2" color="textSecondary">
                            {applicant.user?.email || 'No email'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Chip
                            icon={<Assessment />}
                            label={`Match Score: ${applicant.matchScore}%`}
                            size="small"
                            sx={{ 
                              backgroundColor: applicant.matchScore > 70 ? '#e8f5e9' : 
                                             applicant.matchScore > 40 ? '#fff3e0' : '#ffebee',
                              color: applicant.matchScore > 70 ? '#4caf50' : 
                                     applicant.matchScore > 40 ? '#ff9800' : '#f44336'
                            }}
                          />
                          <Chip
                            label={`Applied: ${new Date(applicant.appliedAt).toLocaleDateString()}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={applicant.status?.toUpperCase() || 'PENDING'}
                        sx={{
                          backgroundColor: `${getStatusColor(applicant.status)}20`,
                          color: getStatusColor(applicant.status),
                          fontWeight: 500
                        }}
                      />
                      <IconButton onClick={(e) => handleMenuOpen(e, applicant)}>
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusUpdate(selectedApplicant?._id, 'reviewed')}>
          <Visibility sx={{ mr: 1, fontSize: 18, color: '#2196f3' }} />
          Mark as Reviewed
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(selectedApplicant?._id, 'shortlisted')}>
          <CheckCircle sx={{ mr: 1, fontSize: 18, color: '#4caf50' }} />
          Shortlist
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(selectedApplicant?._id, 'rejected')}>
          <Cancel sx={{ mr: 1, fontSize: 18, color: '#f44336' }} />
          Reject
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Applicants;