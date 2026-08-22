const API_BASE_URL = '';

import type { Report, ReportFormData, MatchResult, MatchListResponse, ClaimResponse, ClaimVerifyResponse } from './types';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  
  return res.json();
}

export const api = {
  createReport: async (data: ReportFormData): Promise<{ report: Report; matches: MatchResult[] }> => {
    return await fetchApi<{ report: Report; matches: MatchResult[] }>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getReports: async (filters?: Record<string, string>): Promise<Report[]> => {
    const params = new URLSearchParams(filters || {});
    return await fetchApi<Report[]>(`/api/reports?${params.toString()}`);
  },

  getReport: async (id: string): Promise<Report> => {
    return await fetchApi<Report>(`/api/reports/${id}`);
  },

  updateReportStatus: async (id: string, status: string): Promise<Report> => {
    return await fetchApi<Report>(`/api/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getMatches: async (reportId: string): Promise<MatchListResponse> => {
    return await fetchApi<MatchListResponse>(`/api/matches/report/${reportId}`);
  },

  createClaim: async (matchId: string, data: { claimer_name: string; claimer_email: string }): Promise<ClaimResponse> => {
    return await fetchApi<ClaimResponse>(`/api/claims/match/${matchId}`, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  },

  verifyClaim: async (claimId: string, answer: string): Promise<ClaimVerifyResponse> => {
    return await fetchApi<ClaimVerifyResponse>(`/api/claims/${claimId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ answer })
    });
  },
    
  getStats: async (): Promise<{ open_reports: number; total_matches: number }> => {
    return await fetchApi<{ open_reports: number; total_matches: number }>('/api/stats');
  }
};
