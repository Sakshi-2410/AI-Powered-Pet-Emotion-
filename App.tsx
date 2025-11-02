
import React, { useState, useCallback, useMemo } from 'react';
import { Pet, AnalysisResult } from './types';
import { PET_AVATARS } from './constants';
import Header from './components/Header';
import PetSelector from './components/PetSelector';
import AnalysisPanel from './components/AnalysisPanel';
import HistoryPanel from './components/HistoryPanel';

const FloatingEmojis: React.FC = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
    {'🐕🐈🐇🐶🐱🐰'.split('').map((emoji, i) => (
      <div
        key={i}
        className="absolute text-5xl opacity-10 animate-float"
        style={{
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          animationDuration: `${Math.random() * 20 + 15}s`,
          animationDelay: `-${Math.random() * 10}s`,
        }}
      >
        {emoji}
      </div>
    ))}
    <style>{`
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(10deg); }
        100% { transform: translateY(0) rotate(0deg); }
      }
      .animate-float {
        animation-name: float;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
    `}</style>
  </div>
);

const App: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([
    { id: '1', name: 'Buddy', type: 'dog', breed: 'Golden Retriever', age: 5, avatar: PET_AVATARS.dog[0] },
    { id: '2', name: 'Whiskers', type: 'cat', breed: 'Siamese', age: 3, avatar: PET_AVATARS.cat[0] },
  ]);
  const [activePetId, setActivePetId] = useState<string>('1');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const activePet = useMemo(() => pets.find(p => p.id === activePetId), [pets, activePetId]);

  const handleAddPet = useCallback((pet: Omit<Pet, 'id'>) => {
    const newPet = { ...pet, id: new Date().toISOString() };
    setPets(prev => [...prev, newPet]);
    setActivePetId(newPet.id);
  }, []);

  const handleAnalysisComplete = useCallback((result: Omit<AnalysisResult, 'id'>) => {
    setAnalysisResults(prev => [{ ...result, id: new Date().toISOString() }, ...prev]);
  }, []);
  
  const petAnalysisHistory = useMemo(() => {
    return analysisResults.filter(r => r.petId === activePetId);
  }, [analysisResults, activePetId]);


  return (
    <div className="min-h-screen bg-pet-lightest text-pet-darkest font-sans">
      <FloatingEmojis />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <PetSelector
            pets={pets}
            activePetId={activePetId}
            onSelectPet={setActivePetId}
            onAddPet={handleAddPet}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activePet ? (
                <AnalysisPanel pet={activePet} onAnalysisComplete={handleAnalysisComplete} />
              ) : (
                <div className="flex items-center justify-center h-full bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
                  <p className="text-xl text-pet-dark">Please add a pet to begin analysis.</p>
                </div>
              )}
            </div>
            <div>
              <HistoryPanel results={petAnalysisHistory} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
