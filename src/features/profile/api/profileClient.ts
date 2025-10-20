import { apiFetch } from '../../../api/http';
import { ProfileSnapshot } from '../types';

/**
 * Fetch user's AI-generated profile snapshot
 */
export async function getProfile(userId: string): Promise<ProfileSnapshot> {
  return apiFetch<ProfileSnapshot>(`/api/profile/${userId}`);
}

/**
 * Toggle like/unlike on an insight
 */
export async function likeInsight(insightId: string): Promise<{ liked: boolean; insight_id: string }> {
  return apiFetch<{ liked: boolean; insight_id: string }>('/api/insights/like', {
    method: 'POST',
    body: JSON.stringify({ insight_id: insightId })
  });
}
