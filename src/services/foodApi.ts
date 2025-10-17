import { apiClient, ApiResponse } from './apiClient';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface FoodVendorProfile {
  id: number;
  vendor_id: number;
  business_name: string;
  specialty: string;
  cuisines?: string[];
  location: string;
  latitude?: number;
  longitude?: number;
  contact_phone: string;
  contact_email: string;
  description: string;
  logo?: string;
  operating_hours?: Record<string, any>;
  delivery_radius_km?: number;
  minimum_order_amount?: number;
  delivery_fee?: number;
  estimated_preparation_time?: number;
  accepts_cash?: boolean;
  accepts_card?: boolean;
  is_open?: boolean;
  average_rating?: number;
  total_reviews?: number;
  total_orders?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FoodMenuItem {
  id: number;
  vendor_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  preparation_time_minutes: number;
  category: string;
  is_available: boolean;
  image?: string;
  image_urls?: string[];
  tags?: string[];
  stock?: number;
  estimated_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FoodOrderItem {
  menu_id: number;
  quantity: number;
  price?: number;
  total_price?: number;
  food_menu_id?: number;
}

export interface FoodOrder {
  id: number;
  user_id: number;
  vendor_id: number;
  rider_id?: number | null;
  total: number;
  tip_amount?: number;
  delivery_fee?: number;
  commission_amount?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_reference?: string | null;
  status:
    | 'pending_payment'
    | 'awaiting_vendor'
    | 'accepted'
    | 'preparing'
    | 'ready_for_pickup'
    | 'assigned'
    | 'picked_up'
    | 'on_the_way'
    | 'delivered'
    | 'completed'
    | 'cancelled'
    | 'disputed';
  delivery_method: 'delivery' | 'pickup';
  shipping_address?: Record<string, any>;
  can_show_contacts?: boolean;
  items?: FoodOrderItem[];
  vendor?: Partial<FoodVendorProfile>;
  rider?: any;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFoodOrderData {
  vendor_id: number;
  items: Array<{
    menu_id: number;
    quantity: number;
  }>;
  delivery_method: 'delivery' | 'pickup';
  shipping_address?: Record<string, any>;
  tip_amount?: number;
}

export interface CreateMenuItemData {
  name: string;
  slug: string;
  description: string;
  price: number;
  preparation_time_minutes: number;
  category: string;
  is_available: boolean;
  image?: string;
  image_urls?: string[];
  tags?: string[];
  stock?: number;
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {}

export interface VendorOrdersFilter {
  status?: string;
  payment_status?: string;
}

export interface FoodVendorStats {
  totalRevenue: number;
  totalMenuItems: number;
  totalOrders: number;
  averageRating: number;
  pendingOrders?: number;
  todayOrders?: number;
}

// ==========================================
// FOOD API SERVICE
// ==========================================

export const foodApi = {
  // ==========================================
  // VENDOR PROFILE MANAGEMENT
  // ==========================================

  /**
   * Complete food vendor profile setup
   */
  completeVendorSetup: async (data: Partial<FoodVendorProfile>): Promise<ApiResponse<FoodVendorProfile>> => {
    return apiClient.post<ApiResponse<FoodVendorProfile>>('/api/vendor/food/setup', data, true);
  },

  /**
   * Get authenticated vendor's food profile
   */
  getVendorProfile: async (): Promise<ApiResponse<FoodVendorProfile>> => {
    return apiClient.get<ApiResponse<FoodVendorProfile>>('/api/vendor/food/profile', true);
  },

  /**
   * Update vendor profile
   */
  updateVendorProfile: async (data: Partial<FoodVendorProfile>): Promise<ApiResponse<FoodVendorProfile>> => {
    return apiClient.put<ApiResponse<FoodVendorProfile>>('/api/vendor/food/profile', data, true);
  },

  /**
   * Get vendor dashboard statistics
   */
  getVendorStats: async (): Promise<ApiResponse<FoodVendorStats>> => {
    return apiClient.get<ApiResponse<FoodVendorStats>>('/api/vendor/food/stats', true);
  },

  // ==========================================
  // MENU MANAGEMENT (VENDOR)
  // ==========================================

  /**
   * Get all menu items for authenticated vendor
   */
  getVendorMenuItems: async (): Promise<ApiResponse<FoodMenuItem[]>> => {
    return apiClient.get<ApiResponse<FoodMenuItem[]>>('/api/vendor/food/menu', true);
  },

  /**
   * Create a new menu item
   */
  createMenuItem: async (data: CreateMenuItemData): Promise<ApiResponse<FoodMenuItem>> => {
    return apiClient.post<ApiResponse<FoodMenuItem>>('/api/vendor/food/menu', data, true);
  },

  /**
   * Update a menu item
   */
  updateMenuItem: async (id: number, data: UpdateMenuItemData): Promise<ApiResponse<FoodMenuItem>> => {
    return apiClient.put<ApiResponse<FoodMenuItem>>(`/api/vendor/food/menu/${id}`, data, true);
  },

  /**
   * Delete a menu item
   */
  deleteMenuItem: async (id: number): Promise<ApiResponse> => {
    return apiClient.delete<ApiResponse>(`/api/vendor/food/menu/${id}`, true);
  },

  /**
   * Get a single menu item by ID
   */
  getMenuItem: async (id: number): Promise<ApiResponse<FoodMenuItem>> => {
    return apiClient.get<ApiResponse<FoodMenuItem>>(`/api/vendor/food/menu/${id}`, true);
  },

  /**
   * Toggle menu item availability
   */
  toggleMenuItemAvailability: async (id: number, is_available: boolean): Promise<ApiResponse<FoodMenuItem>> => {
    return apiClient.patch<ApiResponse<FoodMenuItem>>(`/api/vendor/food/menu/${id}/availability`, { is_available }, true);
  },

  // ==========================================
  // ORDER MANAGEMENT (VENDOR)
  // ==========================================

  /**
   * Get all orders for authenticated vendor
   */
  getVendorOrders: async (filters?: VendorOrdersFilter): Promise<ApiResponse<FoodOrder[]>> => {
    let endpoint = '/api/vendor/food/orders';

    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.payment_status) params.append('payment_status', filters.payment_status);
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }

    return apiClient.get<ApiResponse<FoodOrder[]>>(endpoint, true);
  },

  /**
   * Get a single order by ID (vendor)
   */
  getVendorOrder: async (orderId: number): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.get<ApiResponse<FoodOrder>>(`/api/vendor/food/orders/${orderId}`, true);
  },

  /**
   * Update order status (vendor)
   */
  updateOrderStatus: async (orderId: number, status: string): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.patch<ApiResponse<FoodOrder>>(`/api/vendor/food/orders/${orderId}/status`, { status }, true);
  },

  /**
   * Accept order (vendor)
   */
  acceptOrder: async (orderId: number): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.patch<ApiResponse<FoodOrder>>(`/api/vendor/food/orders/${orderId}/status`, { status: 'accepted' }, true);
  },

  /**
   * Mark order as preparing (vendor)
   */
  markOrderPreparing: async (orderId: number): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.patch<ApiResponse<FoodOrder>>(`/api/vendor/food/orders/${orderId}/status`, { status: 'preparing' }, true);
  },

  /**
   * Mark order as ready for pickup (vendor)
   */
  markOrderReady: async (orderId: number): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.patch<ApiResponse<FoodOrder>>(`/api/vendor/food/orders/${orderId}/status`, { status: 'ready_for_pickup' }, true);
  },

  /**
   * Cancel order (vendor)
   */
  cancelOrder: async (orderId: number, reason?: string): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.patch<ApiResponse<FoodOrder>>(`/api/vendor/food/orders/${orderId}/status`, { status: 'cancelled', reason }, true);
  },

  // ==========================================
  // PUBLIC FOOD BROWSING
  // ==========================================

  /**
   * Get all public menu items with filters
   */
  getPublicMenus: async (params?: {
    vendor_id?: number;
    category?: string;
    available?: boolean;
  }): Promise<FoodMenuItem[]> => {
    let endpoint = '/api/food/menus';

    if (params) {
      const searchParams = new URLSearchParams();
      if (params.vendor_id) searchParams.append('vendor_id', params.vendor_id.toString());
      if (params.category) searchParams.append('category', params.category);
      if (params.available !== undefined) searchParams.append('available', params.available ? '1' : '0');
      if (searchParams.toString()) {
        endpoint += `?${searchParams.toString()}`;
      }
    }

    try {
      const response = await apiClient.get<any>(endpoint, false);
      // Handle both array and wrapped responses
      if (Array.isArray(response)) {
        return response;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      console.warn('Unexpected menu response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching public menus:', error);
      return [];
    }
  },

    /**
   * Get all live food vendors with their available menus (public)
   */
  getPublicVendorsWithMenus: async (): Promise<Array<FoodVendorProfile & { menu_items: FoodMenuItem[] }>> => {
    try {
      const response = await apiClient.get<any>('/api/food/vendors-with-menus', false);
      if (response && Array.isArray(response.vendors)) {
        return response.vendors;
      }
      if (response.data && Array.isArray(response.data.vendors)) {
        return response.data.vendors;
      }
      console.warn('Unexpected vendors-with-menus response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching vendors with menus:', error);
      return [];
    }
  },


  /**
   * Get all live food vendors
   */
  getPublicVendors: async (): Promise<FoodVendorProfile[]> => {
    try {
      const response = await apiClient.get<any>('/api/food/vendors', false);
      // Handle both array and wrapped responses
      if (Array.isArray(response)) {
        return response;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      console.warn('Unexpected vendor response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching public vendors:', error);
      return [];
    }
  },

  /**
   * Get a specific vendor's details with menu
   */
  getPublicVendorDetails: async (vendorId: number): Promise<ApiResponse<FoodVendorProfile & { menu?: FoodMenuItem[] }>> => {
    return apiClient.get<ApiResponse<FoodVendorProfile & { menu?: FoodMenuItem[] }>>(`/api/food/vendors/${vendorId}`, false);
  },

  /**
   * Get a single menu item details (public)
   */
  getPublicMenuItem: async (id: number): Promise<ApiResponse<FoodMenuItem>> => {
    return apiClient.get<ApiResponse<FoodMenuItem>>(`/api/food/menus/${id}`, false);
  },

  // ==========================================
  // USER ORDER MANAGEMENT
  // ==========================================

  /**
   * Place a new food order
   */
  placeOrder: async (data: CreateFoodOrderData): Promise<ApiResponse<{ order_id: number; order: FoodOrder }>> => {
    return apiClient.post<ApiResponse<{ order_id: number; order: FoodOrder }>>('/api/food/orders', data, true);
  },

  /**
   * Get all orders for authenticated user
   */
  getUserOrders: async (filters?: {
    status?: string;
    payment_status?: string;
  }): Promise<ApiResponse<FoodOrder[]>> => {
    let endpoint = '/api/food/orders';

    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.payment_status) params.append('payment_status', filters.payment_status);
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }

    return apiClient.get<ApiResponse<FoodOrder[]>>(endpoint, true);
  },

  /**
   * Get a single order by ID (user)
   */
  getUserOrder: async (orderId: number): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.get<ApiResponse<FoodOrder>>(`/api/food/orders/${orderId}`, true);
  },

  /**
   * Complete an order (user)
   */
  completeOrder: async (orderId: number): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.post<ApiResponse<FoodOrder>>(`/api/food/orders/${orderId}/complete`, {}, true);
  },

  /**
   * Cancel an order (user)
   */
  userCancelOrder: async (orderId: number, reason?: string): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.post<ApiResponse<FoodOrder>>(`/api/food/orders/${orderId}/cancel`, { reason }, true);
  },

  /**
   * Rate a food order (user)
   */
  rateOrder: async (orderId: number, rating: number, review?: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(`/api/food/orders/${orderId}/rate`, { rating, review }, true);
  },

  // ==========================================
  // RIDER MANAGEMENT (For future MVP)
  // ==========================================

  /**
   * Get available food orders for riders
   */
  getAvailableOrdersForRider: async (): Promise<ApiResponse<FoodOrder[]>> => {
    return apiClient.get<ApiResponse<FoodOrder[]>>('/api/rider/orders/available', true);
  },

  /**
   * Accept a delivery order (rider)
   */
  riderAcceptOrder: async (orderId: number): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.post<ApiResponse<FoodOrder>>(`/api/rider/orders/${orderId}/accept`, {}, true);
  },

  /**
   * Update order status (rider)
   */
  riderUpdateOrderStatus: async (orderId: number, status: string): Promise<ApiResponse<FoodOrder>> => {
    return apiClient.patch<ApiResponse<FoodOrder>>(`/api/rider/orders/${orderId}/status`, { status }, true);
  },
};

// Export types for use in components
export type {
  FoodVendorProfile,
  FoodMenuItem,
  FoodOrder,
  FoodOrderItem,
  CreateFoodOrderData,
  CreateMenuItemData,
  UpdateMenuItemData,
  VendorOrdersFilter,
  FoodVendorStats,
};