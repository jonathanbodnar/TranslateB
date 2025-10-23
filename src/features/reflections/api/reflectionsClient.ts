import { apiFetch } from '../../../api/http';

export async function createReflection(body: {
  base_intake_text: string;
  wimts_option_id: string;
  translation_mode: '4'|'8';
  chosen_translation_key: string;
  translation_text: string;
  recipient_id?: string;
}) {
  return apiFetch<{ reflection_id: string }>('/api/reflections', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

