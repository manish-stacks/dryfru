import React from 'react';
import cashew from './cashew.png'

const ProductShow = () => {
    return (
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FDF6F0] to-[#F5E6D8] p-8 md:p-12">
          {/* Left Content */}
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-1/2 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-[#B88E65] text-sm font-medium">Dry Process</span>
                  <span className="text-[#B88E65] text-sm font-medium">Organic</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif text-[#2D2D2D]">Cashews</h1>
              </div>
              
              {/* <div className="inline-block">
                <span className="bg-[#B88E65] text-white text-xs font-bold px-3 py-1 rounded-full">
                  HOT
                </span>
                <span className="ml-3 text-xl text-[#B88E65] font-medium">
                  BUY 1 GET 1 FREE
                </span>
              </div> */}
              
              <p className="text-gray-600 max-w-md">
                Premium hand-selected cashews, carefully processed to preserve their natural flavor and nutritional benefits. Perfect for snacking or culinary creations.
              </p>
              
              <button onClick={()=>window.location.href=`/productpage/6780fae573f5c96b00a45915`} className="px-8 py-3 border-2 border-[#B88E65] text-[#B88E65] rounded-full hover:bg-[#B88E65] hover:text-white transition-colors duration-300 font-medium">
                SHOP NOW
              </button>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <img 
                  src={cashew} 
                  alt="Premium Cashews" 
                  className="w-full h-auto object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-4 -right-4 bg-[#B88E65] text-white px-6 py-2 rounded-full text-sm font-medium">
                  Premium Quality
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B88E65] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#B88E65] opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export default ProductShow
