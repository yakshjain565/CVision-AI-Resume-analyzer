const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Analyze resume with AI
exports.analyzeResumeWithAI = async (resumeText) => {
  try {
    console.log('Sending to Gemini AI...');
    
    const prompt = `
      You are an expert ATS (Applicant Tracking System) and resume analyzer. 
      Analyze this resume and provide detailed feedback in JSON format.

      Resume text:
      ${resumeText.substring(0, 4000)}

      Return a JSON object with exactly this structure:
      {
        "name": "Candidate's full name",
        "email": "Email address",
        "phone": "Phone number",
        "skills": ["skill1", "skill2", "skill3"],
        "experience": [
          {
            "title": "Job title",
            "company": "Company name",
            "duration": "Time period",
            "description": "Brief description"
          }
        ],
        "education": [
          {
            "degree": "Degree name",
            "institution": "Institution name",
            "year": "Graduation year"
          }
        ],
        "totalExperience": 3,
        "atsScore": 75,
        "missingKeywords": ["React", "Node.js", "MongoDB"],
        "suggestions": [
          "Add more technical skills",
          "Include quantifiable achievements",
          "Optimize for ATS with keywords"
        ],
        "formatIssues": [
          "Add professional summary",
          "Use bullet points for experience"
        ]
      }

      Only return valid JSON, no other text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response received');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);
    // Fallback to basic analysis
    return fallbackAnalysis(resumeText);
  }
};

// Fallback function
function fallbackAnalysis(text) {
  return {
    name: extractName(text) || "Candidate",
    email: extractEmail(text) || "",
    phone: extractPhone(text) || "",
    skills: extractSkills(text),
    experience: [],
    education: [],
    totalExperience: 2,
    atsScore: calculateBasicScore(text),
    missingKeywords: ["JavaScript", "React", "Node.js", "AWS"],
    suggestions: [
      "Add more technical skills to improve ATS score",
      "Include a professional summary section",
      "Quantify your achievements with numbers"
    ],
    formatIssues: [
      "Resume could be better formatted",
      "Add section headers clearly"
    ]
  };
}

// Helper functions
function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const match = text.match(/(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/);
  return match ? match[0] : '';
}

function extractName(text) {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  return lines.length > 0 ? lines[0].trim() : '';
}

function extractSkills(text) {
  const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'HTML', 'CSS', 'MongoDB', 'SQL', 'AWS', 'Git'];
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
}

function calculateBasicScore(text) {
  let score = 50;
  if (text.length > 500) score += 10;
  if (extractEmail(text)) score += 5;
  if (extractPhone(text)) score += 5;
  if (extractSkills(text).length > 3) score += 10;
  if (text.toLowerCase().includes('experience')) score += 5;
  if (text.toLowerCase().includes('education')) score += 5;
  return Math.min(100, score);
}