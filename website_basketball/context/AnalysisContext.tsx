import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import { FrameAnalysis, FrameBatch, StoredAdvice, AnalysisStore } from '../types';
import { analyzeBatch } from '../services/realTimeCoachService';

// Batch size for frame analysis (roughly 1 second at 60fps)
const BATCH_SIZE = 60;
// Minimum frames needed before sending for analysis
const MIN_FRAMES_FOR_ANALYSIS = 30;

interface AnalysisContextType {
  currentFrameData: FrameAnalysis | null;
  frameHistory: FrameAnalysis[];
  isAnalysisMode: boolean;
  isVideoPlaying: boolean;
  currentAdvice: StoredAdvice | null;
  adviceByFrame: Map<number, StoredAdvice>;
  summaryAdvice: string | null;
  setCurrentFrameData: (data: FrameAnalysis | null) => void;
  addToFrameHistory: (data: FrameAnalysis) => void;
  clearAllData: () => void;
  toggleAnalysisMode: () => void;
  setIsVideoPlaying: (isPlaying: boolean) => void;
}

export const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Custom hook to use the analysis context will be defined at the end of the file

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  // Current frame data
  const [currentFrameData, setCurrentFrameData] = useState<FrameAnalysis | null>(null);
  const [frameHistory, setFrameHistory] = useState<FrameAnalysis[]>([]);
  
  // Application state
  const [isAnalysisMode, setIsAnalysisMode] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  
  // Advice storage
  const [currentAdvice, setCurrentAdvice] = useState<StoredAdvice | null>(null);
  const [adviceByFrame, setAdviceByFrame] = useState<Map<number, StoredAdvice>>(new Map());
  const [summaryAdvice, setSummaryAdvice] = useState<string | null>(null);
  
  // Internal storage for batch processing
  const analysisStoreRef = useRef<AnalysisStore>({
    adviceByTimestamp: new Map(),
    pendingBatches: [],
    processingBatch: null,
    completedBatches: [],
    summary: null
  });
  
  // Batch collection for pending frames
  const pendingFramesRef = useRef<FrameAnalysis[]>([]);
  
  // Add to frame history and manage batches
  const addToFrameHistory = (data: FrameAnalysis) => {
    if (!isAnalysisMode) return;
    
    // Add to the history
    setFrameHistory(prev => {
      const newHistory = [...prev, data];
      // Keep last 5 seconds (300 frames at 60fps)
      if (newHistory.length > 300) {
        return newHistory.slice(newHistory.length - 300);
      }
      return newHistory;
    });
    
    // Update current frame data
    setCurrentFrameData(data);
    
    // Check if there's stored advice for this frame
    const frameAdvice = adviceByFrame.get(data.frameNumber);
    if (frameAdvice) {
      setCurrentAdvice(frameAdvice);
    } else if (!isVideoPlaying) {
      // If we're paused but don't have advice, set to null
      setCurrentAdvice(null);
    }
    
    // Add to pending frames for batch processing
    pendingFramesRef.current.push(data);
    
    // If we have enough frames and we're in analysis mode, create a batch
    if (pendingFramesRef.current.length >= BATCH_SIZE && isAnalysisMode) {
      const frames = [...pendingFramesRef.current];
      pendingFramesRef.current = [];
      
      const newBatch: FrameBatch = {
        startFrame: frames[0].frameNumber,
        endFrame: frames[frames.length - 1].frameNumber,
        frames,
        processed: false
      };
      
      analysisStoreRef.current.pendingBatches.push(newBatch);
    }
  };
  
  // Clear all data
  const clearAllData = () => {
    setFrameHistory([]);
    setCurrentFrameData(null);
    setCurrentAdvice(null);
    setAdviceByFrame(new Map());
    setSummaryAdvice(null);
    pendingFramesRef.current = [];
    analysisStoreRef.current = {
      adviceByTimestamp: new Map(),
      pendingBatches: [],
      processingBatch: null,
      completedBatches: [],
      summary: null
    };
  };

  const toggleAnalysisMode = () => {
    setIsAnalysisMode(prev => !prev);
  };

  // Process pending batches
  useEffect(() => {
    if (!isAnalysisMode) return;
    
    let isMounted = true;
    
    const processNextBatch = async () => {
      const store = analysisStoreRef.current;
      
      // If we're already processing a batch or have no pending batches, return
      if (store.processingBatch || store.pendingBatches.length === 0) return;
      
      // Get the next batch
      const nextBatch = store.pendingBatches.shift();
      if (!nextBatch) return;
      
      // Set as processing
      store.processingBatch = nextBatch;
      
      try {
        // Send to LLM for analysis
        const results = await analyzeBatch(nextBatch);
        
        if (!isMounted) return;
        
        // Store the advice
        if (results && results.advice) {
          const newAdviceMap = new Map(adviceByFrame);
          
          results.advice.forEach(advice => {
            // Store by frame number
            newAdviceMap.set(advice.frameNumber, advice);
            
            // Also store in our internal reference
            store.adviceByTimestamp.set(advice.timestamp, advice);
          });
          
          setAdviceByFrame(newAdviceMap);
          
          // If we have a summary, update it
          if (results.summary) {
            setSummaryAdvice(results.summary);
            store.summary = results.summary;
          }
        }
        
        // Mark as completed and move to completed batches
        nextBatch.processed = true;
        store.completedBatches.push(nextBatch);
        store.processingBatch = null;
        
        // Process next batch if available
        if (store.pendingBatches.length > 0) {
          processNextBatch();
        }
      } catch (error) {
        console.error("Error processing batch:", error);
        // Return batch to pending
        store.pendingBatches.unshift(nextBatch);
        store.processingBatch = null;
      }
    };
    
    // Start processing if we have pending batches
    if (analysisStoreRef.current.pendingBatches.length > 0 && 
        !analysisStoreRef.current.processingBatch) {
      processNextBatch();
    }
    
    // Check for new batches every 2 seconds
    const intervalId = setInterval(() => {
      if (analysisStoreRef.current.pendingBatches.length > 0 && 
          !analysisStoreRef.current.processingBatch) {
        processNextBatch();
      }
    }, 2000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isAnalysisMode, adviceByFrame]);

  return (
    <AnalysisContext.Provider
      value={{
        currentFrameData,
        frameHistory,
        isAnalysisMode,
        isVideoPlaying,
        currentAdvice,
        adviceByFrame,
        summaryAdvice,
        setCurrentFrameData,
        addToFrameHistory,
        clearAllData,
        toggleAnalysisMode,
        setIsVideoPlaying
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

// Custom hook to use the analysis context
export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
