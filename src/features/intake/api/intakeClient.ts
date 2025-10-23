import { apiFetch } from '../../../api/http';

export async function startSession(story_text: string, mode: 'quick'|'full' = 'quick') {
  return apiFetch<{ session_id: string; next: string }>('/api/intake/session.start', {
    method: 'POST',
    body: JSON.stringify({ story_text, mode })
  });
}

export async function getQuestions(session_id: string) {
  const params = new URLSearchParams({ session_id });
  return apiFetch<{ questions: any[] }>(`/api/intake/questions?${params.toString()}`);
}

export async function answer(session_id: string, question_id: string, choice: 'left'|'right'|'neither', intensity: number) {
  return apiFetch<{ ok: true }>('/api/intake/answer', {
    method: 'POST',
    body: JSON.stringify({ session_id, question_id, choice, intensity })
  });
}

export async function complete(session_id: string) {
  return apiFetch<{ profile: any }>('/api/intake/complete', {
    method: 'POST',
    body: JSON.stringify({ session_id })
  });
}

