import { apiClient } from './api';

const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'https://omoriapi.name.ng/mcdee/backend/public';

class AdminBookingApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const adminToken = localStorage.getItem('adminToken');
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
      console.error(`Admin Booking API Error [${config.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

const adminBookingClient = new AdminBookingApiClient(ADMIN_BASE_URL);

// Booking types based on your Laravel backend
export interface BookingRequest {
  listing_id: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  nights: number;
  total_price: number;
  notes?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  listing_id: number;
  vendor_id: number;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  guests: number;
  total_price: string;
  status: 'pending' | 'processing' | 'paid' | 'checked_in' | 'checked_out' | 'completed' | 'cancelled' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  listing?: {
    id: number;
    title: string;
    location: string;
    images: string[];
    type: string;
  };
  vendor?: {
    id: number;
    business_name: string;
    contact_phone?: string;
    contact_email?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface BookingResponse {
  message: string;
  data: Booking;
}

export interface BookingsListResponse {
  message: string;
  data: Booking[];
}

export interface PaymentRequest {
  booking_id: number;
  payment_method: 'paystack';
  return_url?: string;
}

export interface PaymentResponse {
  message: string;
  data: {
    payment_url: string;
    reference: string;
    booking_id: number;
  };
}

// -----------------
// User Booking API
// -----------------
export const bookingApi = {
  // Create a new booking request
  async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    return apiClient.post<BookingResponse>('/api/apartment/bookings', bookingData, true);
  },

  // Get user's bookings
  async getMyBookings(): Promise<BookingsListResponse> {
    return apiClient.get<BookingsListResponse>('/api/apartment/bookings/my', true);
  },

  // Get specific booking details (no route currently for `/bookings/{id}`, so skip if not implemented)
  // If needed, create backend route for single booking details
  // async getBookingById(id: number): Promise<BookingResponse> {
  //   return apiClient.get<BookingResponse>(`/apartment/bookings/${id}`, true);
  // },

  // Initiate payment for a booking
  async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    return apiClient.post<PaymentResponse>(`/api/bookings/${paymentData.booking_id}/pay`, paymentData, true);
  },

  // Update booking status - user actions (check-in / check-out)
  async checkIn(bookingId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/bookings/${bookingId}/check-in`, {}, true);
  },

  async checkOut(bookingId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/bookings/${bookingId}/check-out`, {}, true);
  }
};

// -----------------
// Admin Booking API
// -----------------
export const adminBookingApi = {
  // Get all apartment bookings
  async getApartmentBookings(): Promise<BookingsListResponse> {
    return adminBookingClient.get<BookingsListResponse>('/api/admin/bookings/apartments');
  },

  // Get all bookings (admin dashboard)
  async getAllBookings(): Promise<BookingsListResponse> {
    return adminBookingClient.get<BookingsListResponse>('/api/admin/apartment/bookings');
  },

  // Get booking details by ID
  async getBookingById(id: number): Promise<BookingResponse> {
    return adminBookingClient.get<BookingResponse>(`/api/admin/bookings/${id}`);
  },

  // Update booking status (admin)
  async updateBookingStatus(id: number, status: string, notes?: string): Promise<BookingResponse> {
    return adminBookingClient.put<BookingResponse>(`/api/admin/bookings/${id}/status`, { status, notes });
  }
};

// -----------------
// Vendor Booking API
// -----------------
export const vendorBookingApi = {
  // Get vendor's apartment bookings
  async getVendorBookings(): Promise<BookingsListResponse> {
    return apiClient.get<BookingsListResponse>('/api/vendor/bookings/apartments', true);
  },
};

// -----------------
// Paystack Integration Helper
// -----------------
declare const PaystackPop: any; // Prevent TS red underline

export const paystackHelper = {
  initializePayment: (
    email: string,
    amount: number,
    reference: string,
    callback: (response: any) => void,
    onClose?: () => void
  ) => {
    if (typeof PaystackPop === 'undefined') {
      console.error('Paystack script not loaded');
      return;
    }

    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here',
      email,
      amount: amount * 100, // kobo
      ref: reference,
      callback,
      onClose: onClose || (() => console.log('Payment window closed'))
    });

    handler.openIframe();
  }
};

// -----------------
// Export Types
// -----------------
export type {
  BookingRequest,
  Booking,
  BookingResponse,
  BookingsListResponse,
  PaymentRequest,
  PaymentResponse
};
