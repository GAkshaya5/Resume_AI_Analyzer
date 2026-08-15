import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const InterviewPrep = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Interview Questions</h3>
        <p className="text-gray-500 text-sm">No questions generated.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        AI-Generated Interview Questions
      </h3>
      <div className="space-y-2">
        {questions.map((q, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              onClick={() => toggle(idx)}
            >
              <span className="font-medium text-gray-800">
                Q{idx + 1}: {q.targetSkill}
              </span>
              {openIndex === idx ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700">{q.question}</p>
                <p className="text-xs text-gray-500 mt-1">Context: {q.context}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPrep;