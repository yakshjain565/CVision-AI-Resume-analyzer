const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobMatches,
  getApplicants,
  updateApplicantStatus,
  getMyPostedJobs
} = require('../controllers/job.controller');

// Public routes
router.get('/', getJobs);
router.get('/matches/my', protect, getJobMatches);
router.get('/:id', getJob);

// Protected routes
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.post('/:id/apply', protect, authorize('jobseeker'), applyForJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.get('/my-posts', protect, authorize('recruiter'), getMyPostedJobs);
router.get('/:id/applicants', protect, authorize('recruiter', 'admin'), getApplicants);
router.put('/:jobId/applicants/:applicantId', protect, authorize('recruiter', 'admin'), updateApplicantStatus);

module.exports = router;