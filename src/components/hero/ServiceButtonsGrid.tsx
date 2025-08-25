import React from "react";
import { useNavigate } from "react-router-dom";

interface ServiceButton {
  label: string;
  route: string;
  bgColor: string;
}

const ServiceButtonsGrid: React.FC = () => {
  const navigate = useNavigate();

  const serviceButtons: ServiceButton[] = [
    { label: "Ride Hailing", route: "/ride-hailing", bgColor: "bg-[#3B82F6] text-white" },
    { label: "Food Delivery", route: "/food-delivery", bgColor: "bg-[#F76300] text-white" },
    { label: "E-commerce", route: "/ecommerce", bgColor: "bg-[#043873] text-white" },
    { label: "Auto Maintenance", route: "/auto-maintenance", bgColor: "bg-[#4F9CF9] text-white" },
    { label: "Service Apartments", route: "/service-apartments", bgColor: "bg-[#36C6FF] text-white" },
    { label: "General Services", route: "/general-services", bgColor: "bg-[#FFE492] text-[#043873]" },
  ];

  const handleButtonClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
      {serviceButtons.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.route)}
          className={`${button.bgColor} py-4 px-6 rounded-2xl font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default ServiceButtonsGrid;
