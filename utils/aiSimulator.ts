
import { AnalysisMode, Emotion, EmotionScores } from '../types';

// Helper to get a random number in a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generates a set of scores that sum to 1
const generateScores = (): EmotionScores => {
  const scores: Partial<EmotionScores> = {};
  let total = 0;
  
  // Assign random initial values
  for (const emotion in Emotion) {
    const value = random(0.1, 1);
    scores[emotion as Emotion] = value;
    total += value;
  }
  
  // Normalize scores to sum to 1
  const normalizedScores: Partial<EmotionScores> = {};
  for (const emotion in scores) {
    normalizedScores[emotion as Emotion] = scores[emotion as Emotion]! / total;
  }
  
  return normalizedScores as EmotionScores;
};

export const simulateEmotionAnalysis = (mode: AnalysisMode): Promise<{ scores: EmotionScores; dominantEmotion: Emotion }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const scores = generateScores();
      
      // Find the dominant emotion
      let dominantEmotion: Emotion = Emotion.Relaxed;
      let maxScore = 0;
      
      for (const entry of Object.entries(scores)) {
        const [emotion, score] = entry as [Emotion, number];
        if (score > maxScore) {
          maxScore = score;
          dominantEmotion = emotion;
        }
      }

      resolve({ scores, dominantEmotion });

    }, random(1500, 3000)); // Simulate network and processing delay
  });
};
