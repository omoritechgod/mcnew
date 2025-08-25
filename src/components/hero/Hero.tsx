import React, { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import MobileOrbit from "./MobileOrbit";
import ServiceButtonsGrid from "./ServiceButtonsGrid";
import DesktopCarousel from "./DesktopCarousel";
import DesktopServiceButtons from "./DesktopServiceButtons";

// Import service icons
import foodImg from "../../assets/img/food-1.png";
import shopImg from "../../assets/img/cart_shop.png";
import deliveryImg from "../../assets/img/delivery.png";
import rideImg from "../../assets/img/okada-ride.png";
import oilGasImg from "../../assets/img/oil_gas.png";
import mechImg from "../../assets/img/mech_2.png";
import bgGif from "../../assets/img/modif-gif.gif";
import mobileBg from "../../assets/img/Mobile-bg.jpg";

const carouselItems = [
  {
    sub: "Online Shopping has never been more Interesting than it is with Us",
    btn1: "Learn More",
    btn2: "Get Started",
  },
  {
    sub: "Get picked up faster with verified local riders near you",
    btn1: "How It Works",
    btn2: "Book Now",
  },
  {
    sub: "Discover affordable service apartments near you",
    btn1: "Explore Rooms",
    btn2: "Book Now",
  },
  {
    sub: "Connect with skilled mechanics for reliable car repairs and maintenance",
    btn1: "Find Mechanics",
    btn2: "Get Quote",
  },
  {
    sub: "Find trusted professionals for home services and specialized tasks",
    btn1: "Browse Services",
    btn2: "Get Help",
  },
  {
    sub: "Fresh meals delivered fast from your favorite local restaurants",
    btn1: "Order Now",
    btn2: "View Menu",
  },
];

const heroIcons = [
  { img: rideImg, label: "Ride Hailing", route: "/ride-hailing" },
  { img: foodImg, label: "Food Delivery", route: "/food-delivery" },
  { img: shopImg, label: "E-commerce", route: "/ecommerce" },
  { img: mechImg, label: "Auto Maintenance", route: "/auto-maintenance" },
  { img: deliveryImg, label: "Service Apartments", route: "/service-apartments" },
  { img: oilGasImg, label: "General Services", route: "/general-services" },
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [animTarget, setAnimTarget] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselItems.length);
    }, 3000);

    // Synchronize the orbit animation with carousel timing
    const animInterval = setInterval(() => {
      setAnimTarget((prev) => (prev + 1) % heroIcons.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(animInterval);
    };
  }, []);

  if (isMobile) {
    return (
      <section className="relative min-h-screen w-full text-white overflow-hidden bg-gradient-to-br from-[#043873] via-[#3B82F6] to-purple-600">
        {/* Mobile Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={mobileBg}
            alt="Mobile background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Add padding top to account for fixed header */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8 pt-32">
          {/* Header Text */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 text-white leading-tight">
              Your Trusted
              <span className="block bg-gradient-to-r from-yellow-400 via-[#F76300] to-red-500 bg-clip-text text-transparent">
                Marketplace
              </span>
              <span className="block text-2xl mt-2">
                & Services Platform
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-sm mx-auto">
              {carouselItems[current].sub}
            </p>
          </div>

          {/* Orbit Animation */}
          <div className="mb-12">
            <MobileOrbit icons={heroIcons} activeIndex={animTarget} />
          </div>

          {/* Active Service Label */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white">
              {heroIcons[animTarget].label}
            </h2>
          </div>

          {/* Service Buttons Grid */}
          <ServiceButtonsGrid />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-screen w-full text-white overflow-hidden bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${bgGif})`,
      }}
    >
      {/* Desktop Carousel Text - Moved down to avoid overlap */}
      <DesktopCarousel currentItem={carouselItems[current]} />

      {/* Desktop Service Buttons - Moved down to avoid overlap */}
      <DesktopServiceButtons heroIcons={heroIcons} animTarget={animTarget} />
    </section>
  );
};

export default Hero;
