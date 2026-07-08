const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One resume per user
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'txt'],
    required: true
  },
  parsedData: {
    name: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String
    }],
    education: [{
      degree: String,
      field: String,
      institution: String,
      location: String,
      graduationDate: Date,
      gpa: String
    }],
    certifications: [String],
    languages: [String],
    totalExperience: Number
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  atsAnalysis: {
    compatibility: {
      type: Number,
      default: 0
    },
    missingKeywords: [String],
    formatIssues: [String],
    suggestions: [String]
  },
  keywordDensity: {
    type: Map,
    of: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
ResumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', ResumeSchema);