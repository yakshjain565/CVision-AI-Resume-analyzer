const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private (Recruiters only)
exports.createJob = async (req, res) => {
  try {
    console.log('Creating job for user:', req.user.id);
    console.log('Request body:', req.body);

    // Get user info
    const user = await User.findById(req.user.id);
    
    // Create job data
    const jobData = {
      title: req.body.title,
      company: req.body.company || user?.company || 'Company Name',
      location: req.body.location,
      type: req.body.type,
      description: req.body.description,
      requirements: {
        skills: req.body.requirements?.skills || [],
        experience: req.body.requirements?.experience || '',
        education: req.body.requirements?.education || ''
      },
      salary: {
        min: req.body.salary?.min || 0,
        max: req.body.salary?.max || 0,
        currency: req.body.salary?.currency || 'USD'
      },
      postedBy: req.user.id,
      status: 'active',
      deadline: req.body.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('postedBy', 'name company')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiters only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiters only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      applicant => applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Get user's resume
    const Resume = require('../models/Resume');
    const resume = await Resume.findOne({ user: req.user.id });

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume before applying'
      });
    }

    // Calculate match score
    const matchScore = calculateMatchScore(resume, job);

    // Add to job applicants
    job.applicants.push({
      user: req.user.id,
      resume: resume._id,
      matchScore: matchScore,
      status: 'pending',
      appliedAt: new Date()
    });

    job.applications += 1;
    await job.save();

    // Add to user's applied jobs
    user.appliedJobs.push({
      job: job._id,
      matchScore: matchScore,
      status: 'pending',
      appliedAt: new Date()
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: { matchScore }
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/jobs/:id/applicants
// @access  Private (Recruiters only)
exports.getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('applicants.user', 'name email')
      .populate('applicants.resume', 'fileName atsScore parsedData');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the job poster or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants'
      });
    }

    res.status(200).json({
      success: true,
      count: job.applicants.length,
      data: job.applicants
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update applicant status
// @route   PUT /api/jobs/:jobId/applicants/:applicantId
// @access  Private (Recruiters only)
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const applicant = job.applicants.id(req.params.applicantId);
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }

    applicant.status = status;
    await job.save();

    // Update user's applied job status
    const user = await User.findById(applicant.user);
    if (user) {
      const userAppliedJob = user.appliedJobs.find(
        aj => aj.job.toString() === job._id.toString()
      );
      if (userAppliedJob) {
        userAppliedJob.status = status;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's applied jobs
// @route   GET /api/user/applied-jobs
// @access  Private
exports.getAppliedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('appliedJobs.job', 'title company location type status')
      .select('appliedJobs');

    res.status(200).json({
      success: true,
      data: user?.appliedJobs || []
    });
  } catch (error) {
    console.error('Get applied jobs error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get job matches for current user
// @route   GET /api/jobs/matches/my
// @access  Private
exports.getJobMatches = async (req, res) => {
  try {
    const Resume = require('../models/Resume');
    const resume = await Resume.findOne({ user: req.user.id });

    if (!resume) {
      return res.json({
        success: true,
        data: []
      });
    }

    const jobs = await Job.find({ 
      status: 'active',
      deadline: { $gt: new Date() }
    }).populate('postedBy', 'name company');

    // Calculate matches
    const matches = jobs.map(job => {
      const matchScore = calculateMatchScore(resume, job);
      return {
        ...job.toObject(),
        matchPercentage: matchScore
      };
    });

    // Sort by match score
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches.slice(0, 10)
    });
  } catch (error) {
    console.error('Get job matches error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to calculate match score
function calculateMatchScore(resume, job) {
  if (!resume || !resume.parsedData || !resume.parsedData.skills) {
    return Math.floor(Math.random() * 30) + 40;
  }

  const jobSkills = job.requirements?.skills || [];
  const candidateSkills = resume.parsedData.skills || [];
  
  const matchedSkills = candidateSkills.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );

  return jobSkills.length > 0 
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 70;
}



// @desc    Get jobs posted by current user (recruiter)
// @route   GET /api/jobs/my-posts
// @access  Private (Recruiters only)
exports.getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};