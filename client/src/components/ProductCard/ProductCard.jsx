import React, { useEffect, useState } from 'react';

import Card from '../Card/Card';
import Button from '../Button/Button';

import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';


function ProductCard({bg=true , title='Explore Our Categories'}) {
    const [data, setData] = useState([])

    const fetchData = async () => {
        try {
            const response = await axios.get('https://api.dyfru.com/api/v1/get-product')
            console.log(response.data)
            const productData = response?.data?.products || []
            if (productData.length === 0) {
                setData([])
            } else {
                setData(productData)
            }

        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    
    return (
        <section className={`relative py-16  px-0  ${bg ? 'bg-[#e8f4ec] md:px-8 ':' md:px-0'} `} >
          
            <div className="absolute inset-0  opacity-30" />

            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex flex-col space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-col md:flex-row gap-7 md:gap-0">
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {title}
                            </h2>
                            <div className="absolute -bottom-2 left-0 w-2/3 h-1 bg-gradient-to-r from-green-600 to-green-400" />
                        </div>
                        <Button title={'View All'} />
                    </div>

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
                            {data && data.length === 0 ? (
                                <p>No Data Found</p>
                            ) : (
                                data.map((product, index) => (
                                    <SwiperSlide key={index}>
                                        <Card  {...product} />
                                    </SwiperSlide>
                                ))
                            )}

                        </Swiper>
                    </div>

                    <div className="grid md:hidden grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {data.map((product) => (
                            <Card key={product._id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductCard
