import { apiFetch } from '../../../api/http';

export interface TranslationResponse {
  mode: string;
  translations: Record<string, string>;
  recipient?: {
    id: string;
    name: string;
    relationship_type?: string;
  } | null;
}

export async function generateTranslations(
  base_text: string,
  mode: '4' | '8',
  recipient_id?: string, // NEW: Optional recipient ID
  persona_hints?: any,
  frictions_top?: string[]
): Promise<TranslationResponse> {
  return apiFetch<TranslationResponse>('/api/translate/generate', {
    method: 'POST',
    body: JSON.stringify({ 
      base_text, 
      mode, 
      recipient_id, // NEW
      persona_hints, 
      frictions_top 
    })
  });
}

