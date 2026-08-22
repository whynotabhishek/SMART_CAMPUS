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

import { MOCK_REPORTS, MOCK_MATCHES } from './mockData';

export const api = {
  createReport: async (data: ReportFormData): Promise<{ report: Report; matches: MatchResult[] }> => {
    try {
      return await fetchApi<{ report: Report; matches: MatchResult[] }>('/api/reports', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      console.warn("Using mock data for createReport due to API error:", e);
      const newReport: Report = {
        id: `mock-${Date.now()}`,
        ...data,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      MOCK_REPORTS.unshift(newReport);
      return { report: newReport, matches: [] };
    }
  },
    
  getReports: async (filters?: Record<string, string>): Promise<Report[]> => {
    try {
      const qs = filters ? new URLSearchParams(filters).toString() : '';
      return await fetchApi<Report[]>(`/api/reports${qs ? `?${qs}` : ''}`);
    } catch (e) {
      console.warn("Using mock data for getReports due to API error:", e);
      let filtered = [...MOCK_REPORTS];
      if (filters?.type) filtered = filtered.filter(r => r.type === filters.type);
      if (filters?.category) filtered = filtered.filter(r => r.category === filters.category);
      if (filters?.location_zone) filtered = filtered.filter(r => r.location_zone === filters.location_zone);
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(r => r.title.toLowerCase().includes(search) || r.description.toLowerCase().includes(search));
      }
      return filtered;
    }
  },
  
  getReport: async (id: string): Promise<Report> => {
    try {
      return await fetchApi<Report>(`/api/reports/${id}`);
    } catch (e) {
      console.warn("Using mock data for getReport due to API error:", e);
      const report = MOCK_REPORTS.find(r => r.id === id);
      if (!report) throw new Error("Report not found");
      return report;
    }
  },
    
  getMatches: async (reportId: string): Promise<MatchListResponse> => {
    try {
      return await fetchApi<MatchListResponse>(`/api/matches/report/${reportId}`);
    } catch (e) {
      console.warn("Using mock data for getMatches due to API error:", e);
      return { report_id: reportId, matches: MOCK_MATCHES[reportId] || [] };
    }
  },
    
  createClaim: async (matchId: string, data: { claimer_name: string; claimer_email: string }): Promise<ClaimResponse> => {
    try {
      return await fetchApi<ClaimResponse>(`/api/claims/match/${matchId}`, { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      console.warn("Using mock data for createClaim due to API error:", e);
      return { claim_id: `claim-${Date.now()}`, verification_question: "What brand is the item?" };
    }
  },
    
  verifyClaim: async (claimId: string, answer: string): Promise<ClaimVerifyResponse> => {
    try {
      return await fetchApi<ClaimVerifyResponse>(`/api/claims/${claimId}/verify`, { method: 'POST', body: JSON.stringify({ answer }) });
    } catch (e) {
      console.warn("Using mock data for verifyClaim due to API error:", e);
      if (answer.length > 3) {
        return { status: "verified", contact_info: { name: "Mock User", email: "mock@example.com" } };
      }
      return { status: "rejected" };
    }
  },
    
  getStats: async (): Promise<{ open_reports: number; total_matches: number }> => {
    try {
      return await fetchApi<{ open_reports: number; total_matches: number }>('/api/stats');
    } catch (e) {
      console.warn("Using mock data for getStats due to API error:", e);
      return { open_reports: MOCK_REPORTS.length, total_matches: Object.values(MOCK_MATCHES).flat().length / 2 };
    }
  },
};
