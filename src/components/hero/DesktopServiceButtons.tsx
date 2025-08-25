import React from 'react';
import { useNavigate } from "react-router-dom";

interface ServiceIcon {
  img: string;
  label: string;
  route: string;
}

interface DesktopServiceButtonsProps {
  heroIcons: ServiceIcon[];
  animTarget: number;
}

const DesktopServiceButtons: React.FC<DesktopServiceButtonsProps> = ({ heroIcons, animTarget }) => {
  const navigate = useNavigate();

  const handleButtonClick = (route: string) => {
    navigate(route);
  };

  // Define the scattered layout pattern - updated to match your services
  const buttonLayout = [
    "Ride Hailing", "", "E-commerce",
    "", "Food Delivery", "",
    "Auto Maintenance", "", "General Services",
    "", "Service Apartments", ""
  ];

  // Define colors for each service based on your specification
  const colors: Record<string, string> = {
    "Ride Hailing": "bg-[#4F9CF9]/60 text-white",
    "Food Delivery": "bg-white text-[#043873]",
    "E-commerce": "bg-[#FF7B4E]/70 text-white",
    "Auto Maintenance": "bg-[#0A5BFF]/60 text-white",
    "Service Apartments": "bg-[#36C6FF]/60 text-white",
    "General Services": "bg-[#FFE492]/60 text-[#043873]",
  };

  // Create a mapping of service names to icons
  const iconMap = heroIcons.reduce((acc, icon) => {
    acc[icon.label] = icon;
    return acc;
  }, {} as Record<string, ServiceIcon>);

  // Get the currently animated service
  const animatedService = heroIcons[animTarget]?.label;

  return (
    <div className="absolute right-[6%] bottom-[15%] z-20">
      <div className="grid grid-cols-3 gap-y-4 gap-x-6">
        {buttonLayout.map((serviceName, idx) => {
          if (serviceName === "") {
            return <div key={idx} className="w-[160px] h-[40px]"></div>;
          }

          const service = iconMap[serviceName];
          if (!service) return null;

          const isAnimated = animatedService === serviceName;

          return (
            <div className="relative w-[160px] h-[40px]" key={idx}>
              {isAnimated && (
                <>
                  <div className="absolute top-[-10px] left-[-15px] w-[180px] h-[50px] z-0 animate-pulse bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-xl blur-sm" />
                  <div className="absolute bottom-[-10px] right-[-15px] w-[180px] h-[50px] z-0 animate-pulse bg-gradient-to-l from-orange-400/30 to-pink-400/30 rounded-xl blur-sm" />
                </>
              )}
              <button
                onClick={() => handleButtonClick(service.route)}
                className={`relative z-10 ${colors[service.label]} font-semibold px-4 py-2 rounded-[20px] w-full h-full flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm`}
              >
                {service.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopServiceButtons;
