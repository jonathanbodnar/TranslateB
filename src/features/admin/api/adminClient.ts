import { apiFetch } from '../../../api/http';

export async function getConfig() {
  return apiFetch<{ current: any | null }>('/api/admin/config');
}

export async function putConfig(payload: any, config_id?: string, notes?: string) {
  return apiFetch<{ config_id: string; status: 'draft' }>(
    '/api/admin/config',
    {
      method: 'PUT',
      body: JSON.stringify({ payload, config_id, notes })
    }
  );
}

export async function publishConfig(config_id: string) {
  return apiFetch<{ ok: true }>('/api/admin/config/publish', {
    method: 'POST',
    body: JSON.stringify({ config_id })
  });
}

export async function listVersions() {
  return apiFetch<Array<{ config_id: string; status: string; author_user_id: string | null; created_at: string }>>('/api/admin/versions');
}

export async function getVersion(config_id: string) {
  return apiFetch<any>(`/api/admin/versions/${config_id}`);
}

