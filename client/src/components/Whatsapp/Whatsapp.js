import React, { useState } from "react";

const WhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = "9220406427";
    const message = "Hello! Dyfru ";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <div
        className={`
          transform transition-all duration-300 ease-in-out
          ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
          bg-white rounded-lg shadow-lg p-4 max-w-xs
        `}
      >
        <div className="relative">
          <div className="text-gray-800 font-medium mb-1">Need Help?</div>
          <div className="text-gray-600 text-sm">Chat with us on WhatsApp</div>
          {/* Arrow */}
          <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
            <div className="border-8 border-transparent border-l-white" />
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className={`
          relative group
          bg-[#25D366] hover:bg-[#22c55e]
          rounded-full p-3.5
          transform transition-all duration-300 ease-in-out
          hover:scale-110 active:scale-95
          shadow-lg hover:shadow-xl
          ${isHovered ? 'rotate-12' : 'rotate-0'}
        `}
      >
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-25" />
        
        {/* WhatsApp Icon */}
        <svg
          className="w-8 h-8 text-white transform transition-transform group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"
          />
        </svg>
      </button>
    </div>
  );
};

export default WhatsApp;