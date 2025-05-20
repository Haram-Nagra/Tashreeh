import React, { useState } from "react";
import { uploadAudioAndSummarize } from "../services/audioService";

const AudioUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState("");
  const [fullText, setFullText] = useState("");
  const [error, setError] = useState("");

  // Handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      uploadAudio(file);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      uploadAudio(file);
    }
  };

  // Handle audio upload and summarization
  const uploadAudio = async (file) => {
    setIsUploading(true);
    setError("");
    try {
      const data = await uploadAudioAndSummarize(file);
      setSummary(data.summary); // Displaying the summary
      setFullText(data.fullText); // Optional: Display the full text
    } catch (error) {
      setError("An error occurred while uploading and transcribing the audio.");
      console.error("Error uploading audio:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Updated Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_50%,rgba(201,235,255,0.6),transparent)]"></div>
      </div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mt-8 mb-10 animate-fadeIn">
        <h3 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
          Audio Upload & Transcription
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2 animate-pulse"></span>
        </h3>
        <p className="text-gray-600 text-lg font-light leading-relaxed">
          Upload your audio file and let AI transcribe it for you as the summarization is paid.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* File Upload Section */}
        <div
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          className="p-6 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl 
            shadow-lg hover:shadow-xl transition-all duration-300 animate-slideUp"
        >
          <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Upload Audio File
          </h4>
          <div
            className="border-2 border-dashed border-blue-200 rounded-lg p-8 
            bg-white/50 backdrop-blur-sm hover:bg-blue-50/50 
            transition-all duration-300 cursor-pointer group"
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="w-full cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-full 
                file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white
                hover:file:bg-blue-600 file:transition-all file:duration-300 file:cursor-pointer
                file:shadow-sm hover:file:shadow-md"
            />
          </div>
        </div>

        {/* Uploading Indicator */}
        {isUploading && (
          <div
            className="flex items-center space-x-2 text-blue-600 bg-white/80 backdrop-blur-sm 
            p-4 rounded-lg animate-pulse transform animate-slideUp shadow-lg"
          >
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="font-medium">Processing your audio...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="bg-white/80 backdrop-blur-sm border-l-4 border-red-500 p-4 
            rounded-lg animate-slideUp shadow-lg"
          >
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Display Summary */}
        {summary && (
          <div
            className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl p-6 
            shadow-lg hover:shadow-xl transition-all duration-300 animate-slideUp"
          >
            <h4 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Summary
            </h4>
            <p className="text-gray-600 leading-relaxed font-light">
              {summary}
            </p>
          </div>
        )}

        {/* Display Full Text */}
        {fullText && (
          <div
            className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl p-6 
            shadow-lg hover:shadow-xl transition-all duration-300 animate-slideUp"
          >
            <h4 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Full Transcription
            </h4>
            <div
              className="text-gray-600 leading-relaxed font-light max-h-96 overflow-y-auto 
              scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent pr-2"
            >
              {fullText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add these animations to your CSS file
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out;
}

.bg-grid-pattern {
  background-image: linear-gradient(to right, #f0f9ff 1px, transparent 1px),
    linear-gradient(to bottom, #f0f9ff 1px, transparent 1px);
  background-size: 24px 24px;
}
`;

export default AudioUpload;
