// src/services/vendorApi.ts
import { apiClient, ApiResponse } from "./apiClient"

// ------------------
// Vendor-specific types
// ------------------
export interface VendorRegistrationData {
  vendor_type: string
  business_name: string
  category: string
}

export interface MechanicSetupData {
  workshop_name: string
  services_offered: string
  location: string
  contact_number: string
}

export interface RiderSetupData {
  vehicle_type: string
  license_number: string
  experience_years: number
}

export interface ProductVendorSetupData {
  contact_person: string
  store_address: string
  store_phone: string
  store_email: string
  store_description: string
  logo?: string
}

export interface ServiceApartmentSetupData {
  full_name: string
  phone_number: string
  organization_name: string
  organization_address: string
  website?: string
  years_of_experience: number
}

export interface ServiceVendorSetupData {
  service_name: string
  description: string
  location: string
  phone: string
  email: string
}

export interface FoodVendorSetupData {
  business_name: string
  specialty: string
  location: string
  contact_phone: string
  contact_email: string
  description: string
  logo?: string
}

// ------------------
// Vendor API service
// ------------------
export const vendorApi = {
  /**
   * Register vendor (step 1)
   */
  registerVendor: async (
    data: VendorRegistrationData
  ): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/vendor/register", data, true)
  },

  /**
   * Setup category-specific vendor profiles
   */
  setupMechanic: async (data: MechanicSetupData): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/vendor/mechanic/setup", data, true)
  },

  setupRider: async (data: RiderSetupData): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/vendor/rider/setup", data, true)
  },

  setupProductVendor: async (
    data: ProductVendorSetupData
  ): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/vendor/product/setup", data, true)
  },

  setupServiceApartment: async (
    data: ServiceApartmentSetupData
  ): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/vendor/apartment/setup", data, true)
  },

  setupServiceVendor: async (
    data: ServiceVendorSetupData
  ): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/vendor/service/setup", data, true)
  },

  setupFoodVendor: async (
    data: FoodVendorSetupData
  ): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/vendor/food/setup", data, true)
  },

  /**
   * Vendor dashboards (placeholders until endpoints exist)
   */
  getMechanicDashboard: async (): Promise<any> => {
    return apiClient.get("/api/vendor/mechanic/dashboard", true)
  },

  getRiderDashboard: async (): Promise<any> => {
    return apiClient.get("/api/vendor/rider/dashboard", true)
  },

  getProductVendorDashboard: async (): Promise<any> => {
    return apiClient.get("/api/vendor/product/dashboard", true)
  },

  getServiceVendorDashboard: async (): Promise<any> => {
    return apiClient.get("/api/vendor/service/dashboard", true)
  },

  getFoodVendorDashboard: async (): Promise<any> => {
    return apiClient.get("/api/vendor/food/dashboard", true)
  },

  /**
   * Live vendors listing
   */
  getLiveVendors: async (): Promise<{ message: string; data: any[] }> => {
    return apiClient.get("/api/vendors/live", false)
  },

  getLiveVendorById: async (
    id: number
  ): Promise<{ message: string; data: any }> => {
    return apiClient.get(`/api/vendors/live/${id}`, false)
  },

  /**
   * Vendor listings
   */
  submitApartmentListing: async (data: any): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/api/listings", data, true)
  },

  getMyListings: async (): Promise<{ message: string; data: any[] }> => {
    return apiClient.get("/api/listings", true)
  },
}

// Export types for use in components
export type {
  VendorRegistrationData,
  MechanicSetupData,
  RiderSetupData,
  ProductVendorSetupData,
  ServiceApartmentSetupData,
  ServiceVendorSetupData,
  FoodVendorSetupData,
}
