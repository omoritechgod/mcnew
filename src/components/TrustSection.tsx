import React from 'react';
import { Shield, Lock, Eye, UserCheck, CreditCard, CheckCircle2 } from 'lucide-react';

const TrustSection: React.FC = () => {
  const trustFeatures = [
    {
      icon: <Lock size={24} className="text-blue-600" />,
      title: "Secure Escrow System",
      description: "Your money is held safely until services are completed to your satisfaction.",
      process: [
        "Payment held in secure escrow",
        "Service provider delivers",
        "You confirm satisfaction",
        "Payment released automatically"
      ]
    },
    {
      icon: <UserCheck size={24} className="text-emerald-600" />,
      title: "Vendor Verification",
      description: "All vendors undergo thorough verification before they can offer services.",
      process: [
        "Identity verification (NIN/CAC)",
        "Business document review",
        "Background checks",
        "Account activation"
      ]
    },
    {
      icon: <Eye size={24} className="text-purple-600" />,
      title: "Transparent Tracking",
      description: "Monitor every transaction and service delivery in real-time.",
      process: [
        "Real-time status updates",
        "GPS tracking for deliveries",
        "Service milestone tracking",
        "Complete transaction history"
      ]
    }
  ];

  const securityStats = [
    { percentage: "99.9%", label: "Transaction Success Rate" },
    { percentage: "100%", label: "Verified Vendors" },
    { percentage: "24/7", label: "Security Monitoring" },
    { percentage: "₦0", label: "Fraud Loss" }
  ];

  return (
    <section id="trust" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <Shield size={40} className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trust & Safety First
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your security is our priority. McDee's advanced protection systems ensure 
            every transaction is safe, secure, and transparent.
          </p>
        </div>

        {/* Trust Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {trustFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-50 rounded-full p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                  How it works:
                </h4>
                {feature.process.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                      <CheckCircle2 size={12} className="text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security Stats */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Security Record
            </h3>
            <p className="text-gray-600 text-lg">
              Numbers that speak to our commitment to your safety
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {securityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.percentage}
                </div>
                <div className="text-gray-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seal Checking System */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Seal-Checking System
              </h3>
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                Our unique seal-checking system ensures the integrity of food deliveries 
                and product shipments, giving you confidence in every order.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 rounded-full p-1 mt-1">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <span className="text-white">Tamper-evident packaging verification</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 rounded-full p-1 mt-1">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <span className="text-white">Photo documentation at pickup and delivery</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 rounded-full p-1 mt-1">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <span className="text-white">Real-time delivery tracking and alerts</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <CreditCard size={64} className="text-white mx-auto mb-6" />
                <h4 className="text-2xl font-bold text-white mb-4">
                  100% Protected
                </h4>
                <p className="text-white/90">
                  Every transaction is fully insured and protected by our comprehensive security measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;