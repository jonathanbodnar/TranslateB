import { apiFetch } from '../../../api/http';

export async function generateTranslations(base_text: string, mode: '4'|'8', persona_hints?: any, frictions_top?: string[]) {
  return apiFetch<{ mode: string; translations: Record<string, string> }>('/api/translate/generate', {
    method: 'POST',
    body: JSON.stringify({ base_text, mode, persona_hints, frictions_top })
  });
}

