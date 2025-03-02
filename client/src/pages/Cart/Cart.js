import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, updateQuantity } from '../../store/slice/cart.slice';
import { findMyDetails } from '../../utils/Api';
import { Helmet } from 'react-helmet';

const Cart = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart) || [];
    const { wishlist } = useSelector((state) => state.whishlist);
    const [user, setUser] = useState(true)
    const findMyDetailsFor = async () => {
        const token = sessionStorage.getItem('token_login')
        if (token) {
            setUser(true)
        } else {
            setUser(false)
        }
    }



    useEffect(() => {
        findMyDetailsFor()
    }, [cart])
    const filteredWishlist = wishlist.filter(
        (wishItem) => !cart.some((cartItem) => cartItem.product_id === wishItem.product._id)
    );

    const calculateTotal = () => {
        if (!Array.isArray(cart)) {
            return 0; // Return 0 if cart is not an array
        }
    
        return cart.reduce((total, item) => total + (item.price_after_discount * item.Qunatity), 0);
    };
    

    const handleQuantityUpdate = (id, variant, newQuantity) => {
       
        dispatch(updateQuantity({ id, variant, quantity: newQuantity }));
    };
    const handleAddToCart = (product) => {
     
        const selected = {
            product_id: product._id,
            product_name: product.product_name,
            price: product.isVarient ? product.Varient[0].price : product.price,
            discount_percentage: product.isVarient ? product.Varient[0].discount_percentage : 0,
            price_after_discount: product.isVarient ? product.Varient[0].price_after_discount : product.afterDiscountPrice,
            isVarient: product.isVarient,
            Qunatity: 1,
            variant: product.isVarient ? product.Varient[0].quantity : null,
            variantId: product.isVarient ? product.Varient[0]._id : null,

            image: product?.ProductMainImage?.url,
        }

        dispatch(addProduct(selected));

        // console.log('Added to cart:', {
        //   product: product.product_name,
        //   quantity,
        //   variant: product.isVarient ? product.Varient[selectedVariant].quantity : null,
        // });
    };

    return (
        <>
          <Helmet>
                        <title>Cart - Healthy Dry Fruits & Nuts Online</title>
                      
                    </Helmet>
        
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">


                <div className="flex flex-col lg:flex-row gap-8 relative">
                    {/* Scrollable left side */}
                    <div className="lg:w-2/3 w-full space-y-8 overflow-y-auto" >
                        {/* Cart Items */}
                        {cart.length > 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Cart Items ({cart.length})
                                </h2>
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <div
                                            key={item.product_id}
                                            className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                                        >
                                            <div className="relative group">
                                                <img
                                                    src={item.image}
                                                    alt={item.product_name}
                                                    className="w-32 h-32 object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <h3 className="font-semibold text-lg text-gray-800">{item.product_name}</h3>
                                                <p className="text-gray-600 text-sm">{item.variant}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-400 line-through text-sm">₹{item.price}</span>
                                                    <span className="text-lg font-bold text-green-600">₹{item.price_after_discount}</span>
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                        {Math.round((item.price - item.price_after_discount) / item.price * 100)}% OFF
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => handleQuantityUpdate(item.product_id, item.variant, item.Qunatity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-medium transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 py-1 border-x-2 border-gray-200 font-semibold">
                                                        {item.Qunatity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityUpdate(item.product_id, item.variant, item.Qunatity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-medium transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleQuantityUpdate(item.product_id, item.variant, 0)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                                <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                    Start Shopping
                                </button>
                            </div>
                        )}

                        {/* Wishlist Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                                        My Wishlist
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Items you've saved for later</p>
                                </div>
                                <div className="bg-green-50 rounded-full px-4 py-2">
                                    <span className="text-green-600 font-semibold">{filteredWishlist.length} items</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {filteredWishlist.map((item) => (
                                    <div
                                        key={item._id}
                                        className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-green-200"
                                    >
                                        <div className="relative overflow-hidden rounded-lg mb-4">
                                            <img
                                                src={item.product.ProductMainImage.url}
                                                alt={item.product.product_name}
                                                className="w-full h-26 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {Math.round((item.product.price - item.product.afterDiscountPrice) / item.product.price * 100)}% OFF
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                                                {item.product.product_name}
                                            </h3>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-gray-400 line-through text-sm">₹{item.product.price}</span>
                                                <span className="text-lg font-bold text-green-600">₹{item.product.afterDiscountPrice}</span>
                                            </div>

                                            <button onClick={() => handleAddToCart(item.product)} className="w-full bg-white border-2 border-green-600 text-green-600 py-2.5 rounded-lg font-semibold 
                        hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 group">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 transform group-hover:rotate-12 transition-transform"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                    />
                                                </svg>
                                                <span>Move to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredWishlist.length === 0 && (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-16 w-16 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                                    <p className="mt-1 text-gray-500">Start saving items you love!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fixed right side */}
                    <div className="lg:w-1/3 lg:sticky lg:top-8 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>₹40</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (18%)</span>
                                    <span>₹{Math.round(calculateTotal() * 0.18)}</span>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-green-600">₹{calculateTotal() + 40 + Math.round(calculateTotal() * 0.18)}</span>
                                    </div>
                                </div>
                            </div>
                            {user ? (
                                <button
                                    onClick={() => window.location.href = '/procced-to-checkout'}
                                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    disabled={cart.length === 0}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"

                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    Login to Checkout
                                </button>
                            )}

                        </div>

                        {/* Checkout Steps */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6">Checkout Steps</h2>
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold">Shopping Cart</h3>
                                        <p className="text-sm text-gray-500">Review your items</p>
                                    </div>
                                </div>
                                {[
                                    { step: 2, title: 'Shipping Details', desc: 'Add delivery address' },
                                    { step: 3, title: 'Payment', desc: 'Choose payment method' },
                                    { step: 4, title: 'Confirmation', desc: 'Complete your order' }
                                ].map(({ step, title, desc }) => (
                                    <div key={step} className="flex items-center opacity-50">
                                        <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                                            {step}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-semibold">{title}</h3>
                                            <p className="text-sm text-gray-500">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Cart;
