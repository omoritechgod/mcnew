import { ApiResponse } from './api';

// Admin API configuration
const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'https://mdoilandgas.com/mcdee/backend/public';

// Admin API client (separate from regular API)
class AdminApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const adminToken = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
    };
  }

  async request<T = any>(endpoint: string, config: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const requestConfig: RequestInit = {
      ...config,
      headers: {
        ...this.getAuthHeaders(),
        ...config.headers,
      },
    };

    try {
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Admin API Error [${config.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Admin API service
export class AdminApiService {
  private client: AdminApiClient;

  constructor() {
    this.client = new AdminApiClient(ADMIN_BASE_URL);
  }

  // Admin authentication
  async login(credentials: { email: string; password: string }): Promise<{ token: string; admin: any }> {
    return this.client.post('/admin/login', credentials);
  }

  async logout(): Promise<ApiResponse> {
    return this.client.post('/admin/logout');
  }

  // Admin dashboard
  async getDashboard(): Promise<any> {
    return this.client.get('/admin/dashboard');
  }

  // User management
  async getUsers(): Promise<any> {
    return this.client.get('/admin/users');
  }

  async getVendors(): Promise<any> {
    return this.client.get('/admin/vendors');
  }

  // Vendor verification
  async verifyVendor(vendorId: number): Promise<ApiResponse> {
    return this.client.post(`/admin/vendors/${vendorId}/verify`);
  }

  async rejectVendor(vendorId: number, reason: string): Promise<ApiResponse> {
    return this.client.post(`/admin/vendors/${vendorId}/reject`, { reason });
  }

  // Platform analytics
  async getAnalytics(): Promise<any> {
    return this.client.get('/admin/analytics');
  }

  // System settings
  async getSettings(): Promise<any> {
    return this.client.get('/admin/settings');
  }

  async updateSettings(settings: any): Promise<ApiResponse> {
    return this.client.put('/admin/settings', settings);
  }
}

// Create and export service instance
export const adminApi = new AdminApiService();