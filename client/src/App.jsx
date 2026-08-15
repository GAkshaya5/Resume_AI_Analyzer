import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FileUpload from './components/FileUpload';
import ScoreGauge from './components/ScoreGauge';
import SkillGap from './components/SkillGap';
import InterviewPrep from './components/InterviewPrep';
import { getHistory } from './services/api';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    fetchHistory();
  };

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            AI Career & Resume Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Upload your resume, paste a job description, and get AI-powered insights
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <FileUpload
              onAnalysisComplete={handleAnalysisComplete}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <div className="space-y-6">
            {analysisResult ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ScoreGauge
                    score={analysisResult.matchScore}
                    feedback={analysisResult.experienceFeedback}
                  />
                  <SkillGap
                    matchingSkills={analysisResult.matchingSkills}
                    missingSkills={analysisResult.missingSkills}
                    courses={analysisResult.recommendedCourses}
                  />
                </div>
                <InterviewPrep questions={analysisResult.interviewQuestions} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-400">
                <p className="text-lg">Your analysis will appear here</p>
                <p className="text-sm">Upload a resume and job description to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Analyses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {history.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                  <p className="font-semibold text-gray-800">{item.candidateName}</p>
                  <p className="text-sm text-gray-600">{item.targetRole}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Match: {item.matchScore}%</span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;