import { apiFetch } from '../../../api/http';

export interface WIMTSOption {
  option_id: string;
  title: string;
  body: string;
}

export interface WIMTSGenerateResponse {
  what_i_meant_variants: WIMTSOption[];
  wimts_session_id: string | null;
}

export async function generateWIMTS(session_id: string | null, intake_text: string, profile: any): Promise<WIMTSGenerateResponse> {
  return apiFetch<WIMTSGenerateResponse>('/api/wimts/generate', {
    method: 'POST',
    body: JSON.stringify({ session_id: session_id || null, intake_text, profile })
  });
}

export async function selectWIMTS(session_id: string | null, wimts_session_id: string | null, option_id: string) {
  return apiFetch<{ chosen_option_id: string }>('/api/wimts/select', {
    method: 'POST',
    body: JSON.stringify({ session_id: session_id || null, wimts_session_id, option_id })
  });
}

