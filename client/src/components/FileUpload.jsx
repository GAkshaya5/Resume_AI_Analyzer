import React, { useState, useRef } from 'react';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { analyzeResume } from '../services/api';

const FileUpload = ({ onAnalysisComplete, loading, setLoading }) => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      alert('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
    } else {
      alert('Only PDF files are accepted');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a resume PDF');
    if (!targetRole.trim()) return alert('Target role is required');
    if (!jobDescription.trim()) return alert('Job description is required');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);
      formData.append('jobDescription', jobDescription);

      const response = await analyzeResume(formData);
      onAnalysisComplete(response.data);
    } catch (error) {
      alert(error.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload & Analyze</h2>
      <form onSubmit={handleSubmit}>
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop your PDF resume here, or{' '}
              <button
                type="button"
                className="text-blue-600 underline hover:text-blue-800"
                onClick={() => fileInputRef.current.click()}
              >
                browse
              </button>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* File preview */}
        {file && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-4">
            <div className="flex items-center space-x-2">
              <File className="w-5 h-5 text-blue-600" />
              <span className="text-sm truncate max-w-xs">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Target Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Role *
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Full Stack Developer"
            required
          />
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description *
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the full job description here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Resume with AI...
            </>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;