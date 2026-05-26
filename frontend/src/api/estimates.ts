import { postJson } from './http';
import type { ApiResponse, BacklogResult } from '../domain/types';

export async function createEstimate(ideaDescription: string) {
  return postJson<ApiResponse<BacklogResult>>('/api/estimates', { ideaDescription }, { timeoutMs: 65000 });
}

