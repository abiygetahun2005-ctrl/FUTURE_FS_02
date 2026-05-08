const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.text();
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ user: { id: string; email: string }; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string) {
    return this.request<{ user: { id: string; email: string }; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: { id: string; email: string } }>('/auth/me');
  }

  // Lead methods
  async getLeads() {
    return this.request<Lead[]>('/leads');
  }

  async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'user'>) {
    return this.request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }

  async updateLead(id: number, updates: Partial<Lead>) {
    return this.request<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteLead(id: number) {
    return this.request<{ message: string }>(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  async getLeadNotes(leadId: number) {
    return this.request<LeadNote[]>(`/leads/${leadId}/notes`);
  }

  async addLeadNote(leadId: number, note: Omit<LeadNote, 'id' | 'createdAt' | 'lead' | 'user'>) {
    return this.request<LeadNote>(`/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async deleteLeadNote(leadId: number, noteId: number) {
    return this.request<{ message: string }>(`/leads/${leadId}/notes/${noteId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  createdAt: string;
  updatedAt: string;
  user: number;
}

export interface LeadNote {
  id: number;
  lead: number;
  note: string;
  followUpDate?: string;
  createdAt: string;
  user: number;
}