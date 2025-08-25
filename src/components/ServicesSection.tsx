import React from 'react';
import { 
  Bike, 
  UtensilsCrossed, 
  Home, 
  ShoppingBag, 
  Wrench, 
  Users,
  ArrowRight,
  Star,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesSection: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Bike className="text-blue-600" size={40} />,
      title: "Ride-Hailing (Okada)",
      description: "Quick, safe, and affordable motorcycle rides with real-time tracking and verified riders.",
      features: ["Real-time tracking", "Verified riders", "Instant booking"],
      color: "blue",
      image: "https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=500",
      route: "/ride-hailing"
    },
    {
      icon: <UtensilsCrossed className="text-orange-600" size={40} />,
      title: "Food Delivery",
      description: "Fresh meals delivered fast from your favorite local restaurants with sealed packaging.",
      features: ["Fresh & sealed", "Fast delivery", "Local restaurants"],
      color: "orange",
      image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=500",
      route: "/food-delivery"
    },
    {
      icon: <Home className="text-emerald-600" size={40} />,
      title: "Service Apartments",
      description: "Comfortable short-term stays in verified apartments, hostels, and hotels.",
      features: ["Verified listings", "Flexible booking", "Secure payments"],
      color: "emerald",
      image: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=500",
      route: "/service-apartments"
    },
    {
      icon: <ShoppingBag className="text-purple-600" size={40} />,
      title: "E-commerce",
      description: "Shop from verified vendors with secure transactions and reliable delivery.",
      features: ["Verified vendors", "Secure escrow", "Quality products"],
      color: "purple",
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=500",
      route: "/ecommerce"
    },
    {
      icon: <Wrench className="text-red-600" size={40} />,
      title: "Auto Maintenance",
      description: "Connect with skilled mechanics for reliable car repairs and maintenance services.",
      features: ["Skilled mechanics", "Fair pricing", "Quality service"],
      color: "red",
      image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=500",
      route: "/auto-maintenance"
    },
    {
      icon: <Users className="text-indigo-600" size={40} />,
      title: "General Services",
      description: "Find trusted professionals for home services, repairs, and specialized tasks.",
      features: ["Trusted professionals", "Wide range", "Quality assured"],
      color: "indigo",
      image: "https://images.pexels.com/photos/5691608/pexels-photo-5691608.jpeg?auto=compress&cs=tinysrgb&w=500",
      route: "/general-services"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From daily essentials to specialized services, McDee connects you with trusted providers 
            across all aspects of modern life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="service-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl group cursor-pointer"
              onClick={() => navigate(service.route)}
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white rounded-full p-3">
                  {service.icon}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Shield size={16} className="text-green-600" />
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Star size={14} className={`text-${service.color}-600 fill-current`} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full bg-${service.color}-600 hover:bg-${service.color}-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 group`}>
                  Get Started
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied users and verified vendors on Nigeria's most trusted marketplace platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Sign Up as Customer
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Join as Vendor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
