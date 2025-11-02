
import React, { useState } from 'react';
import { Pet } from '../types';
import { AddPetModal } from './AddPetModal';
import { PlusIcon } from './icons';

interface PetSelectorProps {
  pets: Pet[];
  activePetId: string | null;
  onSelectPet: (id: string) => void;
  onAddPet: (pet: Omit<Pet, 'id'>) => void;
}

const PetCard: React.FC<{ pet: Pet; isActive: boolean; onClick: () => void }> = ({ pet, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
      isActive ? 'bg-pet-medium text-white shadow-lg' : 'bg-white/50 hover:bg-pet-light/50'
    }`}
  >
    <div className="text-4xl mr-4">{pet.avatar}</div>
    <div>
      <p className="font-bold text-left">{pet.name}</p>
      <p className="text-sm text-left opacity-80">{pet.breed}</p>
    </div>
  </button>
);

const AddPetCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/50 hover:bg-pet-light/50 transition-all duration-300 transform hover:scale-105 h-full"
  >
    <PlusIcon className="w-8 h-8 text-pet-dark" />
    <p className="mt-2 font-bold text-pet-darkest">Add Pet</p>
  </button>
);


const PetSelector: React.FC<PetSelectorProps> = ({ pets, activePetId, onSelectPet, onAddPet }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPetSubmit = (pet: Omit<Pet, 'id'>) => {
    onAddPet(pet);
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold mb-3 text-pet-darkest">Select a Pet</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              isActive={pet.id === activePetId}
              onClick={() => onSelectPet(pet.id)}
            />
          ))}
          <AddPetCard onClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPetSubmit}
      />
    </>
  );
};

export default PetSelector;
