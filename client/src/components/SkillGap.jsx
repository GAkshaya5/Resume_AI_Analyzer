import React from 'react';

const SkillGap = ({ matchingSkills, missingSkills, courses }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Skill Gap Analysis</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-gray-600 mr-2">Matched:</span>
        {matchingSkills.length > 0 ? (
          matchingSkills.map((skill, i) => (
            <span key={i} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">None</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm font-medium text-gray-600 mr-2">Missing:</span>
        {missingSkills.length > 0 ? (
          missingSkills.map((skill, i) => (
            <span key={i} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">None</span>
        )}
      </div>

      {courses && courses.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Recommended Learning</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {courses.map((course, i) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-md p-3">
                <p className="font-medium text-blue-800">{course.title}</p>
                <p className="text-xs text-blue-600">Area: {course.area}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGap;