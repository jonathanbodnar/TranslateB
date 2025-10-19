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

export async function generateWIMTS(session_id: string, intake_text: string, profile: any): Promise<WIMTSGenerateResponse> {
  // Generate a temporary UUID for custom inputs when no session_id is provided
  const effectiveSessionId = session_id || crypto.randomUUID();
  
  return apiFetch<WIMTSGenerateResponse>('/api/wimts/generate', {
    method: 'POST',
    body: JSON.stringify({ session_id: effectiveSessionId, intake_text, profile })
  });
}

export async function selectWIMTS(session_id: string, wimts_session_id: string | null, option_id: string) {
  return apiFetch<{ chosen_option_id: string }>('/api/wimts/select', {
    method: 'POST',
    body: JSON.stringify({ session_id, wimts_session_id, option_id })
  });
}

