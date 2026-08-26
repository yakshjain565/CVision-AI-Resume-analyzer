import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Fade,
  InputAdornment
} from '@mui/material';
import {
  Work,
  Business,
  LocationOn,
  AttachMoney,
  Description,
  Build,
  School,
  AccessTime,
  Send
} from '@mui/icons-material';
import API from '../services/api';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: {
      skills: [],
      experience: '',
      education: ''
    },
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    deadline: ''
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years'];
  const educationLevels = [
    'High School',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Any'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requirements.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        requirements: {
          ...formData.requirements,
          skills: [...formData.requirements.skills, skillInput.trim()]
        }
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      requirements: {
        ...formData.requirements,
        skills: formData.requirements.skills.filter(skill => skill !== skillToRemove)
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await API.post('/jobs', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="md">
        <Fade in timeout={500}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Post a New Job
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Fill in the details below to create a new job posting
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Job posted successfully! Redirecting...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#667eea' }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <TextField
                    fullWidth
                    select
                    label="Job Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    {jobTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Salary Information */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#667eea', mt: 2 }}>
                    Salary Information
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4
                  }}>
                  <TextField
                    fullWidth
                    label="Minimum Salary"
                    name="salary.min"
                    type="number"
                    value={formData.salary.min}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4
                  }}>
                  <TextField
                    fullWidth
                    label="Maximum Salary"
                    name="salary.max"
                    type="number"
                    value={formData.salary.max}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4
                  }}>
                  <TextField
                    fullWidth
                    select
                    label="Currency"
                    name="salary.currency"
                    value={formData.salary.currency}
                    onChange={handleChange}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                    <MenuItem value="INR">INR</MenuItem>
                  </TextField>
                </Grid>

                {/* Requirements */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#667eea', mt: 2 }}>
                    Job Requirements
                  </Typography>
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    helperText="Type a skill and press Enter to add"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Build sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.requirements.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        sx={{
                          backgroundColor: '#f0f4ff',
                          color: '#667eea',
                          '& .MuiChip-deleteIcon': {
                            color: '#667eea'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <TextField
                    fullWidth
                    select
                    label="Experience Required"
                    name="requirements.experience"
                    value={formData.requirements.experience}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {experienceLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <TextField
                    fullWidth
                    select
                    label="Education Required"
                    name="requirements.education"
                    value={formData.requirements.education}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {educationLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Description */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#667eea', mt: 2 }}>
                    Job Description
                  </Typography>
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <Description sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Application Deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid size={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    sx={{
                      py: 1.5,
                      mt: 2,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fe0 30%, #6a3f9e 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(102,126,234,0.3)'
                      },
                      transition: 'transform 0.3s, box-shadow 0.3s'
                    }}
                  >
                    {loading ? 'Posting...' : 'Post Job'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PostJob;