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
  file: File;
}

export class VerificationApiService {
  // Voice Phone OTP
  async sendOTP(userId: number): Promise<OTPResponse> {
    return apiClient.post('/api/otp/send-phone', { user_id: userId });
  }

  async confirmOTP(userId: number, otp: string): Promise<OTPResponse> {
    return apiClient.post('/api/otp/verify-phone', { user_id: userId, otp });
  }

  // Compliance Document Upload
  async uploadComplianceDocument(document: ComplianceDocument): Promise<{ message: string; document_url: string }> {
    const formData = new FormData();
    formData.append('document', document.file);
    formData.append('type', document.type);
    return apiClient.uploadFile('/api/vendor/compliance/upload-document', formData);
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
