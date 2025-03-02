import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Testimonial() {
  const baseUrl = "https://api.dyfru.com/api/v1/testimonial";
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      setTestimonials(response.data.testimonials);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= Math.ceil(testimonials.length / 2) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.ceil(testimonials.length / 2) - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getAvatarUrl = (gender) => {
    return gender === 'female' 
      ? 'https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?t=st=1739260088~exp=1739263688~hmac=52c4efb6c2d636bdaa8a1676a83a7cbf04adae6657b7e079af21fd27b12ff8b4&w=360'
      : 'https://img.freepik.com/free-vector/man-red-shirt-with-white-collar_90220-2873.jpg?t=st=1739260112~exp=1739263712~hmac=15970e9327611994d1672134d8d018312fabefa005dae4741a2fe303c256cb74&w=740';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F4EC] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-green-200 rounded w-48"></div>
          <div className="h-4 bg-green-200 rounded w-64"></div>
          <div className="h-4 bg-green-200 rounded w-52"></div>
        </div>
      </div>
    );
  }

  const totalSlides = Math.ceil(testimonials.length / 2);

  return (
    <div className="min-h-screen bg-[#E8F4EC] py-20 px-4 md:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#005D31] max-w-2xl mx-auto">
            Discover why health enthusiasts and food lovers choose our premium dry fruits and nuts for their daily nutrition
          </p>
        </div>

        <div className="relative">
          {testimonials.length > 2 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-[#005D31]" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-[#005D31]" />
              </button>
            </>
          )}

          <div className=" overflow-hidden">
            <div 
              className="flex  transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 px-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {testimonials.slice(slideIndex * 2, slideIndex * 2 + 2).map((testimonial) => (
                    <div
                      key={testimonial._id}
                      className="bg-white mt-5 rounded-2xl p-8 shadow-xl transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div className="relative mb-8">
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
                          <div className="relative">
                            <img
                              src={getAvatarUrl(testimonial.gender)}
                              alt={testimonial.name}
                              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <Quote className="absolute -bottom-2 -right-2 w-8 h-8 text-[#005D31] bg-white rounded-full p-1.5 shadow-md" />
                          </div>
                        </div>
                      </div>

                      <div className="text-center mt-8">
                        <h3 className="font-semibold text-xl text-gray-800">
                          {testimonial.name}
                        </h3>
                        
                        <div className="flex justify-center gap-1 my-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${
                                i < testimonial.rating 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-600 text-lg italic mb-4">
                          "{testimonial.message}"
                        </p>

                        <p className="text-sm text-[#005D31] font-medium">
                          {testimonial.whatPurchased}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 2 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? "bg-[#005D31] w-6" 
                      : "bg-[#005D31]/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <p className="text-black font-medium mb-4">
            Join our satisfied customers
          </p>
          <button 
            onClick={() => window.location.href="/shop"} 
            className="bg-[#005D31] hover:bg-[#004D28] text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Shop Premium Dry Fruits
          </button>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;