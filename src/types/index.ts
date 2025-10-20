// Core Types
export interface User {
  id: string;
  name: string;
  profileComplete: boolean;
  personalityProfile: PersonalityProfile;
  relationships: Relationship[];
  createdAt: Date;
}

export interface PersonalityProfile {
  buckets: PersonalityBuckets;
  fears: string[];
  longings: string[];
  copingMechanisms: string[];
  tonePreference: TonePreference;
  processingLens: ProcessingLens;
}

export interface PersonalityBuckets {
  feeling: number;
  sensing: number;
  intuition: number;
  thinking: number;
}

export type TonePreference = 'poetic' | 'blunt' | 'tender' | 'analytical' | 'playful';
export type ProcessingLens = 'feeling' | 'sensing' | 'intuition' | 'thinking';

export interface Relationship {
  id: string;
  name: string;
  relationshipType: string;
  emotionalCloseness: number;
  affectionLevel: number;
  context: string;
  inferredProfile?: PersonalityProfile;
}

// Translation Types
export interface TranslationRequest {
  originalText: string;
  context?: string;
  targetPersonality?: PersonalityProfile;
}

export interface TranslationCandidate {
  id: string;
  text: string;
  layer: TranslationLayer;
  confidence: number;
}

export type TranslationLayer = 'emotion' | 'fear' | 'longing' | 'poetic' | 'appreciation';

// Quiz Types
export interface QuizQuestion {
  id: string;
  text: string;
  variants: string[];
  answers: QuizAnswer[];
  type: QuestionType;
  group?: string;
}

export interface QuizAnswer {
  id: string;
  text: string;
  direction?: SwipeDirection;
  // bucketWeights removed - not used by backend AI generation
}

export type QuestionType = 'swipe' | 'multiChoice' | 'slider';
export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | 'up-left' | 'up-right';

export interface QuizSession {
  id: string;
  userId?: string;
  quizType: 'quick' | 'deep';
  currentQuestionIndex: number;
  answers: QuizSessionAnswer[];
  completed: boolean;
  results?: PersonalityProfile;
}

export interface QuizSessionAnswer {
  questionId: string;
  answerId: string;
  timestamp: Date;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface QuizTemplate {
  id: string;
  name: string;
  type: 'quick' | 'deep';
  questions: QuizQuestion[];
  scoringFormula: ScoringFormula;
  version: number;
  published: boolean;
}

export interface ScoringFormula {
  aggregationMethod: 'sum' | 'average' | 'weighted';
  normalization: boolean;
  topKLogic: number;
  tieBreaking: 'random' | 'first' | 'highest';
}

// UI Types
export interface SwipeGesture {
  direction: SwipeDirection;
  velocity: number;
  distance: number;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}
