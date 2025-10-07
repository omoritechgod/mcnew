import { apiClient } from './apiClient';

export interface OTPResponse {
  message: string;
  success?: boolean;
}

export interface ComplianceStatus {
  phone_verified: boolean;
  phone_verified_at: string | null;
  document_uploaded: boolean;
  document_type: 'nin' | 'cac' | null;
  compliance_status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
}

export interface ComplianceDocument {
  type: 'nin' | 'cac';
  document_url: string;
}

export class VerificationApiService {
  // Voice Phone OTP
  async sendOTP(userId: number): Promise<OTPResponse> {
    return apiClient.post('/api/otp/send-phone', { user_id: userId });
  }

  async confirmOTP(userId: number, otp: string): Promise<OTPResponse> {
    return apiClient.post('/api/otp/verify-phone', { user_id: userId, otp });
  }

  // Compliance Document Upload - Updated to send document URL
  async uploadComplianceDocument(document: ComplianceDocument): Promise<{ message: string; document_url: string }> {
    const payload = {
      type: document.type,
      document_url: document.document_url
    };
    
    return apiClient.post('/api/vendor/compliance/upload-document', payload);
  }

  // Submit for Review
  async submitForReview(): Promise<{ message: string }> {
    return apiClient.post('/api/vendor/compliance/submit-review', {});
  }

  // Get Compliance Status
  async getComplianceStatus(): Promise<ComplianceStatus> {
    return apiClient.get('/api/vendor/compliance/status');
  }
}

export const verificationApi = new VerificationApiService();