export type Emotion = 'happy' | 'sad' | 'neutral' | 'angry' | 'surprised' | 'fearful' | 'disgusted';

export interface EmotionDetection {
  emotion: Emotion;
  confidence: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  genre: string;
  moodMatch: number;
}

export interface UserPreferences {
  favoriteGenres: string[];
  moodBoost: boolean;
  language: string;
}