import React, { useEffect, useState } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { getComprehensiveShotAnalysis } from '../services/realTimeCoachService';

interface ComprehensiveAnalysisProps {
  isComplete: boolean;
}

/**
 * Displays a comprehensive analysis of the entire shot after video completion
 */
export const ComprehensiveAnalysis: React.FC<ComprehensiveAnalysisProps> = ({ 
  isComplete 
}) => {
  const { frameHistory } = useAnalysis();
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const getAnalysis = async () => {
      if (!isComplete || frameHistory.length === 0) {
        return;
      }
      
      try {
        setIsLoading(true);
        const result = await getComprehensiveShotAnalysis(frameHistory);
        setAnalysis(result);
      } catch (error) {
        console.error('Error getting comprehensive analysis:', error);
        setAnalysis('Unable to generate comprehensive analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isComplete && frameHistory.length > 0 && !analysis) {
      getAnalysis();
    }
  }, [isComplete, frameHistory, analysis]);
  
  if (!isComplete || frameHistory.length === 0) {
    return null;
  }
  
  return (
    <div className="comprehensive-analysis mt-6 p-6 rounded-lg border-2 border-orange-500 bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-orange-600">Shot Analysis Summary</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2 text-gray-600">Analyzing your shot...</span>
        </div>
      ) : (
        <>
          <div className="analysis-content mb-4">
            <p className="text-gray-800 leading-relaxed">{analysis}</p>
          </div>
          
          <div className="stats-summary grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Key metrics from frameHistory */}
            <div className="stat-card p-3 bg-gray-100 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600">Average Elbow Angle</h3>
              <p className="text-2xl font-bold text-orange-500">
                {Math.round(
                  frameHistory.reduce((sum, frame) => sum + frame.angles.rightElbowAngle, 0) / 
                  frameHistory.length
                )}°
              </p>
            </div>
            
            <div className="stat-card p-3 bg-gray-100 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600">Average Knee Bend</h3>
              <p className="text-2xl font-bold text-orange-500">
                {Math.round(
                  frameHistory.reduce((sum, frame) => sum + frame.angles.kneeAngle, 0) / 
                  frameHistory.length
                )}°
              </p>
            </div>
            
            <div className="stat-card p-3 bg-gray-100 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600">Average Trunk Angle</h3>
              <p className="text-2xl font-bold text-orange-500">
                {Math.round(
                  frameHistory.reduce((sum, frame) => sum + frame.angles.trunkAngle, 0) / 
                  frameHistory.length
                )}°
              </p>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6 text-center">
        <button 
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          onClick={() => window.location.reload()}
        >
          Analyze Another Shot
        </button>
      </div>
    </div>
  );
};
