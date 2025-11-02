
import React from 'react';
import { AnalysisResult } from '../types';
import { EMOTION_COLORS } from '../constants';
import { ClockIcon } from './icons';

interface HistoryPanelProps {
  results: AnalysisResult[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ results }) => {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-xl font-bold text-pet-darkest mb-4 flex items-center">
        <ClockIcon className="w-6 h-6 mr-2" />
        Analysis History
      </h2>
      {results.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-pet-dark">No analysis history yet.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {results.map(result => (
            <li key={result.id} className="bg-pet-lightest/70 p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className={`font-bold ${EMOTION_COLORS[result.dominantEmotion]}`}>
                  {result.dominantEmotion}
                </p>
                <p className="text-sm text-gray-500">{result.mode} Analysis</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {result.timestamp.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPanel;
