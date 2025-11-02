import React, { useState, useRef } from 'react';
import { Pet, AnalysisMode, AnalysisResult, Emotion } from '../types';
import SoundAnalysis from './SoundAnalysis';
import type { SoundAnalysisHandle } from './SoundAnalysis';
import CameraAnalysis from './CameraAnalysis';
import type { CameraAnalysisHandle } from './CameraAnalysis';
import ResultsDisplay from './ResultsDisplay';
import { MicIcon, CameraIcon, SparklesIcon } from './icons';
import { GoogleGenAI, Type, Part } from '@google/genai';


interface AnalysisPanelProps {
  pet: Pet;
  onAnalysisComplete: (result: Omit<AnalysisResult, 'id'>) => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ pet, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<AnalysisMode>(AnalysisMode.Sound);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestResult, setLatestResult] = useState<AnalysisResult | null>(null);
  const soundAnalysisRef = useRef<SoundAnalysisHandle>(null);
  const cameraAnalysisRef = useRef<CameraAnalysisHandle>(null);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setLatestResult(null);
    try {
      const parts: Part[] = [];

      const prompt = `Analyze the emotion of my ${pet.type}, ${pet.name}, who is ${pet.age} years old. Based on the provided image and/or sound, determine its emotional state. The possible emotions are: ${Object.values(Emotion).join(', ')}.`;
      parts.push({ text: prompt });
      
      if (activeTab === AnalysisMode.Movement || activeTab === AnalysisMode.Combined) {
        const imageData = cameraAnalysisRef.current?.captureFrame();
        if (imageData) {
          parts.push({ inlineData: { data: imageData, mimeType: 'image/jpeg' } });
        } else {
          console.error("Failed to capture image.");
        }
      }

      if (activeTab === AnalysisMode.Sound || activeTab === AnalysisMode.Combined) {
        const audioCapture = await soundAnalysisRef.current?.captureAudio();
        if (audioCapture) {
          parts.push({ inlineData: { data: audioCapture.base64, mimeType: audioCapture.mimeType } });
        } else {
           console.error("Failed to capture audio.");
        }
      }

      if (parts.length <= 1) {
          console.error("No media to analyze.");
          // TODO: Show an error to the user
          setIsAnalyzing(false);
          return;
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          dominantEmotion: { type: Type.STRING, enum: Object.values(Emotion) },
          scores: {
            type: Type.OBJECT,
            properties: {
              [Emotion.Happy]: { type: Type.NUMBER },
              [Emotion.Playful]: { type: Type.NUMBER },
              [Emotion.Anxious]: { type: Type.NUMBER },
              [Emotion.Relaxed]: { type: Type.NUMBER },
              [Emotion.Hungry]: { type: Type.NUMBER },
            },
            required: Object.values(Emotion),
          },
        },
        required: ['dominantEmotion', 'scores'],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
      });

      const jsonText = response.text;
      const resultData = JSON.parse(jsonText);

      const newResult: AnalysisResult = {
        ...resultData,
        id: new Date().toISOString(),
        petId: pet.id,
        timestamp: new Date(),
        mode: activeTab,
      };

      setLatestResult(newResult);
      onAnalysisComplete(newResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      // TODO: Display an error message to the user
    } finally {
      setIsAnalyzing(false);
    }
  };

  const TABS = [
    { mode: AnalysisMode.Sound, icon: <MicIcon className="w-5 h-5 mr-2" />, label: 'Sound' },
    { mode: AnalysisMode.Movement, icon: <CameraIcon className="w-5 h-5 mr-2" />, label: 'Movement' },
    { mode: AnalysisMode.Combined, icon: <SparklesIcon className="w-5 h-5 mr-2" />, label: 'Combined' },
  ];

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-pet-darkest mb-4">Real-time Emotion Analysis for {pet.name}</h2>
      
      <div className="mb-4 border-b border-pet-light/50">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {TABS.map(tab => (
            <button
              key={tab.mode}
              onClick={() => setActiveTab(tab.mode)}
              className={`whitespace-nowrap flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.mode
                  ? 'border-pet-medium text-pet-dark'
                  : 'border-transparent text-gray-500 hover:text-pet-dark hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[350px]">
        <div>
          {activeTab === AnalysisMode.Sound && <SoundAnalysis ref={soundAnalysisRef} isAnalyzing={isAnalyzing} />}
          {activeTab === AnalysisMode.Movement && <CameraAnalysis ref={cameraAnalysisRef} isAnalyzing={isAnalyzing} />}
          {activeTab === AnalysisMode.Combined && (
            <div className="flex space-x-2 h-full">
              <div className="w-1/2"><SoundAnalysis ref={soundAnalysisRef} isAnalyzing={isAnalyzing} /></div>
              <div className="w-1/2"><CameraAnalysis ref={cameraAnalysisRef} isAnalyzing={isAnalyzing} /></div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
            {isAnalyzing && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pet-medium mx-auto"></div>
                    <p className="mt-4 text-pet-dark font-semibold">Analyzing your pet's emotions...</p>
                    <p className="text-sm text-gray-500">This might take a moment.</p>
                </div>
            )}
            {!isAnalyzing && latestResult && (
                <ResultsDisplay result={latestResult} />
            )}
             {!isAnalyzing && !latestResult && (
                <div className="text-center text-pet-darkest">
                    <p className="text-lg font-semibold">Ready to Analyze</p>
                    <p className="text-sm text-gray-500">Click the button below to start.</p>
                </div>
             )}
        </div>
      </div>
       <div className="mt-6 flex justify-center">
        <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="px-8 py-3 bg-pet-medium text-white font-bold rounded-full shadow-lg hover:bg-pet-dark transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed flex items-center"
            >
            <SparklesIcon className="w-5 h-5 mr-2"/>
            {isAnalyzing ? 'Analyzing...' : `Start ${activeTab} Analysis`}
        </button>
      </div>
    </div>
  );
};

export default AnalysisPanel;
