import { apiFetch } from '../../../api/http';

export type Contact = { id: string; name: string; role?: string; relationship_type?: string };

export async function listContacts() {
  return apiFetch<Contact[]>('/api/contacts');
}

export async function getContact(id: string) {
  return apiFetch<any>(`/api/contacts/${id}`);
}

export async function createContact(name: string, role?: string, relationship_type?: string) {
  return apiFetch<{ contact_id: string }>(`/api/contacts`, { method: 'POST', body: JSON.stringify({ name, role, relationship_type }) });
}

export async function updateSliders(id: string, sliders: Partial<{ directness: number; formality: number; warmth: number; support: number; humor: number; teasing: number }>) {
  return apiFetch<{ ok: true }>(`/api/contacts/${id}/sliders`, { method: 'POST', body: JSON.stringify(sliders) });
}

