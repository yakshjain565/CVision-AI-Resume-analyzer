const axios = require('axios');

// Use OpenRouter API directly
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Analyze resume with AI using OpenRouter
exports.analyzeResumeWithAI = async (resumeText) => {
  try {
    console.log('Starting AI analysis with OpenRouter...');
    
    // Updated: Working free models on OpenRouter
    const modelsToTry = [
      'google/gemini-flash-1.5',           // Gemini Flash (free)
      'microsoft/phi-3-mini-128k-instruct', // Phi-3 Mini (free)
      'qwen/qwen-2.5-7b-instruct',          // Qwen 2.5 (free)
      'meta-llama/llama-3.1-8b-instruct'    // Llama 3.1 (free)
    ];
    
    let lastError = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await axios.post(
          OPENROUTER_URL,
          {
            model: model,
            messages: [
              {
                role: 'user',
                content: `
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
                `
              }
            ],
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3000',
              'X-Title': 'CVision Resume Analyzer'
            }
          }
        );
        
        const text = response.data.choices[0].message.content;
        console.log(`✅ AI Response received from ${model}`);
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.log(`Model ${model} failed:`, errorMsg);
        lastError = error;
        // Continue to next model
      }
    }
    
    // If all models fail, use fallback
    console.log('⚠️ All models failed, using fallback analysis');
    return fallbackAnalysis(resumeText);
    
  } catch (error) {
    console.error('AI Analysis Error:', error);
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