const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const aiService = require('./aiService');

class ResumeParser {
  async parsePDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async parseDOCX(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async parseTXT(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  async parseResume(filePath, fileType) {
  try {
    let text = '';
    
    switch(fileType) {
      case 'pdf':
        text = await this.parsePDF(filePath);
        break;
      case 'docx':
        text = await this.parseDOCX(filePath);
        break;
      case 'txt':
        text = await this.parseTXT(filePath);
        break;
      default:
        throw new Error('Unsupported file type');
    }

    // Try AI analysis first
    try {
      console.log('Starting AI analysis...');
      const aiResult = await aiService.analyzeResumeWithAI(text);
      console.log('AI analysis complete');
      
      return {
        name: aiResult.name || '',
        email: aiResult.email || '',
        phone: aiResult.phone || '',
        skills: aiResult.skills || [],
        experience: aiResult.experience || [],
        education: aiResult.education || [],
        certifications: [],
        languages: [],
        totalExperience: aiResult.totalExperience || 0,
        aiScore: aiResult.atsScore || 70,
        missingKeywords: aiResult.missingKeywords || [],
        suggestions: aiResult.suggestions || [],
        formatIssues: aiResult.formatIssues || []
      };
    } catch (aiError) {
      console.log('AI failed, using fallback:', aiError.message);
      // Fallback to basic extraction
      return this.extractData(text);
    }
  } catch (error) {
    throw new Error('Error parsing resume: ' + error.message);
  }
}
  extractData(text) {
    // Basic extraction - will enhance later
    const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'MongoDB'];
    const foundSkills = skills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: foundSkills,
      rawText: text.substring(0, 500) // Store first 500 chars for preview
    };
  }

  extractEmail(text) {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : '';
  }

  extractPhone(text) {
    const match = text.match(/(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/);
    return match ? match[0] : '';
  }

  extractName(text) {
    // Simple name extraction - first line that's not too long
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    for(let line of lines) {
      if(line.length < 30 && !line.includes('@') && !line.includes('http')) {
        return line.trim();
      }
    }
    return '';
  }
}

module.exports = new ResumeParser();