
import React from 'react';
import { AnalysisResult, Emotion } from '../types';
import { EMOTION_COLORS, EMOTION_BGS } from '../constants';
import { ChartBarIcon } from './icons';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const sortedEmotions = Object.entries(result.scores).sort(([, a], [, b]) => b - a) as [Emotion, number][];

  return (
    <div className="w-full p-4 bg-pet-lightest/80 rounded-lg text-center animate-fade-in">
        <h3 className="font-bold text-lg text-pet-darkest mb-2 flex items-center justify-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Analysis Complete
        </h3>
        <p className="text-3xl md:text-4xl font-bold mb-1" style={{color: EMOTION_COLORS[result.dominantEmotion].replace('text-','').replace('-500','')}}>
            {result.dominantEmotion}
        </p>
        <p className="text-sm text-gray-500 mb-4">
            Confidence: {(result.scores[result.dominantEmotion] * 100).toFixed(1)}%
        </p>

        <div className="space-y-2 text-left">
            <h4 className="text-sm font-semibold text-pet-darkest mb-1">Emotion Breakdown:</h4>
            {sortedEmotions.map(([emotion, score]) => (
                <div key={emotion}>
                    <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-sm font-medium ${EMOTION_COLORS[emotion]}`}>{emotion}</span>
                        <span className="text-xs font-mono text-gray-500">{(score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`${EMOTION_BGS[emotion]} h-2.5 rounded-full`} style={{ width: `${score * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
         <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fadeIn 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default ResultsDisplay;
