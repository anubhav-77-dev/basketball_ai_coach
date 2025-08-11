import React, { useEffect, useState } from 'react';
import { FrameAnalysis, CoachingFeedback } from '../types';
import { getFeedbackForFrame, isFrameAnalysisInProgress } from '../services/analysisBufferService';

interface RealTimeCoachProps {
  currentFrameData: FrameAnalysis | null;
  isPlaying: boolean;
  isAnalysisMode: boolean;
}

/**
 * Displays pre-computed coaching feedback when video is paused
 */
export const RealTimeCoach: React.FC<RealTimeCoachProps> = ({ 
  currentFrameData, 
  isPlaying,
  isAnalysisMode
}) => {
  const [feedback, setFeedback] = useState<CoachingFeedback | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Only show feedback when paused and in analysis mode
    if (!isPlaying && isAnalysisMode && currentFrameData) {
      setIsLoading(true);
      
      // Get pre-computed feedback from buffer
      const cachedFeedback = getFeedbackForFrame(currentFrameData.frameNumber);
      
      if (cachedFeedback) {
        setFeedback(cachedFeedback);
        setIsLoading(false);
      } else if (isFrameAnalysisInProgress(currentFrameData.frameNumber)) {
        // If analysis is in progress, show loading state
        setFeedback(undefined);
        setIsLoading(true);
      } else {
        // No feedback available and not in progress
        setFeedback(undefined);
        setIsLoading(false);
      }
    } else {
      // Don't show feedback when playing
      setFeedback(undefined);
      setIsLoading(false);
    }
  }, [currentFrameData, isPlaying, isAnalysisMode]);
  
  if (!isAnalysisMode || !feedback) {
    return null;
  }
  
  return (
    <div className="real-time-coach-container">
      <div 
        className="real-time-feedback"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '8px',
          maxWidth: '400px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #ff6b00',
          zIndex: 100
        }}
      >
        {isLoading ? (
          <div className="loading-indicator">Analyzing form...</div>
        ) : (
          <div>{feedback}</div>
        )}
      </div>
    </div>
  );
};
