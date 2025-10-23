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

export async function generateWIMTS(
  session_id: string | null, 
  intake_text: string, 
  profile: any,
  recipient_id?: string // NEW: Optional recipient ID
): Promise<WIMTSGenerateResponse> {
  const payload: any = { intake_text, profile };
  if (session_id) {
    payload.session_id = session_id;
  }
  if (recipient_id) {
    payload.recipient_id = recipient_id;
  }
  
  return apiFetch<WIMTSGenerateResponse>('/api/wimts/generate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function selectWIMTS(session_id: string | null, wimts_session_id: string | null, option_id: string) {
  const payload: any = { option_id };
  if (session_id) {
    payload.session_id = session_id;
  }
  if (wimts_session_id) {
    payload.wimts_session_id = wimts_session_id;
  }
  
  return apiFetch<{ chosen_option_id: string }>('/api/wimts/select', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

