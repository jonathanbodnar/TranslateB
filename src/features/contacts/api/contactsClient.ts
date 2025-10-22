import { apiFetch } from '../../../api/http';

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  role?: string;
  relationship_type?: string;
  created_at: string;
}

export interface ContactSliders {
  contact_id: string;
  // Core sliders (6)
  directness?: number;
  formality?: number;
  warmth?: number;
  support?: number;
  humor?: number;
  teasing?: number;
  // Advanced sliders (9)
  listening_style?: number;
  response_timing?: number;
  emotional_expression?: number;
  problem_depth?: number;
  accountability?: number;
  reassurance_level?: number;
  conversation_initiation?: number;
  vulnerability?: number;
  feedback_style?: number;
}

export interface CreateContactRequest {
  name: string;
  role?: string;
  relationship_type?: string;
}

export interface UpdateSlidersRequest {
  // Core sliders (6)
  directness?: number;
  formality?: number;
  warmth?: number;
  support?: number;
  humor?: number;
  teasing?: number;
  // Advanced sliders (9)
  listening_style?: number;
  response_timing?: number;
  emotional_expression?: number;
  problem_depth?: number;
  accountability?: number;
  reassurance_level?: number;
  conversation_initiation?: number;
  vulnerability?: number;
  feedback_style?: number;
}

// List all contacts
export async function getContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>('/api/contacts', {
    method: 'GET'
  });
}

// Create new contact
export async function createContact(data: CreateContactRequest): Promise<{ contact_id: string }> {
  return apiFetch<{ contact_id: string }>('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Get contact sliders
export async function getContactSliders(contactId: string): Promise<ContactSliders> {
  return apiFetch<ContactSliders>(`/api/contacts/${contactId}/sliders`, {
    method: 'GET'
  });
}

// Update contact sliders
export async function updateContactSliders(
  contactId: string, 
  sliders: UpdateSlidersRequest
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/contacts/${contactId}/sliders`, {
    method: 'PUT',
    body: JSON.stringify(sliders)
  });
}

// Update contact details
export async function updateContact(
  contactId: string,
  data: { name?: string; role?: string; relationship_type?: string }
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Delete contact
export async function deleteContact(contactId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/contacts/${contactId}`, {
    method: 'DELETE'
  });
}
