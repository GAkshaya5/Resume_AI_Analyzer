const analyzeResumeWithAI = async (pdfText, jobDescription, targetRole) => {
  // Return dummy data – no API call
  return {
    candidateName: "Test Candidate",
    matchScore: 78,
    matchingSkills: ["React", "Node.js", "Express", "MongoDB"],
    missingSkills: ["Docker", "Redis"],
    experienceFeedback: "Solid experience, but missing DevOps and caching.",
    recommendedCourses: [
      { title: "Docker Deep Dive", area: "DevOps" },
      { title: "Redis in Action", area: "Caching" }
    ],
    interviewQuestions: [
      { question: "Explain how Docker containers work.", context: "Missing skill", targetSkill: "Docker" },
      { question: "When would you use Redis?", context: "Missing skill", targetSkill: "Redis" }
    ]
  };
};

module.exports = { analyzeResumeWithAI };