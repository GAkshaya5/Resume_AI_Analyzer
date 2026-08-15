const mongoose = require('mongoose');

const JobAnalysisSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  targetRole: { type: String, required: true },
  jobDescription: { type: String, required: true },
  matchScore: { type: Number, min: 0, max: 100, required: true },
  matchingSkills: { type: [String], required: true },
  missingSkills: { type: [String], required: true },
  experienceFeedback: { type: String, required: true },
  recommendedCourses: [
    {
      title: String,
      area: String,
    },
  ],
  interviewQuestions: [
    {
      question: String,
      context: String,
      targetSkill: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobAnalysis', JobAnalysisSchema);