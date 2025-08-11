import { FrameAnalysis, CoachingFeedback } from '../types';
import { getRealTimeCoachingFeedback } from './realTimeCoachService';

/**
 * Service to manage buffering of frame analysis and feedback
 * This service pre-computes feedback for frames and stores it
 * so users can immediately see advice when pausing the video
 */

// Store feedback for each frame
const feedbackBuffer: Map<number, CoachingFeedback> = new Map();

// Track which frames have analysis in progress
const inProgressFrames: Set<number> = new Set();

// Configurable settings
const BUFFER_INTERVAL = 10; // Only analyze every Nth frame to reduce API calls
const MAX_CONCURRENT_REQUESTS = 2; // Limit concurrent API requests

/**
 * Queue for frames waiting to be analyzed
 */
let analysisQueue: FrameAnalysis[] = [];
let isProcessingQueue = false;

/**
 * Add a frame to the analysis queue
 */
export const queueFrameForAnalysis = (frameData: FrameAnalysis): void => {
  // Only queue frames at regular intervals to reduce API calls
  if (frameData.frameNumber % BUFFER_INTERVAL !== 0) {
    return;
  }
  
  // Don't queue frames that are already in progress or completed
  if (inProgressFrames.has(frameData.frameNumber) || feedbackBuffer.has(frameData.frameNumber)) {
    return;
  }
  
  analysisQueue.push(frameData);
  
  // Start processing the queue if not already in progress
  if (!isProcessingQueue) {
    processAnalysisQueue();
  }
};

/**
 * Process the queue of frames waiting for analysis
 */
const processAnalysisQueue = async (): Promise<void> => {
  if (isProcessingQueue || analysisQueue.length === 0) {
    return;
  }
  
  isProcessingQueue = true;
  
  try {
    // Process up to MAX_CONCURRENT_REQUESTS frames at a time
    const batch = analysisQueue.slice(0, MAX_CONCURRENT_REQUESTS);
    analysisQueue = analysisQueue.slice(MAX_CONCURRENT_REQUESTS);
    
    // Mark these frames as in progress
    batch.forEach(frame => inProgressFrames.add(frame.frameNumber));
    
    // Process all frames in the batch concurrently
    await Promise.all(batch.map(async (frameData) => {
      try {
        const feedback = await getRealTimeCoachingFeedback(frameData);
        
        // Store the feedback in the buffer
        feedbackBuffer.set(frameData.frameNumber, {
          timestamp: frameData.timestamp,
          category: 'Form Analysis',
          feedback,
          confidence: 0.8, // Default confidence level
        });
      } catch (error) {
        console.error(`Error analyzing frame ${frameData.frameNumber}:`, error);
      } finally {
        // Mark this frame as no longer in progress
        inProgressFrames.delete(frameData.frameNumber);
      }
    }));
    
    // Continue processing the queue if there are more frames
    if (analysisQueue.length > 0) {
      processAnalysisQueue();
    } else {
      isProcessingQueue = false;
    }
  } catch (error) {
    console.error('Error processing analysis queue:', error);
    isProcessingQueue = false;
  }
};

/**
 * Get feedback for a specific frame
 * Returns undefined if feedback is not yet available
 */
export const getFeedbackForFrame = (frameNumber: number): CoachingFeedback | undefined => {
  // First check if we have exact frame feedback
  if (feedbackBuffer.has(frameNumber)) {
    return feedbackBuffer.get(frameNumber);
  }
  
  // If not, find the closest available frame (within a reasonable range)
  const MAX_FRAME_DISTANCE = BUFFER_INTERVAL * 2;
  
  // Try frames within the range
  for (let offset = 1; offset <= MAX_FRAME_DISTANCE; offset++) {
    // Try earlier frame
    if (feedbackBuffer.has(frameNumber - offset)) {
      return feedbackBuffer.get(frameNumber - offset);
    }
    
    // Try later frame
    if (feedbackBuffer.has(frameNumber + offset)) {
      return feedbackBuffer.get(frameNumber + offset);
    }
  }
  
  // No nearby feedback available
  return undefined;
};

/**
 * Check if analysis is in progress for a specific frame
 */
export const isFrameAnalysisInProgress = (frameNumber: number): boolean => {
  return inProgressFrames.has(frameNumber);
};

/**
 * Clear all buffered feedback (e.g., when starting a new video)
 */
export const clearFeedbackBuffer = (): void => {
  feedbackBuffer.clear();
  inProgressFrames.clear();
  analysisQueue = [];
  isProcessingQueue = false;
};
