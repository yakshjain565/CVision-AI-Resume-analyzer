const Resume = require('../models/Resume');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const resumeParser = require('../services/resumeParser');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed.'), false);
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
}).single('resume');

// Calculate ATS Score
const calculateATSScore = (parsedData) => {
  let score = 70;
  const analysis = {
    compatibility: 0,
    missingKeywords: [],
    formatIssues: [],
    suggestions: []
  };

  if (!parsedData.skills || parsedData.skills.length === 0) {
    analysis.formatIssues.push('No skills section found');
    analysis.suggestions.push('Add a dedicated skills section with relevant technologies');
    score -= 10;
  } else if (parsedData.skills.length < 5) {
    analysis.formatIssues.push('Very few skills listed');
    analysis.suggestions.push('List at least 5-10 relevant technical skills');
    score -= 5;
  }

  if (!parsedData.experience || parsedData.experience.length === 0) {
    analysis.formatIssues.push('No work experience section found');
    analysis.suggestions.push('Include your work experience with bullet points');
    score -= 15;
  }

  if (!parsedData.education || parsedData.education.length === 0) {
    analysis.formatIssues.push('No education section found');
    analysis.suggestions.push('Include your educational background');
    score -= 10;
  }

  if (!parsedData.email) {
    analysis.formatIssues.push('No email address found');
    analysis.suggestions.push('Add your email address');
    score -= 5;
  }
  if (!parsedData.phone) {
    analysis.formatIssues.push('No phone number found');
    analysis.suggestions.push('Add your phone number');
    score -= 5;
  }

  const commonKeywords = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'SQL', 'Git', 'REST APIs', 'Agile'];
  const missingKeywords = commonKeywords.filter(keyword => 
    !parsedData.skills?.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  if (missingKeywords.length > 0) {
    analysis.missingKeywords = missingKeywords.slice(0, 5);
    score -= missingKeywords.length * 2;
  }

  analysis.compatibility = Math.min(100, Math.max(0, score));

  return {
    score: analysis.compatibility,
    analysis
  };
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    let fileType = 'txt';
    if (req.file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else if (req.file.mimetype.includes('word')) {
      fileType = 'docx';
    }

    // Parse resume with AI
    const parsedData = await resumeParser.parseResume(req.file.path, fileType);

    // Use AI score if available, otherwise calculate
    let atsScore = parsedData.aiScore || 70;
    let atsAnalysis = {
      compatibility: atsScore,
      missingKeywords: parsedData.missingKeywords || [],
      formatIssues: parsedData.formatIssues || [],
      suggestions: parsedData.suggestions || []
    };

    // Check if user already has a resume
    const existingResume = await Resume.findOne({ user: req.user.id });

    let resume;
    if (existingResume) {
      resume = await Resume.findByIdAndUpdate(
        existingResume._id,
        {
          fileName: req.file.originalname,
          fileUrl: req.file.path,
          fileType,
          parsedData,
          atsScore: atsScore,
          atsAnalysis: atsAnalysis
        },
        { new: true }
      );
    } else {
      resume = await Resume.create({
        user: req.user.id,
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        fileType,
        parsedData,
        atsScore: atsScore,
        atsAnalysis: atsAnalysis
      });

      await User.findByIdAndUpdate(req.user.id, { resume: resume._id });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing resume'
    });
  }
};

// Get user's resume
exports.getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get resume by ID
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate('user', 'name email');
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if user is authorized (owner, recruiter, or admin)
    if (resume.user._id.toString() !== req.user.id && req.user.role === 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this resume'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    if (resume.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resume'
      });
    }

    await fs.unlink(resume.fileUrl).catch(console.error);
    await resume.deleteOne();

    if (resume.user.toString() === req.user.id) {
      await User.findByIdAndUpdate(req.user.id, { $unset: { resume: 1 } });
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Analyze resume for job
exports.analyzeResumeForJob = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    const Job = require('../models/Job');
    const job = await Job.findById(req.params.jobId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found. Please upload your resume first.'
      });
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const jobSkills = job.requirements?.skills || [];
    const candidateSkills = resume.parsedData?.skills || [];
    
    const matchedSkills = candidateSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );

    const matchPercentage = jobSkills.length > 0 
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 50;

    const missingSkills = jobSkills.filter(skill => 
      !candidateSkills.some(s => 
        s.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(s.toLowerCase())
      )
    );

    res.status(200).json({
      success: true,
      data: {
        overall: matchPercentage,
        matchedSkills,
        missingSkills: missingSkills.slice(0, 5),
        recommendations: missingSkills.length > 0 
          ? [`Add experience with: ${missingSkills.slice(0, 3).join(', ')}`]
          : ['Your profile matches well with this position!']
      }
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};