import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  result: AnalysisResult;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  return (
    <div className="bg-white text-brand-text p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-brand-text mb-4">Shot Doctor's Analysis</h2>
      <p className="text-brand-text-secondary mb-8">{result.summary}</p>
      <div className="space-y-4">
        {result.events.map((event, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start border border-gray-200">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                 <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-brand-text">{event.category}</h3>
                <p className="text-brand-text-secondary">{event.feedback}</p>
              </div>
            </div>
            <div className="bg-sky-100 text-sky-700 text-sm font-bold px-3 py-1 rounded-md whitespace-nowrap ml-4">
              {event.timestamp.toFixed(2)}s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisReport;
