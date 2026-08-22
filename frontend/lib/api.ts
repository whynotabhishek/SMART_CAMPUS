import { API_BASE_URL } from './constants';
import type { Report, ReportFormData, MatchResult, MatchListResponse, ClaimResponse, ClaimVerifyResponse } from './types';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  createReport: (data: ReportFormData): Promise<{ report: Report; matches: MatchResult[] }> => 
    fetchApi<{ report: Report; matches: MatchResult[] }>('/api/reports', { method: 'POST', body: JSON.stringify(data) }),
    
  getReports: (filters?: Record<string, string>): Promise<Report[]> => {
    const qs = filters ? new URLSearchParams(filters).toString() : '';
    return fetchApi<Report[]>(`/api/reports${qs ? `?${qs}` : ''}`);
  },
  
  getReport: (id: string): Promise<Report> => 
    fetchApi<Report>(`/api/reports/${id}`),
    
  getMatches: (reportId: string): Promise<MatchListResponse> => 
    fetchApi<MatchListResponse>(`/api/matches/report/${reportId}`),
    
  createClaim: (matchId: string, data: { claimer_name: string; claimer_email: string }): Promise<ClaimResponse> => 
    fetchApi<ClaimResponse>(`/api/claims/match/${matchId}`, { method: 'POST', body: JSON.stringify(data) }),
    
  verifyClaim: (claimId: string, answer: string): Promise<ClaimVerifyResponse> => 
    fetchApi<ClaimVerifyResponse>(`/api/claims/${claimId}/verify`, { method: 'POST', body: JSON.stringify({ answer }) }),
    
  getStats: (): Promise<{ open_reports: number; total_matches: number }> => 
    fetchApi<{ open_reports: number; total_matches: number }>('/api/stats'),
};
