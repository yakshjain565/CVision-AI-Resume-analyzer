import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Paper
} from '@mui/material';
import { CloudUpload, CheckCircle, Error } from '@mui/icons-material';
import API from '../services/api';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // File type check
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error');
      setStatusMessage('Invalid file type. Please upload PDF, DOC, DOCX, or TXT');
      return;
    }

    // File size check (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setStatusMessage('File size too large. Maximum 5MB');
      return;
    }

    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type
    });

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setUploadStatus(null);
    setStatusMessage('');
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await API.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(interval);
      setUploadProgress(100);
      
      if (response.data.success) {
        setUploadStatus('success');
        setStatusMessage('Resume uploaded and analyzed successfully!');
        
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setStatusMessage(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Resume
      </Typography>

      <input
        accept=".pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
        id="resume-upload"
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      
      <label htmlFor="resume-upload">
        <Box
          sx={{
            border: '2px dashed',
            borderColor: uploadStatus === 'success' ? 'success.main' : 'primary.main',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.default',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.7 : 1,
            '&:hover': {
              bgcolor: uploading ? 'background.default' : 'action.hover'
            }
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            {uploading ? 'Uploading...' : 'Drag & drop your resume here or click to browse'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Supports: PDF, DOC, DOCX, TXT (Max 5MB)
          </Typography>
        </Box>
      </label>

      {fileInfo && !uploading && uploadStatus !== 'success' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>File:</strong> {fileInfo.name}
          </Typography>
          <Typography variant="body2">
            <strong>Size:</strong> {fileInfo.size}
          </Typography>
        </Box>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}

      {uploadStatus === 'success' && (
        <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ mt: 2 }}>
          {statusMessage}
        </Alert>
      )}

      {uploadStatus === 'error' && (
        <Alert icon={<Error fontSize="inherit" />} severity="error" sx={{ mt: 2 }}>
          {statusMessage}
        </Alert>
      )}
    </Paper>
  );
};

export default ResumeUpload;