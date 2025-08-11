import React from 'react';
import { AnalysisResult } from '../types';
import { Icons } from './Icons';

interface FeedbackTimelineProps {
  result: AnalysisResult;
  onTimestampClick: (timestamp: number) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'stance and balance':
      return <Icons.footprints className="h-6 w-6 text-orange-400" />;
    case 'elbow alignment':
      return <Icons.target className="h-6 w-6 text-orange-400" />;
    case 'release point':
      return <Icons.arrowUp className="h-6 w-6 text-orange-400" />;
    case 'follow-through':
      return <Icons.hand className="h-6 w-6 text-orange-400" />;
    case 'shot pocket':
      return <Icons.basketball className="h-6 w-6 text-orange-400" />;
    default:
      return <Icons.clipboard className="h-6 w-6 text-orange-400" />;
  }
};

export const FeedbackTimeline: React.FC<FeedbackTimelineProps> = ({ result, onTimestampClick }) => {
  return (
    <div className="mt-6 p-5 bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-orange-400 mb-3 border-b-2 border-gray-700 pb-2">
        Shot Doctor's Analysis
      </h3>
      <p className="text-white mb-5 text-lg">{result.summary}</p>
      
      <div className="space-y-4">
        {result.events.map((event, index) => (
          <div 
            key={index}
            onClick={() => onTimestampClick(event.timestamp)}
            className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="flex-shrink-0 pt-1">
              {getCategoryIcon(event.category)}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <p className="font-bold text-lg text-white">{event.category}</p>
                <p className="text-sm font-mono bg-gray-900 text-orange-400 px-2 py-1 rounded">
                  {event.timestamp.toFixed(2)}s
                </p>
              </div>
              <p className="text-gray-300">{event.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
