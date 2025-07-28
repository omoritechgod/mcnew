import { apiClient } from './apiClient';
import { ENDPOINTS } from './config';

// Maintenance types
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

export class MaintenanceApiService {
  // Submit maintenance request
  async submitMaintenanceRequest(request: MaintenanceRequest): Promise<{ 
    message: string; 
    data: MaintenanceRequestResponse 
  }> {
    return apiClient.post(ENDPOINTS.MAINTENANCE_REQUEST, request);
  }

  // Get user's maintenance history
  async fetchMaintenanceHistory(): Promise<{ requests: MaintenanceRequestResponse[] }> {
    return apiClient.get(ENDPOINTS.MAINTENANCE_HISTORY);
  }
}

export const maintenanceApi = new MaintenanceApiService();