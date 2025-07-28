import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CarouselItem {
  sub: string;
  btn1: string;
  btn2: string;
}

interface DesktopCarouselProps {
  currentItem: CarouselItem;
}

const DesktopCarousel: React.FC<DesktopCarouselProps> = ({ currentItem }) => {
  const navigate = useNavigate();
  const { sub, btn1, btn2 } = currentItem;

  return (
    <div className="absolute bottom-[15%] left-[18%] z-10 max-w-md">
      <p className="text-base text-white/90 mb-6 leading-relaxed">
        {sub}
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/signup')}
          className="bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {btn1}
        </button>
        <button 
          onClick={() => navigate('/signup')}
          className="bg-[#F76300] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {btn2}
        </button>
      </div>
    </div>
  );
};

export default DesktopCarousel;