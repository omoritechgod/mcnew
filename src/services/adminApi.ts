// src/services/adminApi.ts
import { ApiResponse } from './api';
import { ENDPOINTS } from './config';

const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'https://mdoilandgas.com/mcdee/backend/public';

class AdminApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const adminToken = localStorage.getItem('adminToken'); // ✅ ensure this matches where you store it
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
  export interface LiveVendor {
    id: number;
    business_name: string;
    vendor_type: string;
    category: string;
    is_verified: boolean;
    verification_status: string;
    created_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      email_verified_at: string | null;
    };
  }


// Types for dashboard and admin
export interface DashboardStats {
  total_users: number;
  total_vendors: number;
  pending_kyc: number;
  approved_vendors: number;
  rejected_vendors: number;
  active_vendors: number;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export class AdminApiService {
  private client: AdminApiClient;

  constructor() {
    this.client = new AdminApiClient(ADMIN_BASE_URL);
  }

  // Auth
  async login(credentials: { email: string; password: string }): Promise<{ token: string; admin: Admin }> {
    return this.client.post(ENDPOINTS.ADMIN_LOGIN, credentials);
  }

  async logout(): Promise<ApiResponse> {
    return this.client.post(ENDPOINTS.ADMIN_LOGOUT);
  }

  async me(): Promise<Admin> {
    return this.client.get(ENDPOINTS.ADMIN_ME);
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{ data: DashboardStats }> {
    return this.client.get(ENDPOINTS.ADMIN_DASHBOARD);
  }

  // Other admin actions
  async getUsers(): Promise<any> {
    return this.client.get('/api/admin/users');
  }

  async getVendors(): Promise<any> {
    return this.client.get(ENDPOINTS.ADMIN_VENDORS);
  }

  async verifyVendor(vendorId: number): Promise<ApiResponse> {
    return this.client.post(`${ENDPOINTS.ADMIN_VENDORS}/${vendorId}/verify`);
  }

  async rejectVendor(vendorId: number, reason: string): Promise<ApiResponse> {
    return this.client.post(`${ENDPOINTS.ADMIN_VENDORS}/${vendorId}/reject`, { reason });
  }

  async getAnalytics(): Promise<any> {
    return this.client.get('/api/admin/analytics');
  }

  async getSettings(): Promise<any> {
    return this.client.get('/api/admin/settings');
  }

  async updateSettings(settings: any): Promise<ApiResponse> {
    return this.client.put('/api/admin/settings', settings);
  }
  async getLiveVendors(): Promise<{ data: LiveVendor[] }> {
    return this.client.get(ENDPOINTS.ADMIN_VENDORS);
  }

  async getKYCVerifications(): Promise<{ data: KYCVerification[] }> {
    return this.client.get(ENDPOINTS.ADMIN_KYC_VERIFICATIONS);
  }

  async approveKYC(id: number): Promise<void> {
    const endpoint = ENDPOINTS.ADMIN_APPROVE_KYC.replace('{id}', id.toString());
    return this.client.post(endpoint);
  }

  async rejectKYC(id: number, reason: string): Promise<void> {
    const endpoint = ENDPOINTS.ADMIN_REJECT_KYC.replace('{id}', id.toString());
    return this.client.post(endpoint, { reason });
  }


}

// Add KYCVerification interface that was missing
export interface KYCVerification {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  vendor: {
    id: number;
    business_name: string;
    category: string;
  };
  document_type: 'nin' | 'cac';
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
}

// Export single instance
export const adminApi = new AdminApiService();
