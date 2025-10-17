import { apiFetch } from '../../../api/http';

export async function getProfile(userId: string) {
  return apiFetch<{ user_id: string; cognitive_snapshot: any; fear_snapshot: any; insights_snapshot: any; metadata: any }>(`/api/profile/${userId}`);
}

