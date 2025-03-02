import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Card from '../../components/Card/Card'
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronRight, Home, PackageSearch } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import Button from '../../components/Button/Button';
import { Helmet } from 'react-helmet';

const Product_sub = () => {
    const { id, category } = useParams()
    const [data, setData] = useState([])

    const fetchData = async () => {

        try {
            const response = await axios.get(`https://api.dyfru.com/api/v1/get-product/by-sub-category/${id}`)

            const productData = response?.data?.data || []
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
    }, [id])

    const EmptyState = () => (
        <div className="flex z-[99] flex-col items-center justify-center py-12 px-4 text-center">
            <PackageSearch className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Found in Sub {category}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
                We're sorry, but it looks like this category is empty right now.
                Check back soon as we're always adding new products! 🌱
            </p>
            <Link
                to="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Explore Other Categories
            </Link>
        </div>
    )

    return (

        <>
            <Helmet>
                <title>{`${category} - Dyfru`}</title>
                {/* <meta name="description" content={product.product_description} /> */}

            </Helmet>
            <section className={`relative py-16 px-0 bg-[#e8f4ec]`}>
                <div className="absolute inset-0 opacity-30" />

                <div className="max-w-[1400px] mx-auto px-4">
                    {/* Breadcrumbs */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li className="flex items-center">
                                <Link
                                    to="/"
                                    className="text-gray-600 hover:text-green-600 flex items-center"
                                >
                                    <Home className="w-4 h-4 mr-1" />
                                    Home
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                                <Link
                                    to="/categories"
                                    className="text-gray-600 hover:text-green-600"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                                <span className="text-green-600 font-medium">
                                    {category}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    <div className="flex flex-col space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between flex-col md:flex-row gap-7 md:gap-0">
                            <div className="relative">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    {category}
                                </h2>
                                <div className="absolute -bottom-2 left-0 w-2/3 h-1 bg-gradient-to-r from-green-600 to-green-400" />
                            </div>
                            {/* <Button title={'View All'} /> */}
                        </div>

                        {data.length === 0 ? (
                            <EmptyState />
                        ) : (
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
                                        {data.map((product, index) => (
                                            <SwiperSlide key={index}>
                                                <Card {...product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                <div className="grid md:hidden grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    {data.map((product) => (
                                        <Card key={product._id} {...product} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Product_sub