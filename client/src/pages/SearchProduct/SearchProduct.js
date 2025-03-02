import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
const SearchProduct = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const query = searchParams.get("query") || "";
      const page = searchParams.get("page") || 1;

      try {
        const response = await axios.get(
          `https://api.dyfru.com/api/v1/search_product_and_filter?query=${query}&page=${page}`
        );

        if (response.data.success) {
          setProducts(response.data.data);
          setMessage(response.data.message);
          setTotalPages(response.data.totalPages || 1);
          setCurrentPage(Number(page));
        } else {
          setMessage("Something went wrong while fetching products.");
        }
      } catch (error) {
        setMessage("Error fetching products. Please try again later.");
      }
      setLoading(false);
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div className="p-4">
      <div className="flex mb-12 items-center justify-between flex-col md:flex-row gap-7 md:gap-0">
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {message}
          </h2>
          <div className="absolute -bottom-2 left-0 w-2/3 h-1 bg-gradient-to-r from-green-600 to-green-400" />
        </div>
    
      </div>


      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <>

          <div className='hidden md:flex'>
            <Swiper
              spaceBetween={10}
              freeMode={true}
              autoplay={{
                delay: 9000000000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
              pagination={{ clickable: true }}
              modules={[FreeMode, Autoplay]}
              className="mySwiper"
            >
              {products && products.length === 0 ? (
                <p>No Data Found</p>
              ) : (
                products.map((product, index) => (
                  <SwiperSlide key={index}>
                    <Card  {...product} />
                  </SwiperSlide>
                ))
              )}

            </Swiper>
          </div>

          <div className="grid md:hidden grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Card key={product._id} {...product} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-red-500">No products found.</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => window.location.href = `/Search-Product?query=${searchParams.get("query")}&page=${i + 1}`}
              className={`px-4 py-2 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
