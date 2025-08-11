import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
              <Shield className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
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
              This Privacy Policy explains how McDee collects, uses, and protects your personal information.
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye size={20} className="text-blue-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              McDee ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our multifunctional marketplace platform, including our 
              website, mobile application, and related services (collectively, the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our platform connects users with various service providers across Nigeria, including ride-hailing, food delivery, 
              e-commerce, service apartments, auto maintenance, and general services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Database size={20} className="text-blue-600" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Name, email address, phone number</li>
                  <li>Date of birth and gender</li>
                  <li>Home and work addresses</li>
                  <li>Government-issued ID for verification (NIN, Driver's License, etc.)</li>
                  <li>Bank account details for vendors</li>
                  <li>Profile photos and documents</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Service usage patterns and preferences</li>
                  <li>Search queries and booking history</li>
                  <li>Communication with vendors and support</li>
                  <li>Device information and IP address</li>
                  <li>Location data (with your consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Payment method details (processed securely via Paystack)</li>
                  <li>Transaction history and receipts</li>
                  <li>Billing addresses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={20} className="text-blue-600" />
              How We Use Your Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Service Provision</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Process bookings and transactions</li>
                  <li>Connect you with service providers</li>
                  <li>Provide customer support</li>
                  <li>Send service-related notifications</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Platform Improvement</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Analyze usage patterns</li>
                  <li>Improve our services</li>
                  <li>Develop new features</li>
                  <li>Prevent fraud and abuse</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Legal Compliance</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Comply with Nigerian laws</li>
                  <li>Verify user identity (KYC)</li>
                  <li>Prevent money laundering</li>
                  <li>Respond to legal requests</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Marketing</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Send promotional offers (with consent)</li>
                  <li>Personalize recommendations</li>
                  <li>Conduct market research</li>
                  <li>Improve user experience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">With Service Providers</h3>
                <p className="text-yellow-700 text-sm">
                  We share necessary information with vendors to fulfill your service requests (name, contact details, location).
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">With Payment Processors</h3>
                <p className="text-blue-700 text-sm">
                  Payment information is securely processed by Paystack and other authorized payment partners.
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-2">Legal Requirements</h3>
                <p className="text-red-700 text-sm">
                  We may disclose information when required by Nigerian law, court orders, or to protect our rights and safety.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-green-800 mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-green-700 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Staff training on data protection</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Access & Update</h3>
                <p className="text-gray-700 text-sm">View and update your personal information through your account settings.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Data Portability</h3>
                <p className="text-gray-700 text-sm">Request a copy of your personal data in a structured format.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Account Deletion</h3>
                <p className="text-gray-700 text-sm">Request deletion of your account and associated data.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Marketing Opt-out</h3>
                <p className="text-gray-700 text-sm">Unsubscribe from promotional communications at any time.</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-blue-600" />
                  <span className="text-gray-700">support@mc-dee.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-blue-600" />
                  <span className="text-gray-700">+234 803 358 0844, +234 810 518 2900</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 mt-1">📍</div>
                  <span className="text-gray-700">McDee Nigeria Limited<br />Plot 30 Ngari street off rumualogu, Owhipa Choba, Port Harcourt, Rivers state</span>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our Service 
              after any changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
