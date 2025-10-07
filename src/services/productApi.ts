// src/services/productApi.ts
import { apiClient } from './apiClient';

// ----------------------
// Types & Interfaces
// ----------------------

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  vendor_id: number;
  title: string;
  description: string;
  images: string[];
  thumbnail?: string;
  price: string | number; // Backend returns string, we'll normalize
  stock_quantity: number;
  category_id: number;
  category?: Category;
  condition: 'new' | 'used' | 'refurbished';
  allow_pickup: boolean;
  allow_shipping: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
  vendor?: {
    id: number;
    business_name: string;
    category: string;
  };
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  condition: 'new' | 'used' | 'refurbished';
  allow_pickup: boolean;
  allow_shipping: boolean;
  images: string[]; // Cloudinary URLs
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductResponse {
  message?: string;
  data: Product;
}

export interface ProductsListResponse {
  message?: string;
  data: Product[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface MarketplaceProductsResponse {
  data: Product[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface MarketplaceFilters {
  category?: string; // slug
  q?: string; // search query
  price_min?: number;
  price_max?: number;
  condition?: 'new' | 'used' | 'refurbished';
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  per_page?: number;
  page?: number;
}

// ----------------------
// Product API Service
// ----------------------

export const productApi = {
  /**
   * VENDOR: Create new product
   */
  createProduct: async (productData: CreateProductData): Promise<ProductResponse> => {
    const response = await apiClient.post<Product>('/api/vendor/products', productData, true);
    
    // Normalize price to number
    if (response) {
      const normalizedProduct = normalizeProduct(response);
      return { data: normalizedProduct };
    }
    
    throw new Error('Failed to create product');
  },

  /**
   * VENDOR: Get all vendor's products
   */
  getVendorProducts: async (): Promise<ProductsListResponse> => {
    try {
      const response = await apiClient.get<Product[] | ProductsListResponse>(
        '/api/vendor/products',
        true
      );

      // Handle both array and paginated responses
      if (Array.isArray(response)) {
        return {
          data: response.map(normalizeProduct),
        };
      }

      if (response.data && Array.isArray(response.data)) {
        return {
          ...response,
          data: response.data.map(normalizeProduct),
        };
      }

      return { data: [] };
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      return { data: [] };
    }
  },

  /**
   * VENDOR: Get single product details
   */
  getProductById: async (productId: number): Promise<ProductResponse> => {
    const response = await apiClient.get<Product>(
      `/api/vendor/products/${productId}`,
      true
    );
    
    return { data: normalizeProduct(response) };
  },

  /**
   * VENDOR: Update product
   */
  updateProduct: async (
    productId: number,
    productData: UpdateProductData
  ): Promise<ProductResponse> => {
    const response = await apiClient.put<Product>(
      `/api/vendor/products/${productId}`,
      productData,
      true
    );
    
    return { data: normalizeProduct(response) };
  },

  /**
   * VENDOR: Delete product
   */
  deleteProduct: async (productId: number): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(
      `/api/vendor/products/${productId}`,
      true
    );
  },

  /**
   * PUBLIC: Get marketplace products with filters
   */
  getMarketplaceProducts: async (
    filters?: MarketplaceFilters
  ): Promise<MarketplaceProductsResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = params.toString()
      ? `/api/marketplace/products?${params.toString()}`
      : '/api/marketplace/products';

    const response = await apiClient.get<MarketplaceProductsResponse>(endpoint, false);

    // Normalize products
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map(normalizeProduct);
    }

    return response;
  },

  /**
   * PUBLIC: Get single product from marketplace
   */
  getMarketplaceProductById: async (productId: number): Promise<ProductResponse> => {
    const response = await apiClient.get<Product>(
      `/api/marketplace/products/${productId}`,
      false
    );
    
    return { data: normalizeProduct(response) };
  },

  /**
   * Get all categories (using seeded data)
   */
  getCategories: (): { data: Category[] } => {
    return { data: SEEDED_CATEGORIES };
  },
};

// ----------------------
// Seeded Categories (from DB)
// ----------------------
export const SEEDED_CATEGORIES: Category[] = [
  { id: 1, name: 'Phones & Tablets', slug: 'phones-tablets', parent_id: null, created_at: '', updated_at: '' },
  { id: 2, name: 'Electronics', slug: 'electronics', parent_id: null, created_at: '', updated_at: '' },
  { id: 3, name: 'Vehicles', slug: 'vehicles', parent_id: null, created_at: '', updated_at: '' },
  { id: 4, name: 'Property', slug: 'property', parent_id: null, created_at: '', updated_at: '' },
  { id: 5, name: 'Home, Furniture & Appliances', slug: 'home-furniture-appliances', parent_id: null, created_at: '', updated_at: '' },
  { id: 6, name: 'Health & Beauty', slug: 'health-beauty', parent_id: null, created_at: '', updated_at: '' },
  { id: 7, name: 'Fashion', slug: 'fashion', parent_id: null, created_at: '', updated_at: '' },
  { id: 8, name: 'Sports, Arts & Outdoors', slug: 'sports-arts-outdoors', parent_id: null, created_at: '', updated_at: '' },
  { id: 9, name: 'Jobs', slug: 'jobs', parent_id: null, created_at: '', updated_at: '' },
  { id: 10, name: 'Services', slug: 'services', parent_id: null, created_at: '', updated_at: '' },
  { id: 11, name: 'Pets', slug: 'pets', parent_id: null, created_at: '', updated_at: '' },
  { id: 12, name: 'Babies & Kids', slug: 'babies-kids', parent_id: null, created_at: '', updated_at: '' },
  { id: 13, name: 'Agriculture & Food', slug: 'agriculture-food', parent_id: null, created_at: '', updated_at: '' },
  { id: 14, name: 'Commercial Equipment & Tools', slug: 'commercial-equipment-tools', parent_id: null, created_at: '', updated_at: '' },
];

// ----------------------
// Helper Functions
// ----------------------

/**
 * Normalize product - convert price string to number
 */
function normalizeProduct(product: any): Product {
  return {
    ...product,
    price: typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : product.price,
    thumbnail: product.thumbnail || product.images?.[0] || '',
  };
}

// ----------------------
// Export Types
// ----------------------
export type {
  Category,
  Product,
  CreateProductData,
  UpdateProductData,
  ProductResponse,
  ProductsListResponse,
  MarketplaceProductsResponse,
  MarketplaceFilters,
};