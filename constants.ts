
import { Emotion, PetType } from './types';

export const PET_AVATARS: Record<PetType, string[]> = {
  dog: ['🐶', '🐕', '🦮', '🐩'],
  cat: ['🐱', '🐈', '🐈‍⬛', '🐅'],
  rabbit: ['🐰', '🐇', '🐹'],
};

export const EMOTION_COLORS: Record<Emotion, string> = {
  [Emotion.Happy]: 'text-green-500',
  [Emotion.Playful]: 'text-yellow-500',
  [Emotion.Anxious]: 'text-red-500',
  [Emotion.Relaxed]: 'text-blue-500',
  [Emotion.Hungry]: 'text-orange-500',
};

export const EMOTION_BGS: Record<Emotion, string> = {
  [Emotion.Happy]: 'bg-green-500',
  [Emotion.Playful]: 'bg-yellow-500',
  [Emotion.Anxious]: 'bg-red-500',
  [Emotion.Relaxed]: 'bg-blue-500',
  [Emotion.Hungry]: 'bg-orange-500',
};
