const pdfParse = require('pdf-parse');
const { analyzeResumeWithAI } = require('../services/geminiService');
const JobAnalysis = require('../models/JobAnalysis');

// @desc    Analyze resume against job description
// @route   POST /api/resume/analyze
// @access  Public
exports.analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file uploaded' });
    }

    const { targetRole, jobDescription } = req.body;
    if (!targetRole || !jobDescription) {
      return res.status(400).json({ success: false, error: 'Target role and job description are required' });
    }

    // Parse PDF
    let pdfText;
    try {
      const data = await pdfParse(req.file.buffer);
      pdfText = data.text;
    } catch (error) {
      const err = new Error('Failed to parse PDF');
      err.code = 'PDF_PARSE_ERROR';
      return next(err);
    }

    // Analyze with Gemini
    let analysisResult;
    try {
      analysisResult = await analyzeResumeWithAI(pdfText, jobDescription, targetRole);
    } catch (error) {
      return next(error);
    }

    // Save to MongoDB
    const newAnalysis = new JobAnalysis({
      candidateName: analysisResult.candidateName,
      targetRole,
      jobDescription,
      matchScore: analysisResult.matchScore,
      matchingSkills: analysisResult.matchingSkills,
      missingSkills: analysisResult.missingSkills,
      experienceFeedback: analysisResult.experienceFeedback,
      recommendedCourses: analysisResult.recommendedCourses,
      interviewQuestions: analysisResult.interviewQuestions,
    });

    await newAnalysis.save();

    res.status(200).json({ success: true, data: newAnalysis });
  } catch (error) {
    next(error);
  }
};

// @desc    Get last 10 analyses
// @route   GET /api/resume/history
// @access  Public
exports.getHistory = async (req, res, next) => {
  try {
    const history = await JobAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-jobDescription'); // exclude heavy description for brevity
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};