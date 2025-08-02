import { apiClient } from './apiClient';
import { ENDPOINTS } from './config';

// Authentication types
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

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: 'user' | 'vendor';
  profile_image?: string;
  email_verified_at?: string | null;
  vendor?: {
    id: number;
    category: string;
    business_name: string;
    vendor_type: string;
    verification_status: string;
  };
}

export class AuthApiService {
  // Authentication
  async loginUser(credentials: LoginCredentials): Promise<{ token: string; user: User; vendor?: any }> {
    return apiClient.post(ENDPOINTS.LOGIN, credentials, false);
  }

  async registerUser(data: RegisterData): Promise<{ message: string; user?: User }> {
    return apiClient.post(ENDPOINTS.REGISTER, data, false);
  }

  async logout(): Promise<{ message: string }> {
    return apiClient.post(ENDPOINTS.LOGOUT);
  }

  // User profile
  async fetchCurrentUser(): Promise<{ user: User; vendor?: any }> {
    return apiClient.get(ENDPOINTS.ME);
  }

  async updateProfileImage(imageFile: File): Promise<{ message: string; profile_image_url: string }> {
    const formData = new FormData();
    formData.append('profile_picture', imageFile);
    return apiClient.uploadFile(ENDPOINTS.UPDATE_PROFILE_IMAGE, formData);
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

export const authApi = new AuthApiService();