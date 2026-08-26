import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Fade,
  Zoom
} from '@mui/material';
import {
  Work,
  LocationOn,
  Business,
  Search,
  FilterList,
  AttachMoney,
  AccessTime
} from '@mui/icons-material';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const locations = ['Remote', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];

  useEffect(() => {
    fetchJobs();
  }, [page, filterType, filterLocation]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(filterType && { type: filterType }),
        ...(filterLocation && { location: filterLocation })
      });
      
      const response = await API.get(`/jobs?${params}`);
      setJobs(response.data.data);
      setTotalPages(response.data.pages || 1);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/jobs/${jobId}`);
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requirements?.skills?.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading && jobs.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Zoom in timeout={1000}>
            <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Find Your Dream Job
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Browse through thousands of opportunities matching your skills
              </Typography>
              
              {/* Search Bar */}
              <Paper
                elevation={6}
                sx={{
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: 600,
                  mx: 'auto',
                  borderRadius: 3
                }}
              >
                <InputAdornment position="start" sx={{ ml: 2 }}>
                  <Search sx={{ color: '#667eea' }} />
                </InputAdornment>
                <TextField
                  fullWidth
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{ ml: 1 }}
                />
              </Paper>
            </Box>
          </Zoom>
        </Container>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
      </Box>

      {/* Filters Section */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 4, position: 'relative', zIndex: 10 }}>
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Job Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {jobTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {locations.map(loc => (
                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilterType('');
                  setFilterLocation('');
                  setSearchTerm('');
                }}
                sx={{
                  height: 40,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102,126,234,0.05)'
                  }
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        {error && (
          <Fade in>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Results Count */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Found <strong>{filteredJobs.length}</strong> jobs matching your criteria
        </Typography>

        {/* Job Listings */}
        <Grid container spacing={3}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <Grid key={job._id} size={12}>
                <Fade in timeout={500 + index * 100}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 30px rgba(102,126,234,0.2)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid
                          size={{
                            xs: 12,
                            md: 8
                          }}>
                          <Typography 
                            variant="h5" 
                            gutterBottom
                            sx={{
                              color: '#333',
                              fontWeight: 600,
                              '&:hover': { color: '#667eea' }
                            }}
                          >
                            {job.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Business sx={{ fontSize: 18, mr: 1, color: '#667eea' }} />
                            <Typography variant="body1" color="textSecondary">
                              {job.company}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ fontSize: 18, mr: 1, color: '#667eea' }} />
                            <Typography variant="body1" color="textSecondary">
                              {job.location}
                            </Typography>
                          </Box>

                          {job.salary?.min && job.salary?.max && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <AttachMoney sx={{ fontSize: 18, mr: 1, color: '#667eea' }} />
                              <Typography variant="body1" color="textSecondary">
                                ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ mt: 2 }}>
                            {job.requirements?.skills?.slice(0, 5).map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                sx={{
                                  mr: 1,
                                  mb: 1,
                                  backgroundColor: '#f0f4ff',
                                  color: '#667eea',
                                  '&:hover': {
                                    backgroundColor: '#e0e8ff'
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>

                        <Grid
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: { md: 'flex-end' },
                            justifyContent: 'space-between'
                          }}
                          size={{
                            xs: 12,
                            md: 4
                          }}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { md: 'flex-end' } }}>
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
                                size="small"
                                sx={{
                                  backgroundColor: '#e3f2fd',
                                  color: '#2196f3'
                                }}
                              />
                            )}
                          </Box>

                          <Box sx={{ mt: { xs: 2, md: 0 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { md: 'flex-end' }, mb: 2 }}>
                              <AccessTime sx={{ fontSize: 14, mr: 0.5, color: '#999' }} />
                              <Typography variant="caption" color="textSecondary">
                                Posted {new Date(job.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </Typography>
                            </Box>

                            <Button
                              variant="contained"
                              onClick={() => handleApply(job._id)}
                              sx={{
                                minWidth: 120,
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
                              Apply Now
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Fade in>
                <Paper sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)'
                }}>
                  <Work sx={{ fontSize: 60, color: '#667eea', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h5" color="textSecondary" gutterBottom>
                    No jobs found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try adjusting your search or filters to find more opportunities
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    color: 'white'
                  }
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Jobs;