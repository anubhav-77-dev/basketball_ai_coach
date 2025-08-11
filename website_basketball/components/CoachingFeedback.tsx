import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';

interface CoachingFeedbackProps {
  className?: string;
}

const CoachingFeedback: React.FC<CoachingFeedbackProps> = ({ className = '' }) => {
  const { 
    currentAdvice, 
    summaryAdvice, 
    isAnalysisMode, 
    isVideoPlaying 
  } = useAnalysis();

  if (!isAnalysisMode) {
    return (
      <div className={`p-4 bg-black/80 text-white rounded-lg ${className}`}>
        <p className="text-lg font-semibold mb-2">Shot Doctor AI</p>
        <p>Enable analysis mode to get real-time feedback on your basketball shot.</p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-black/80 text-white rounded-lg ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Shot Doctor AI</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isAnalysisMode ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-sm">{isAnalysisMode ? 'Analysis Active' : 'Analysis Off'}</span>
        </div>
      </div>

      {isVideoPlaying ? (
        <div className="italic text-gray-300 text-sm mb-2">
          Pause the video to see detailed feedback
        </div>
      ) : (
        <>
          {currentAdvice ? (
            <div className="mb-4">
              <h4 className="text-orange-400 font-semibold mb-1">Frame Feedback</h4>
              <p>{currentAdvice.advice}</p>
              
              {currentAdvice.keyPoints && currentAdvice.keyPoints.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-sm text-gray-300">Key Points:</h5>
                  <ul className="list-disc list-inside text-sm">
                    {currentAdvice.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 mb-4">
              No specific feedback for this frame. Try moving to a different part of the shot.
            </div>
          )}

          {summaryAdvice && (
            <div>
              <h4 className="text-orange-400 font-semibold mb-1">Overall Analysis</h4>
              <p className="text-sm">{summaryAdvice}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoachingFeedback;
