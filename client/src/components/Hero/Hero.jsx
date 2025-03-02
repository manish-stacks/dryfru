import React from 'react';
import { ArrowRight, Leaf, Shield, Truck } from 'lucide-react';
import almonds from './almonds.png'
import { Link } from 'react-router-dom';
const Hero = () => {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden px-0 md:px-10">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[length:20px_20px]" />

            {/* Main Content */}
            <div className="relative container mx-auto px-4 pt-6 md:pt-24 pb-16 sm:pt-32 lg:pt-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full text-green-700 font-medium text-sm">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            New Collection Available
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
                            Organic Nuts &
                            <span className="block mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Premium Berries
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 max-w-xl">
                            Experience nature's finest selection of premium dried fruits and nuts.
                            Handpicked for quality, packed for freshness, delivered to your doorstep.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop" className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
                                Shop Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="grid sm:grid-cols-3 gap-6 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-50">
                                    <Leaf className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">100% Premium</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-50">
                                    <Shield className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Quality Assured</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-50">
                                    <Truck className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative z-50 ">
                        {/* Main Product Image */}
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-green-900/20 transition-transform hover:scale-[1.02] duration-500">
                            <img
                                src="https://img.freepik.com/free-photo/dried-organic-fruits-assortment_114579-43492.jpg?t=st=1736404959~exp=1736408559~hmac=4fca682df55956c82eb645bc28c395983f22ce6d5e1aca531f950b61481e24b9&w=740"
                                alt="Premium Nuts Collection"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Floating Elements */}
                        <div className="hidden md:flex absolute top-8 -right-4 z-20 bg-white p-6 rounded-2xl shadow-xl transform rotate-6 animate-float">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-2xl">🌟</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Premium Quality</p>
                                    <p className="text-sm text-gray-500">Handpicked Selection</p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex absolute -bottom-4 -left-4 z-20 bg-white p-6 rounded-2xl shadow-xl transform -rotate-6 animate-float-delayed">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">🥜</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Fresh & Natural</p>
                                    <p className="text-sm text-gray-500">No Preservatives</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute hidden  h-full right-[-20%] top-[0%] w-full z-20 justify-end md:flex items-end" >
            <img src={almonds} className='w-3/5 h-full object-cover' alt="" />
            
            </div>


            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full blur-3xl opacity-30 -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-orange-100 to-yellow-50 rounded-full blur-3xl opacity-30 -z-10" />
        </section>
    );
};

export default Hero;