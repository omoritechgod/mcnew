// src/services/api.ts

import { apiClient } from "./apiClient"

/**
 * Standard API response structure
 * Used across all services for consistency
 */
export interface ApiResponse<T = any> {
  success?: boolean
  message?: string
  data?: T
  error?: string
}

/**
 * Convenience wrapper around apiClient
 * Ensures old imports like `api.get(...)` still work
 */
export const api = {
  get: <T = any>(endpoint: string, requiresAuth = true) =>
    apiClient.get<T>(endpoint, requiresAuth),

  post: <T = any>(endpoint: string, data?: any, requiresAuth = true) =>
    apiClient.post<T>(endpoint, data, requiresAuth),

  put: <T = any>(endpoint: string, data?: any, requiresAuth = true) =>
    apiClient.put<T>(endpoint, data, requiresAuth),

  patch: <T = any>(endpoint: string, data?: any, requiresAuth = true) =>
    apiClient.patch<T>(endpoint, data, requiresAuth),

  delete: <T = any>(endpoint: string, requiresAuth = true) =>
    apiClient.delete<T>(endpoint, requiresAuth),

  uploadFile: <T = any>(endpoint: string, formData: FormData, requiresAuth = true) =>
    apiClient.uploadFile<T>(endpoint, formData, requiresAuth),
}

/**
 * Re-export apiClient for direct usage
 */
export { apiClient }

/**
 * Export base URL for consistency
 */
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://mdoilandgas.com/mcdee/backend/public/api"
