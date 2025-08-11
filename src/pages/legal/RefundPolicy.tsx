import React from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <RefreshCw className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Refund Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Last Updated */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-sm text-blue-700 mt-1">
              This Refund Policy outlines the conditions and procedures for refunds on the McDee platform.
            </p>
          </div>

          {/* Key Refund Rule */}
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-red-800 mb-2">Important Refund Policy</h2>
                <p className="text-red-700 text-lg font-medium mb-2">
                  Maximum Refund: 50% of Payment
                </p>
                <p className="text-red-600 text-sm">
                  When a verified issue occurs, the maximum refund amount is 50% of the total payment made. 
                  This applies to all services on the McDee platform after thorough investigation and verification.
                </p>
              </div>
            </div>
          </div>

          {/* General Refund Principles */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw size={20} className="text-blue-600" />
              General Refund Principles
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <h3 className="font-medium text-gray-900">Eligible for Refund</h3>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Service not provided as described</li>
                  <li>Vendor cancellation after payment</li>
                  <li>Platform technical failures</li>
                  <li>Verified safety or quality issues</li>
                  <li>Double charging errors</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="text-red-600" size={20} />
                  <h3 className="font-medium text-gray-900">Not Eligible for Refund</h3>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Change of mind after service delivery</li>
                  <li>User cancellation after service starts</li>
                  <li>Minor service variations</li>
                  <li>Weather-related delays</li>
                  <li>User no-show or unavailability</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service-Specific Refund Policies */}
          <section className="mb-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service-Specific Refund Policies</h2>

            {/* Ride-Hailing */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🚗 Ride-Hailing Services</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Refundable (50% max)</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                    <li>Driver cancellation after pickup</li>
                    <li>Vehicle breakdown during trip</li>
                    <li>Significant route deviation</li>
                    <li>Verified safety concerns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Non-Refundable</h4>
                  <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                    <li>User cancellation after driver arrival</li>
                    <li>Traffic delays</li>
                    <li>Completed trips</li>
                    <li>Wrong location provided by user</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded">
                <strong>Timeframe:</strong> Request within 24 hours of trip completion.
              </p>
            </div>

            {/* Food Delivery */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🍕 Food Delivery Services</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Refundable (50% max)</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                    <li>Wrong order delivered</li>
                    <li>Verified food quality issues</li>
                    <li>Excessive delivery delays (2+ hours)</li>
                    <li>Missing order items</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Non-Refundable</h4>
                  <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                    <li>Change of mind after preparation</li>
                    <li>Normal delays (under 1 hour)</li>
                    <li>User unavailable at delivery</li>
                    <li>Taste preferences</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded">
                <strong>Timeframe:</strong> Report within 2 hours of delivery.
              </p>
            </div>

            {/* Service Apartments */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🏠 Service Apartment Bookings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Refundable (50% max)</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                    <li>Property not as described</li>
                    <li>Verified safety/cleanliness issues</li>
                    <li>Host cancellation within 48 hours</li>
                    <li>Major amenities not working</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Cancellation Policy</h4>
                  <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                    <li>7+ days before: 50% refund</li>
                    <li>3–6 days before: 25% refund</li>
                    <li>Less than 3 days: No refund</li>
                    <li>No-show: No refund</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-blue-800 bg-blue-50 p-3 rounded">
                <strong>Check-in Issues:</strong> Report within 2 hours of arrival.
              </p>
            </div>

            {/* E-commerce */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🛒 E-commerce Products</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Refundable (50% max)</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                    <li>Product significantly different from description</li>
                    <li>Damaged items received</li>
                    <li>Wrong product delivered</li>
                    <li>Defective products within warranty</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Non-Refundable Items</h4>
                  <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                    <li>Opened perishable goods</li>
                    <li>Personalized/custom items</li>
                    <li>Products damaged due to misuse</li>
                    <li>Items without original packaging</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-yellow-800 bg-yellow-50 p-3 rounded">
                <strong>Timeframe:</strong> Report within 48 hours of delivery.
              </p>
            </div>
          </section>

          {/* Refund Request Procedure */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Request Procedure</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm">
              <li>Submit a refund request via your McDee account dashboard.</li>
              <li>Provide detailed reason and evidence (photos, receipts, communication).</li>
              <li>Our team will investigate within 3–5 business days.</li>
              <li>If approved, refund will be processed to your original payment method.</li>
            </ol>
          </section>

          {/* Processing Time */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Time</h2>
            <p className="text-sm text-gray-700">
              Approved refunds are processed within <strong>7–10 business days</strong>.  
              Time may vary depending on your bank or payment provider.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-sm text-gray-700">
              If you have any questions about this Refund Policy, contact us at:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              <li>Email: support@mcdee.com</li>
              <li>Phone: +234 800 000 0000</li>
              <li>Address: Plot 30 Ngari street off rumualogu, Owhipa Choba, Port Harcourt, Rivers state</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
