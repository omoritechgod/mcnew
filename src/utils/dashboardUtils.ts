export interface UserData {
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
    is_verified?: boolean;
  };
}

export const getDashboardPath = (user: UserData): string => {
  if (!user) return '/dashboard';
  
  if (user.user_type === 'user') {
    return '/dashboard/user';
  }

  const vendorCategory = user.vendor?.category;
  switch (vendorCategory) {
    case 'mechanic':
      return '/dashboard/mechanic';
    case 'rider':
      return '/dashboard/rider';
    case 'product':
    case 'product_vendor':
      return '/dashboard/product-vendor';
    case 'service-apartment':
    case 'apartment':
      return '/dashboard/apartment';
    case 'service':
    case 'service_vendor':
      return '/dashboard/service-vendor';
    case 'food':
    case 'food_vendor':
      return '/dashboard/food-vendor';
    default:
      return '/dashboard/vendor';
  }
};

export const getPageTitle = (user: UserData): string => {
  if (!user) return 'Dashboard';
  
  if (user.user_type === 'user') {
    return 'User Dashboard';
  }

  const vendorCategory = user.vendor?.category;
  switch (vendorCategory) {
    case 'mechanic':
      return 'Mechanic Dashboard';
    case 'rider':
      return 'Rider Dashboard';
    case 'product':
    case 'product_vendor':
      return 'Product Vendor Dashboard';
    case 'service-apartment':
    case 'apartment':
      return 'Service Apartment Dashboard';
    case 'service':
    case 'service_vendor':
      return 'Service Provider Dashboard';
    case 'food':
    case 'food_vendor':
      return 'Food Vendor Dashboard';
    default:
      return 'Vendor Dashboard';
  }
};

export const getUserInitials = (name: string): string => {
  if (!name) return 'U';
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export const getStoredUser = (): UserData | null => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
};

export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();
  return !!(token && user);
};