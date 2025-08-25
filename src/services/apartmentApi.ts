// src/services/apartmentApi.ts
import { apiClient } from './api'; // change to './apiClient' if your project uses that filename

// --- Types ---
export interface ApartmentData {
  id: number;
  vendor_id: number;
  title: string;
  description?: string;
  location: string;
  price_per_night: string;
  type: 'hotel' | 'hostel' | 'shortlet';
  images: string[];
  is_verified: number;
  created_at: string;
  updated_at: string;
}

export interface ApartmentApiResponse {
  message: string;
  data: ApartmentData[] | ApartmentData;
}

/**
 * Booking request expected by backend (validator checks for `listing_id`)
 */
export interface ApartmentBookingRequest {
  listing_id: number;          // note: backend validator expects `listing_id` (listings table)
  check_in_date: string;
  check_out_date: string;
  guests?: number;
  notes?: string;
}

/**
 * Response for a single booking created by the apartment booking endpoint
 */
export interface ApartmentBookingResponse {
  message: string;
  data: {
    id: number;
    user_id: number;
    listing_id: number;
    vendor_id?: number;
    check_in_date: string;
    check_out_date: string;
    nights?: number;
    guests?: number;
    total_price: string | number;
    status: string;
    notes?: string;
    created_at: string;
    updated_at?: string;
  };
}

// Minimal list response for bookings
export interface BookingsListResponse {
  message: string;
  data: ApartmentBookingResponse['data'][];
}

// --- Apartment API service ---
export const apartmentApi = {
  /**
   * Fetch apartments (public)
   * Optional filters: type, location, min_price, max_price, check_in, check_out, guests, page, per_page
   */
  async getApartments(params?: {
    type?: string;
    location?: string;
    min_price?: number;
    max_price?: number;
    check_in?: string;
    check_out?: string;
    guests?: number;
    page?: number;
    per_page?: number;
  }): Promise<ApartmentApiResponse> {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          qs.append(k, String(v));
        }
      });
    }
    const endpoint = qs.toString() ? `/api/apartments?${qs.toString()}` : '/api/apartments';
    return apiClient.get<ApartmentApiResponse>(endpoint, false);
  },

  /**
   * Get one apartment by id (public)
   */
  async getApartmentById(id: number): Promise<{ message: string; data: ApartmentData }> {
    return apiClient.get<{ message: string; data: ApartmentData }>(`/api/apartments/${id}`, false);
  },

  /**
   * Create (vendor) listing - maps to ListingController@store: POST /api/listings
   * Requires authentication (vendor)
   */
  async createListing(payload: any): Promise<{ message: string; data: any }> {
    return apiClient.post('/api/listings', payload, true);
  },

  /**
   * Book an apartment/listing (authenticated user)
   * POST /api/apartment/bookings  -> ApartmentBookingController@store
   */
  async bookApartment(bookingData: ApartmentBookingRequest): Promise<ApartmentBookingResponse> {
    return apiClient.post<ApartmentBookingResponse>('/api/apartment/bookings', bookingData, true);
  },

  /**
   * Get list of apartment bookings (index) - route exists: GET /api/apartment/bookings
   * (likely vendor/admin view)
   */
  async getApartmentBookings(): Promise<BookingsListResponse> {
    return apiClient.get<BookingsListResponse>('/apartment/bookings', true);
  },

  /**
   * Get bookings for the logged-in user: GET /api/apartment/bookings/my
   */
  async getMyBookings(): Promise<BookingsListResponse> {
    return apiClient.get<BookingsListResponse>('/apartment/bookings/my', true);
  },

  /**
   * Initiate payment for a booking using backend endpoint
   * POST /api/bookings/{id}/pay -> PaymentController@payForBooking
   * Backend returns initialization payload (e.g. Paystack init data)
   */
  async initiatePaymentForBooking(bookingId: number): Promise<any> {
    return apiClient.post(`/bookings/${bookingId}/pay`, {}, true);
  },

  /**
   * User check-in: POST /api/bookings/{id}/check-in
   */
  async checkIn(bookingId: number): Promise<{ message: string; data?: any }> {
    return apiClient.post<{ message: string; data?: any }>(`/bookings/${bookingId}/check-in`, {}, true);
  },

  /**
   * User check-out: POST /api/bookings/{id}/check-out
   */
  async checkOut(bookingId: number): Promise<{ message: string; data?: any }> {
    return apiClient.post<{ message: string; data?: any }>(`/bookings/${bookingId}/check-out`, {}, true);
  },

  // ----------------------
  // Admin helpers (matching your routes)
  // ----------------------

  /**
   * Admin: GET /api/admin/bookings/apartments
   */
  async adminGetBookingsApartments(): Promise<BookingsListResponse> {
    return apiClient.get<BookingsListResponse>('/admin/bookings/apartments', true);
  },

  /**
   * Admin: alternate route GET /api/admin/apartment/bookings
   */
  async adminGetApartmentBookingsAlternate(): Promise<BookingsListResponse> {
    return apiClient.get<BookingsListResponse>('/admin/apartment/bookings', true);
  },

  /**
   * Admin: Get a booking by id -> GET /api/admin/bookings/{id}
   */
  async adminGetBookingById(id: number): Promise<ApartmentBookingResponse> {
    return apiClient.get<ApartmentBookingResponse>(`/admin/bookings/${id}`, true);
  },

  /**
   * Admin: Update booking status -> PUT /api/admin/bookings/{id}/status
   * Note: backend route uses PUT; use that here.
   */
  async adminUpdateBookingStatus(id: number, status: string, notes?: string): Promise<ApartmentBookingResponse> {
    return apiClient.put<ApartmentBookingResponse>(`/admin/bookings/${id}/status`, { status, notes }, true);
  }
};

// Export types that may be used by components
export type {
  ApartmentData,
  ApartmentApiResponse,
  ApartmentBookingRequest,
  ApartmentBookingResponse,
  BookingsListResponse
};
