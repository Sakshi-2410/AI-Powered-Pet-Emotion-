
import React, { useState } from 'react';
import { Pet, PetType } from '../types';
import { PET_AVATARS } from '../constants';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pet: Omit<Pet, 'id'>) => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<PetType>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(1);
  const [avatar, setAvatar] = useState(PET_AVATARS.dog[0]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as PetType;
    setType(newType);
    setAvatar(PET_AVATARS[newType][0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || age <= 0) return;
    onSubmit({ name, type, breed, age, avatar });
    // Reset form
    setName('');
    setType('dog');
    setBreed('');
    setAge(1);
    setAvatar(PET_AVATARS.dog[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-pet-lightest rounded-2xl shadow-2xl p-8 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-pet-darkest mb-6">Create Paws-ome Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-pet-darkest">Pet's Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pet-medium focus:border-pet-medium" />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-pet-darkest">Pet Type</label>
              <select id="type" value={type} onChange={handleTypeChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pet-medium focus:border-pet-medium sm:text-sm rounded-md">
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="rabbit">Rabbit</option>
              </select>
            </div>
            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-pet-darkest">Breed</label>
              <input type="text" id="breed" value={breed} onChange={e => setBreed(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pet-medium focus:border-pet-medium" />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-pet-darkest">Age (years)</label>
              <input type="number" id="age" value={age} onChange={e => setAge(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pet-medium focus:border-pet-medium" />
            </div>
            <div>
                <label className="block text-sm font-medium text-pet-darkest">Avatar</label>
                <div className="mt-2 flex space-x-2">
                    {PET_AVATARS[type].map(av => (
                        <button key={av} type="button" onClick={() => setAvatar(av)} className={`text-4xl p-2 rounded-full transition-transform transform hover:scale-110 ${avatar === av ? 'bg-pet-light' : 'bg-transparent'}`}>
                            {av}
                        </button>
                    ))}
                </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-pet-medium rounded-full hover:bg-pet-dark shadow-md">Add Pet</button>
          </div>
        </form>
      </div>
    </div>
  );
};
