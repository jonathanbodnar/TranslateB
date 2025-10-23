import { apiFetch } from '../../../api/http';
import {
  AdminConfig,
  ConfigPayload,
  UpdateConfigResponse,
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '../types';

/**
 * Admin API Client
 * Functions for interacting with admin panel backend
 */

/**
 * Fetch the current admin configuration
 * Requires admin role
 */
export async function getConfig(): Promise<AdminConfig> {
  return apiFetch<AdminConfig>('/api/admin/config');
}

/**
 * Update the admin configuration
 * Requires admin role
 * @param payload - The new configuration payload
 * @param notes - Optional notes about the changes
 * @returns Updated config with validation errors if any
 */
export async function updateConfig(
  payload: ConfigPayload,
  notes?: string
): Promise<UpdateConfigResponse> {
  return apiFetch<UpdateConfigResponse>('/api/admin/config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ payload, notes }),
  });
}

/**
 * Question Management APIs
 */

/**
 * Get all questions
 */
export async function getQuestions(): Promise<{ questions: Question[]; total: number }> {
  return apiFetch<{ questions: Question[]; total: number }>('/api/admin/questions');
}

/**
 * Create a new question
 */
export async function createQuestion(
  data: CreateQuestionRequest
): Promise<{ question: Question; message: string }> {
  return apiFetch<{ question: Question; message: string }>('/api/admin/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing question
 */
export async function updateQuestion(
  id: string,
  data: UpdateQuestionRequest
): Promise<{ question: Question; message: string }> {
  return apiFetch<{ question: Question; message: string }>(`/api/admin/questions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Delete a question
 */
export async function deleteQuestion(id: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/api/admin/questions/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Toggle question active status
 */
export async function toggleQuestion(
  id: string
): Promise<{ question: Question; is_active: boolean; message: string }> {
  return apiFetch<{ question: Question; is_active: boolean; message: string }>(
    `/api/admin/questions/${id}/toggle`,
    {
      method: 'PUT',
    }
  );
}
