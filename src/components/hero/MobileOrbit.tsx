import React, { useEffect, useState } from "react";

interface MobileOrbitProps {
  icons: Array<{ img: string; label: string }>;
  activeIndex: number;
}

const MobileOrbit: React.FC<MobileOrbitProps> = ({ icons, activeIndex }) => {
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    // Calculate rotation based on active index
    const anglePerStep = 360 / icons.length;
    const targetAngle = -activeIndex * anglePerStep;
    setRotationAngle(targetAngle);
  }, [activeIndex, icons.length]);

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* SVG Orbit Path */}
      <svg 
        className="absolute inset-0 w-full h-full orbitPath" 
        viewBox="0 0 320 320"
        style={{ transform: `rotate(${rotationAngle}deg)`, transition: 'transform 0.8s ease-in-out' }}
      >
        <defs>
          <path 
            id="orbit-path" 
            d="M 160,40 A 120,120 0 1,1 159.9,40" 
            fill="none" 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </defs>
        <use href="#orbit-path" />
      </svg>

      {/* Service Icons on Orbit */}
      {icons.map((icon, index) => {
        const angle = (index * 360) / icons.length;
        const radian = (angle * Math.PI) / 180;
        const radius = 120;
        const x = 160 + radius * Math.cos(radian - Math.PI/2);
        const y = 160 + radius * Math.sin(radian - Math.PI/2);
        
        const isActive = index === activeIndex;
        
        return (
          <div
            key={index}
            className={`absolute w-12 h-12 transition-all duration-500 serviceIcon ${
              isActive ? 'scale-125 z-10' : 'scale-90 opacity-70'
            }`}
            style={{
              left: `${x - 24}px`,
              top: `${y - 24}px`,
              transform: `rotate(${-rotationAngle}deg)`, // Counter-rotate to keep icons upright
            }}
          >
            <div className={`w-full h-full rounded-full bg-white p-2 shadow-lg ${
              isActive ? 'ring-2 ring-[#F76300]' : ''
            }`}>
              <img 
                src={icon.img} 
                alt={icon.label}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        );
      })}

      {/* Center Active Icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 bg-white rounded-full p-3 shadow-xl ring-4 ring-[#F76300]">
          <img 
            src={icons[activeIndex].img} 
            alt={icons[activeIndex].label}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileOrbit;
