import React from 'react';
import { Nut } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-amber-50">
      <div className="relative">
        {/* Main spinning nut */}
        <div className="animate- text-center flex items-center justify-center">
          <Nut className="w-16 h-16 text-amber-700" />
        </div>
        
        {/* Floating nuts animation */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`absolute animate-float-nuts opacity-70
                ${index % 2 === 0 ? 'text-amber-600' : 'text-amber-800'}
              `}
              style={{
                left: `${(index * 20)}%`,
                animationDelay: `${index * 0.3}s`,
                top: '0'
              }}
            >
              <Nut className="w-6 h-6" />
            </div>
          ))}
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <p className="text-amber-800 font-medium text-lg animate-pulse">
            Loading natural goodness...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;