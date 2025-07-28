import { apiClient, ApiResponse } from './api';

// User-related types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: 'user' | 'vendor';
  profile_image?: string;
  vendor?: {
    id: number;
    category: string;
    business_name: string;
    vendor_type: string;
    verification_status: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  user_type: 'user' | 'vendor';
}

export interface MaintenanceRequest {
  location: string;
  service_type: string;
  issue: string;
  needs_towing: boolean;
}

export interface MaintenanceRequestResponse {
  id: number;
  user_id: number;
  location: string;
  service_type: string;
  issue: string;
  needs_towing: boolean;
  status: string;
  mechanic_id?: number;
  accepted_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// User API service
export class UserApiService {
  // Authentication
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User; vendor?: any }> {
    return apiClient.post('/api/login', credentials, false);
  }

  async register(data: RegisterData): Promise<ApiResponse> {
    return apiClient.post('/api/register', data, false);
  }

  async logout(): Promise<ApiResponse> {
    return apiClient.post('/api/logout');
  }

  // User profile
  async getProfile(): Promise<{ user: User; vendor?: any }> {
    return apiClient.get('/api/me');
  }

  async updateProfileImage(imageFile: File): Promise<{ profile_image_url: string }> {
    const formData = new FormData();
    formData.append('profile_image', imageFile);
    return apiClient.uploadFile('/api/profile/update-image', formData);
  }

  // Maintenance requests
  async submitMaintenanceRequest(request: MaintenanceRequest): Promise<{ message: string; data: MaintenanceRequestResponse }> {
    return apiClient.post('/api/maintenance/request', request);
  }

  async getMaintenanceRequests(): Promise<{ requests: MaintenanceRequestResponse[] }> {
    return apiClient.get('/api/maintenance/my-requests');
  }

  // Dashboard summary (placeholder for future implementation)
  async getDashboardSummary(): Promise<any> {
    return apiClient.get('/api/dashboard/summary');
  }

  // Error logging
  async logError(errorData: {
    context: string;
    message: string;
    stack?: string;
    url?: string;
    extra?: any;
  }): Promise<void> {
    try {
      await apiClient.post('/log-error', errorData, false);
    } catch (error) {
      console.warn('Failed to log error to backend:', error);
    }
  }
}

// Create and export service instance
export const userApi = new UserApiService();