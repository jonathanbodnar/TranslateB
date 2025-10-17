import { apiFetch } from '../../../api/http';

export async function generateWIMTS(session_id: string, intake_text: string, profile: any) {
  return apiFetch<{ what_i_meant_variants: { option_id: string; title: string; body: string }[] }>('/api/wimts/generate', {
    method: 'POST',
    body: JSON.stringify({ session_id, intake_text, profile })
  });
}

export async function selectWIMTS(session_id: string, option_id: string) {
  return apiFetch<{ chosen_option_id: string }>('/api/wimts/select', {
    method: 'POST',
    body: JSON.stringify({ session_id, option_id })
  });
}

