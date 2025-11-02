
export type PetType = 'dog' | 'cat' | 'rabbit';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  avatar: string;
}

export enum Emotion {
  Happy = 'Happy',
  Playful = 'Playful',
  Anxious = 'Anxious',
  Relaxed = 'Relaxed',
  Hungry = 'Hungry',
}

export type EmotionScores = {
  [key in Emotion]: number;
};

export interface AnalysisResult {
  id: string;
  petId: string;
  timestamp: Date;
  mode: AnalysisMode;
  dominantEmotion: Emotion;
  scores: EmotionScores;
}

export enum AnalysisMode {
  Sound = 'Sound',
  Movement = 'Movement',
  Combined = 'Combined',
}
