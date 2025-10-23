import { apiFetch } from '../../../api/http';

export interface QuizCard {
  cardNumber: number;
  cardType: 'reflexes' | 'frustrations' | 'fears' | 'hopes' | 'derails' | 'conditional';
  question: string;
  inputType: 'text' | 'multi_select' | 'single_select' | 'slider';
  options?: string[];
  placeholder?: string;
  sliderLabels?: { min: string; max: string };
}

export interface QuizResponse {
  cardNumber: number;
  cardType: string;
  question: string;
  inputType: string;
  answer: any;
}

export interface QuizAnalysis {
  communicationStyle: {
    directness: number;
    formality: number;
    warmth: number;
    supportMode: number;
    humor: number;
    teasing: number;
    metaCommunication: number;
    boundaryStrength: number;
    structureVsStory: number;
    validationVsSolutioning: number;
    encouragementVsChallenge: number;
    detailDepth: number;
    concreteVsAbstract: number;
    questionDensity: number;
    complimentRequestRatio: number;
  };
  keyInsights: string[];
  patterns: string[];
  suggestions: string[];
}

export interface GetQuizResponse {
  completed: boolean;
  cards?: QuizCard[];
  responses?: QuizResponse[];
}

export interface SubmitQuizResponse {
  success: boolean;
  analysis: QuizAnalysis;
  conditionalCard: QuizCard | null;
}

/**
 * Get quiz for a specific contact
 */
export async function getQuiz(contactId: string): Promise<GetQuizResponse> {
  const response = await apiFetch(`/api/relationships/quiz/${contactId}`);
  return response as GetQuizResponse;
}

/**
 * Submit quiz responses
 */
export async function submitQuiz(
  contactId: string,
  responses: QuizResponse[]
): Promise<SubmitQuizResponse> {
  const response = await apiFetch(`/api/relationships/quiz/${contactId}`, {
    method: 'POST',
    body: JSON.stringify({ responses }),
  });
  return response as SubmitQuizResponse;
}

