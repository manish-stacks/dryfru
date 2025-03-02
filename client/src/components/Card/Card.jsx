import React, { useEffect, useState } from 'react';
import { Heart, IndianRupee, ChevronDown, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, fetchWishlist } from '../../store/slice/whishlist';
const Card = ({ product_name, tag, discount, ProductMainImage, price, isVarient, Varient, weight, _id }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { wishlist } = useSelector((state) => state.whishlist)

    const dispatch = useDispatch()
    const [selectedWeight, setSelectedWeight] = useState(weight);
    const [isHovered, setIsHovered] = useState(false);
    const [mprice, setPrice] = useState({
        main_price: 0,
        discount_price: 0
    })

    const [isInWishlist, setIsInWishlist] = useState(false);

    const add = (id) => {
        // dispatch(addToWishlist({ item: id }))
        dispatch(fetchWishlist())
    }
    useEffect(() => {

        const productInWishlist = wishlist.some((item) => item?.product?._id === _id);
        setIsInWishlist(productInWishlist);
    }, []);

    useEffect(() => {
        if (isVarient) {
            setSelectedWeight(Varient[0]?.quantity)
        }
    }, [])

    useEffect(() => {
        if (isVarient) {
            const CheckVarient = Varient.find((item) => item.quantity === selectedWeight)
            if (CheckVarient) {
                setPrice({
                    main_price: CheckVarient?.price,
                    discount_price: CheckVarient?.price_after_discount || 100
                })
            }
        }
    }, [selectedWeight])


    const discountedPrice = price - (price * discount) / 100;

    return (
        <div
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsDropdownOpen(false);
            }}
        >

            {discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-green-600 text-white text-sm font-semibold px-2 py-1 rounded-full">
                        -{discount}%
                    </div>
                </div>
            )}

            {/* Wishlist Button */}
            <button type='button' onClick={() => add(_id)} className={`absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors`}>
                <Heart
                    className={`w-4 h-4 text-gray-600 hover:text-red-500 transition-colors ${isInWishlist ? 'fill-red-400' : ''}`}
                />
            </button>

            {/* Image */}
            <div onClick={() => window.location.href = `/productpage/${_id}?name=${product_name}`} className="relative cursor-pointer overflow-hidden rounded-t-2xl aspect-square">
                <img
                    src={ProductMainImage?.url}
                    alt={product_name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div onClick={() => window.location.href = `/productpage/${_id}?name=${product_name}`} className="p-4 cursor-pointer space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {product_name}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center text-green-600 font-bold">
                            <IndianRupee className="w-4 h-4" />
                            <span>{isVarient ? mprice?.discount_price : discountedPrice}</span>

                        </div>
                        {discount > 0 && (
                            <div className="flex items-center text-gray-400 text-sm line-through">
                                <IndianRupee className="w-3 h-3" />
                                <span>{isVarient ? mprice?.main_price : price}</span>

                            </div>
                        )}
                    </div>

                    {/* Weight Selector */}
                    {isVarient && (

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                            >
                                {selectedWeight}
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-100">
                                    {Varient.map((w) => (
                                        <button
                                            key={w}
                                            onClick={() => {
                                                setSelectedWeight(w.quantity);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-green-50 hover:text-green-600"
                                        >
                                            {w.quantity}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="font-medium">Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default Card;