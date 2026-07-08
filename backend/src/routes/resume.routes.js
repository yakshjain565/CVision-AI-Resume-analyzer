const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  upload,
  uploadResume,
  getMyResume,
  getResumeById,
  deleteResume,
  analyzeResumeForJob
} = require('../controllers/resume.controller');

// All routes are protected - user must be logged in
router.use(protect);

// Resume upload - only jobseekers can upload
router.post('/upload', authorize('jobseeker'), upload, uploadResume);

// Get current user's resume
router.get('/my-resume', getMyResume);

// Get resume by ID (for recruiters viewing applicants)
router.get('/:id', authorize('recruiter', 'admin'), getResumeById);

// Delete resume
router.delete('/:id', deleteResume);

// Analyze resume against a specific job
router.post('/analyze/:jobId', authorize('jobseeker'), analyzeResumeForJob);

module.exports = router;