import React from 'react';
import { Shield, Users, Zap, Award, CheckCircle, TrendingUp } from 'lucide-react';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <Shield size={32} className="text-blue-600" />,
      title: "Secure Escrow System",
      description: "Every transaction is protected by our advanced escrow system ensuring both buyers and sellers are safe."
    },
    {
      icon: <Users size={32} className="text-emerald-600" />,
      title: "Verified Community",
      description: "All vendors undergo thorough verification through NIN and CAC to ensure legitimacy and trust."
    },
    {
      icon: <Zap size={32} className="text-yellow-600" />,
      title: "Lightning Fast",
      description: "Quick service delivery across all modules with real-time tracking and instant notifications."
    },
    {
      icon: <Award size={32} className="text-purple-600" />,
      title: "Quality Assured",
      description: "Rating system and quality checks ensure you always receive the best service and products."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: <Users size={20} /> },
    { number: "10K+", label: "Verified Vendors", icon: <CheckCircle size={20} /> },
    { number: "1M+", label: "Transactions", icon: <TrendingUp size={20} /> },
    { number: "6", label: "Service Categories", icon: <Award size={20} /> }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About McDee
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              McDee is Nigeria's premier multifunctional marketplace and services platform, 
              designed to connect communities through trusted peer-to-peer transactions. 
              We're revolutionizing how people access essential lifestyle services.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From daily rides and fresh meals to comfortable accommodations and reliable 
              auto maintenance, McDee brings together verified providers and satisfied 
              customers in a secure, user-friendly environment.
            </p>
            
            {/* Key Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Community-first approach with local focus</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">End-to-end transaction protection</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Multi-service integration under one platform</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="McDee Platform"
                className="w-full h-96 object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">100% Secure</div>
                  <div className="text-sm text-gray-600">Guaranteed Protection</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-50 rounded-2xl p-6 mb-4 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              McDee by the Numbers
            </h3>
            <p className="text-blue-100 text-lg">
              Join our growing community of satisfied users and trusted vendors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex justify-center mb-3 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
