import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import FoodDelivery from "./pages/FoodDelivery"
import RideHailing from "./pages/RideHailing"
import ServiceApartments from "./pages/ServiceApartments"
import ECommerce from "./pages/ECommerce"
import AutoMaintenance from "./pages/AutoMaintenance"
import GeneralServices from "./pages/GeneralServices"
import VendorDashboard from "./components/dashboard/VendorDashboard"
import PaymentSuccess from "./pages/PaymentSuccess"
import RefundPolicy from './pages/legal/RefundPolicy';
import TermsOfService from './pages/legal/TermsConditions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import ContactPage from './pages/ContactPage';
import ProductDetail from "./pages/ProductDetail"
import CartPage from "./pages/Cart"

// Import food pages
import FoodVendorMenu from "./pages/FoodVendorMenu"
import FoodCart from "./pages/FoodCart"
import FoodCheckout from "./pages/FoodCheckout"
import MyFoodOrders from "./pages/dashboard/user/MyFoodOrders"

// Import existing dashboard components
import UserDashboard from "./pages/dashboard/user"
import MechanicDashboard from "./pages/dashboard/mechanic"
import RiderDashboard from "./pages/dashboard/rider"
import ProductVendorDashboard from "./pages/dashboard/product-vendor"
import ServiceVendorDashboard from "./pages/dashboard/service-vendor"
import ServicePricings from "./pages/dashboard/service-vendor/ServicePricings"
import ServiceOrders from "./pages/dashboard/service-vendor/ServiceOrders"
import ApartmentDashboard from "./pages/dashboard/apartment"
import FoodVendorDashboard from "./pages/dashboard/food-vendor"
import FoodVendorMenuManagement from "./pages/dashboard/food-vendor/MenuManagement"
import FoodVendorOrders from "./pages/dashboard/food-vendor/Orders"
import GeneralVendorDashboard from "./pages/dashboard/vendor"
import ApartmentListingForm from "./pages/dashboard/vendor/ApartmentListing"
import VendApartmentBooking from "./pages/dashboard/apartment/VendApartmentBookings"
import PrivateRouteVendor from "./components/vendor/PrivateRouteVendor"
import PrivateRouteUser from "./components/user/PrivateRouteUser"
import ListedPropertiesPage from "./pages/dashboard/apartment/ListedPropertiesPage"

import MyBookings from "./pages/dashboard/user/MyBookings"
import MyServiceOrders from "./pages/dashboard/user/MyServiceOrders"
import MyOrders from "./pages/dashboard/user/MyOrders"
import VendorOrders from "./pages/dashboard/product-vendor/Orders"
import Checkout from "./pages/Checkout"

// Import profile pages
import UserProfile from "./pages/dashboard/user/profile"
import VendorCompliance from "./pages/dashboard/vendor/compliance"

// Import admin components
import AdminLogin from "./pages/Admin/Login"
import AdminDashboard from "./pages/Admin/Dashboard"
import KYCReview from "./pages/Admin/KYCReview"
import VendorManagement from "./pages/Admin/Vendors"
import AdminSettings from "./pages/Admin/Settings"
import BookingManagement from "./pages/dashboard/admin/BookingManagement"
import OrderManagement from "./pages/dashboard/admin/OrderManagement"
import PrivateRouteAdmin from "./components/admin/PrivateRouteAdmin"

import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/food-delivery" element={<FoodDelivery />} />
          <Route path="/food-vendor/:vendorId" element={<FoodVendorMenu />} />
          <Route path="/food-cart" element={<FoodCart />} />
          <Route
            path="/food-checkout"
            element={
              <PrivateRouteUser>
                <FoodCheckout />
              </PrivateRouteUser>
            }
          />
          <Route path="/ride-hailing" element={<RideHailing />} />
          <Route path="/service-apartments" element={<ServiceApartments />} />
          <Route path="/ecommerce" element={<ECommerce />} />
          <Route path="/auto-maintenance" element={<AutoMaintenance />} />
          <Route path="/general-services" element={<GeneralServices />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/user/bookings" element={<MyBookings />} />
          <Route path="/dashboard/user/my-service-orders" element={<MyServiceOrders />} />
          <Route
            path="/dashboard/user/orders"
            element={
              <PrivateRouteUser>
                <MyOrders />
              </PrivateRouteUser>
            }
          />
          <Route
            path="/dashboard/user/food-orders"
            element={
              <PrivateRouteUser>
                <MyFoodOrders />
              </PrivateRouteUser>
            }
          />
          <Route path="/dashboard/mechanic" element={<MechanicDashboard />} />
          <Route path="/dashboard/rider" element={<RiderDashboard />} />
          <Route path="/dashboard/product-vendor" element={<ProductVendorDashboard />} />
          <Route path="/dashboard/service-vendor" element={<ServiceVendorDashboard />} />
          <Route path="/dashboard/apartment" element={<ApartmentDashboard />} />
          <Route path="/dashboard/food-vendor" element={<FoodVendorDashboard />} />
          <Route path="/dashboard/vendor" element={<GeneralVendorDashboard />} />

          {/* Profile Routes */}
          <Route path="/dashboard/user/profile" element={<UserProfile />} />
          <Route path="/dashboard/mechanic/profile" element={<UserProfile />} />
          <Route path="/dashboard/rider/profile" element={<UserProfile />} />
          <Route path="/dashboard/product-vendor/profile" element={<UserProfile />} />
          <Route path="/dashboard/service-vendor/profile" element={<UserProfile />} />
          <Route path="/dashboard/apartment/profile" element={<UserProfile />} />
          <Route path="/dashboard/food-vendor/profile" element={<UserProfile />} />
          <Route path="/dashboard/vendor/profile" element={<UserProfile />} />

          {/* E-Commerce Routes */}
          <Route path="/ecommerce" element={<ECommerce />} />
          <Route path="/ecommerce/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <PrivateRouteUser>
                <Checkout />
              </PrivateRouteUser>
            }
          />

          {/* Compliance Routes */}
          <Route path="/dashboard/mechanic/compliance" element={<VendorCompliance />} />
          <Route path="/dashboard/rider/compliance" element={<VendorCompliance />} />
          <Route path="/dashboard/product-vendor/compliance" element={<VendorCompliance />} />
          <Route path="/dashboard/service-vendor/compliance" element={<VendorCompliance />} />
          <Route path="/dashboard/apartment/compliance" element={<VendorCompliance />} />
          <Route path="/dashboard/food-vendor/compliance" element={<VendorCompliance />} />
          <Route path="/dashboard/vendor/compliance" element={<VendorCompliance />} />

          {/* Apartment Vendor Routes */}
          <Route
            path="/dashboard/apartment/listing"
            element={
              <PrivateRouteVendor>
                <ApartmentListingForm />
              </PrivateRouteVendor>
            }
          />
                    <Route
            path="/dashboard/apartment/bookings"
            element={
              <PrivateRouteVendor>
                <VendApartmentBooking />
              </PrivateRouteVendor>
            }
          />
          <Route
            path="/dashboard/apartment/properties"
            element={
              <PrivateRouteVendor>
                <ListedPropertiesPage />
              </PrivateRouteVendor>
            }
          />
                    <Route
            path="/dashboard/service-vendor/pricings"
            element={
              <PrivateRouteVendor>
                <ServicePricings />
              </PrivateRouteVendor>
            }
          />
          <Route
            path="/dashboard/service-vendor/orders"
            element={
              <PrivateRouteVendor>
                <ServiceOrders />
              </PrivateRouteVendor>
            }
          />

          {/* Product Vendor Routes */}
          <Route
            path="/dashboard/product-vendor/products"
            element={
              <PrivateRouteVendor>
                <ProductVendorDashboard />
              </PrivateRouteVendor>
            }
          />
          <Route
            path="/dashboard/product-vendor/orders"
            element={
              <PrivateRouteVendor>
                <VendorOrders />
              </PrivateRouteVendor>
            }
          />

          {/* Food Vendor Routes */}
          <Route
            path="/dashboard/food-vendor/menu"
            element={
              <PrivateRouteVendor>
                <FoodVendorMenuManagement />
              </PrivateRouteVendor>
            }
          />
          <Route
            path="/dashboard/food-vendor/orders"
            element={
              <PrivateRouteVendor>
                <FoodVendorOrders />
              </PrivateRouteVendor>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRouteAdmin>
                <AdminDashboard />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <PrivateRouteAdmin>
                <VendorManagement />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/admin/kyc/review"
            element={
              <PrivateRouteAdmin>
                <KYCReview />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <PrivateRouteAdmin>
                <BookingManagement />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateRouteAdmin>
                <OrderManagement />
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRouteAdmin>
                <AdminSettings />
              </PrivateRouteAdmin>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
