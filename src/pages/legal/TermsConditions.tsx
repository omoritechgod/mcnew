import React from 'react';
import { ArrowLeft, FileText, Users, CreditCard, Shield, AlertTriangle, Scale, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions: React.FC = () => {
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
              <FileText className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
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
              <strong>Last Updated:</strong> August 2025
            </p>
            <p className="text-sm text-blue-700 mt-1">
              These Terms & Conditions govern your use of the McDee platform and services.
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to McDee, Nigeria's multifunctional marketplace platform. These Terms and Conditions ("Terms") 
              constitute a legally binding agreement between you and McDee Nigeria Limited ("McDee," "we," "us," or "our") 
              regarding your use of our platform and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our platform, you agree to be bound by these Terms. If you do not agree to these Terms, 
              please do not use our services.
            </p>
          </section>

          {/* Platform Description */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Platform Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              McDee operates as a multifunctional marketplace connecting users with service providers across Nigeria. 
              Our platform facilitates the following services:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Ride-hailing services</li>
                <li>Food delivery</li>
                <li>E-commerce marketplace</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Service apartment bookings</li>
                <li>Auto maintenance services</li>
                <li>General services marketplace</li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Accounts and Registration</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Account Creation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Verification Requirements</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 mb-2">
                    <strong>For Service Providers (Vendors):</strong>
                  </p>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                    <li>Valid government-issued ID (NIN, Driver's License, etc.)</li>
                    <li>Business registration documents (where applicable)</li>
                    <li>Bank account verification</li>
                    <li>Professional certifications (for specialized services)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Service Usage */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Usage and Conduct</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Permitted Use</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Use services for lawful purposes only</li>
                  <li>Provide accurate information in all transactions</li>
                  <li>Respect other users and service providers</li>
                  <li>Comply with all applicable Nigerian laws</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Prohibited Activities</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-red-700 space-y-2">
                    <li>Fraudulent or deceptive practices</li>
                    <li>Harassment or abusive behavior</li>
                    <li>Violation of intellectual property rights</li>
                    <li>Circumventing platform fees or policies</li>
                    <li>Creating fake accounts or reviews</li>
                    <li>Engaging in illegal activities</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Payment Terms
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Processing</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>All payments are processed securely through Paystack</li>
                  <li>We accept major debit/credit cards and bank transfers</li>
                  <li>Prices are displayed in Nigerian Naira (₦)</li>
                  <li>Payment is required before service delivery</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Escrow System</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 mb-2">
                    <strong>For Service Apartments and High-Value Services:</strong>
                  </p>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                    <li>Payments are held in escrow until service completion</li>
                    <li>Funds are released to vendors after successful service delivery</li>
                    <li>McDee retains a service fee as specified in our fee structure</li>
                    <li>Disputes are resolved through our mediation process</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Service Fees</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Service Category</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Platform Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Ride-hailing</td>
                        <td className="border border-gray-300 px-4 py-2">5% of trip fare</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Food Delivery</td>
                        <td className="border border-gray-300 px-4 py-2">5% of order value</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">E-commerce</td>
                        <td className="border border-gray-300 px-4 py-2">5% of product price</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Service Apartments</td>
                        <td className="border border-gray-300 px-4 py-2">10% of booking value</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Auto Maintenance</td>
                        <td className="border border-gray-300 px-4 py-2">5% of service cost</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">General Services</td>
                        <td className="border border-gray-300 px-4 py-2">5% of service cost</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Vendor Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendor Terms</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Vendor Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide services as described and advertised</li>
                  <li>Maintain professional standards and quality</li>
                  <li>Respond promptly to customer inquiries</li>
                  <li>Comply with all applicable licenses and regulations</li>
                  <li>Maintain appropriate insurance coverage</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment to Vendors</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-blue-700 space-y-2">
                    <li>Payments are processed within 24-48 hours after service completion</li>
                    <li>Minimum payout threshold: ₦5,000</li>
                    <li>Bank transfer fees may apply</li>
                    <li>Tax obligations are the vendor's responsibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

                {/* Vendor Compliance & Live Status */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              Vendor Compliance & Live Status Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To ensure trust and safety for all users, McDee enforces a <strong>Live Vendor</strong> policy. Vendors must
              meet compliance requirements before their listings are visible to the public.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Phone number must be verified via OTP</li>
              <li>Required ID or business documents must be approved by McDee</li>
              <li>Only vendors marked as <strong>Live</strong> will have active listings</li>
              <li>Non-compliant vendors may have accounts restricted until requirements are met</li>
            </ul>
          </section>

          {/* Liability and Disclaimers */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              Liability and Disclaimers
            </h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-3">Platform Role</h3>
                <p className="text-yellow-700 text-sm">
                  McDee acts as an intermediary platform connecting users with service providers. We do not directly 
                  provide the services listed on our platform and are not responsible for the quality, safety, or 
                  legality of services provided by third-party vendors.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Limitation of Liability</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>McDee's liability is limited to the amount of fees paid for the specific service</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Users assume responsibility for their interactions with service providers</li>
                  <li>We do not guarantee service availability or uninterrupted platform access</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scale size={20} className="text-blue-600" />
              Dispute Resolution
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Mediation Process</h3>
                <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
                  <li>Report disputes through our platform within 48 hours</li>
                  <li>Provide relevant evidence and documentation</li>
                  <li>Participate in good faith mediation efforts</li>
                  <li>Accept binding arbitration if mediation fails</li>
                </ol>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h3 className="text-lg font-medium text-green-800 mb-2">Governing Law</h3>
                <p className="text-green-700 text-sm">
                  These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be 
                  resolved in the courts of Lagos State, Nigeria.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600" />
              Account Termination
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Termination by User</h3>
                <p className="text-gray-700 mb-2">
                  You may terminate your account at any time by contacting our support team. Upon termination:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Your account will be deactivated within 24 hours</li>
                  <li>Pending transactions will be completed</li>
                  <li>Personal data will be deleted as per our Privacy Policy</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Termination by McDee</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 mb-2">We may terminate accounts for:</p>
                  <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                    <li>Violation of these Terms</li>
                    <li>Fraudulent or illegal activities</li>
                    <li>Repeated customer complaints</li>
                    <li>Non-payment of fees</li>
                    <li>Inactive accounts (after 12 months)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. Material changes will be communicated through:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Email notification to registered users</li>
              <li>In-app notifications</li>
              <li>Website banner announcements</li>
              <li>Updated "Last Modified" date on this page</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Continued use of our platform after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                For questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">📧</span>
                  <span className="text-gray-700">support@mc-dee.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">📞</span>
                  <span className="text-gray-700">+234 803 358 0844, +234 810 518 2900</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">📍</span>
                  <span className="text-gray-700">
                    McDee Nigeria Limited<br />
                    Legal Department<br />
                    Plot 30 Ngari street off rumualogu, Owhipa Choba, Port Harcourt, Rivers state
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
