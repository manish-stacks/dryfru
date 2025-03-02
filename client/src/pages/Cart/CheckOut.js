import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { findMyLastOrder, findSettings } from '../../utils/Api';
import {
    Ticket,
    X,
    Tag,
    Percent,
    IndianRupee,
    Calendar,
    CheckCircle,
    ArrowDown,
    Truck,
    Receipt,
    CreditCard,
    MapPin,
    FileText
} from 'lucide-react';
import axios from 'axios';

const CheckOut = () => {
    // State management
    const { cart } = useSelector((state) => state.cart);
    const [paymentMethod, setPaymentMethod] = useState('ONLINE');
    const [lastUsedAddress, setLastUsedAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [settings, setSettings] = useState(null);
    const [sideModel, setSideModel] = useState(false);
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [allCoupons, setAllCoupons] = useState([]);
    const [couponLoading, setCouponLoading] = useState(false);
    const [formData, setFormData] = useState({
        addressLine: '',
        city: '',
        state: '',
        postCode: '',
        mobileNumber: ''
    });

    // Calculate order totals
    const calculateTotal = () => {
        const subtotal = cart.reduce((total, item) => total + (item.price_after_discount * item.Qunatity), 0);

        const shipping = settings?.shippingEnabled
            ? (subtotal >= settings?.freeShippingThreshold ? 0 : settings?.shippingCost)
            : 0;

        const tax = settings?.isTaxEnables
            ? Math.round(subtotal * (settings?.taxRate / 100))
            : 0;

        // Total before discount
        let total = subtotal + shipping + tax;

        if (paymentMethod === 'ONLINE') {
            const discountAmount = total * 0.05;
            total -= discountAmount;
            return {
                subtotal,
                shipping,
                tax,
                total,
                discount: 5,
                discountAmount
            };
        }

        return {
            subtotal,
            shipping,
            tax,
            total,
            discount: 0,
            discountAmount: 0
        };
    };


    const [totalDetails, setTotalDetails] = useState(calculateTotal());

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [orderData, siteSettings] = await Promise.all([
                    findMyLastOrder(),
                    findSettings()
                ]);
                setSettings(siteSettings);
                setLastUsedAddress(orderData.shipping);
            } catch (err) {
                setError('Welcome! Please add your shipping address to continue.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        fetchCoupons();
    }, []);

    // Update totals when cart or settings change
    useEffect(() => {
        setTotalDetails(calculateTotal());
    }, [paymentMethod, cart, settings]);

    // Handle coupon application
    const handleApplyCoupon = async () => {
        if (!couponCode) {
            setCouponError('Please enter a coupon code');
            return;
        }

        try {
            setCouponLoading(true);
            setCouponError('');

            if (couponApplied) {
                setTotalDetails(calculateTotal());
                setCouponApplied(false);
                return;
            }

            const response = await axios.post('https://api.dyfru.com/api/v1/apply-coupon', {
                code: couponCode,
                orderAmount: totalDetails.total
            });

            if (response.data.message === "Coupon applied successfully.") {
                setTotalDetails(prev => ({
                    ...prev,
                    discount: response.data.discount,
                    discountAmount: response.data.discountAmount,
                    total: response.data.finalAmount
                }));
                setCouponApplied(true);
            }
        } catch (error) {
            setCouponError(error?.response?.data?.message || 'Failed to apply coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    // Fetch available coupons
    const fetchCoupons = async () => {
        try {
            const response = await axios.get('https://api.dyfru.com/api/v1/get-coupon');
            setAllCoupons(response?.data?.data.filter(item => item.isActive));
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            items: cart,
            totalAmount: totalDetails.total,
            payAmt: totalDetails.total,
            paymentType: paymentMethod,
            isVarientInCart: cart.some(item => item.variant),
            shipping: formData,
            status: 'pending',
            orderNote
        };

        setLoading(true);
        try {
            const token = sessionStorage.getItem('token_login');
            if (!token) {
                setError('Please log in to continue');
                return;
            }

            const { data } = await axios.post(
                'https://api.dyfru.com/api/v1/add-order',
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log(data);
            const { razorpayOrderId, amount, currency } = data;

            if (paymentMethod === 'ONLINE') {
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                    amount: amount * 100,
                    currency: currency,
                    name: "Seizel Sixth India Private Limited",
                    description: "Payment for order",
                    order_id: razorpayOrderId,
                    image: "https://i.ibb.co/tftKFYc/android-chrome-192x192.png",
                    theme: {
                        color: "#005D31",
                    },
                    handler: function (response) {
                        setLoading(true)
                        axios.post("https://api.dyfru.com/api/v1/verify-payment", response)
                            .then(responseData => {
                                if (responseData.data.success) {
                                    setLoading(false)
                                    window.location.href = responseData.data.redirectUrl;
                                } else {
                                    setLoading(false)
                                    setError('Payment failed. Please try again.');
                                }
                            })
                            .catch(err => {
                                setLoading(false)
                                console.error('Payment verification failed:', err);
                                setError('Payment verification failed. Please try again.');
                            });

                        console.log("Payment Successful", response);
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();

            } else {
                // Redirect to order success page
                setTimeout(() => {
                    window.location.href = `/Receipt/order-confirmed?id=${data.order?._id}&success=true&data=${data.order?.orderId}`;
                }, 2000);
            }
            setLoading(false);

        } catch (error) {
            setLoading(false);
            setError('Failed to place order. Please try again.');
        }
    };




    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
                    <Receipt className="w-8 h-8 mr-3" />
                    Checkout
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Shipping Address
                                </h2>
                                {lastUsedAddress && (
                                    <button
                                        onClick={() => setFormData(lastUsedAddress)}
                                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                                    >
                                        Use Last Address
                                    </button>
                                )}
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Line
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine"
                                        value={formData.addressLine}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            addressLine: e.target.value
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                city: e.target.value
                                            }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                state: e.target.value
                                            }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Post Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postCode"
                                            value={formData.postCode}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                postCode: e.target.value
                                            }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                mobileNumber: e.target.value
                                            }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                {settings?.onlinePaymentAvailable && (
                                    <label className="flex items-center p-6 border rounded-lg cursor-pointer hover:border-green-500 transition-colors shadow-md">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="ONLINE"
                                            checked={paymentMethod === 'ONLINE'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="h-5 w-5 text-green-600 focus:ring-green-500 transition-colors"
                                        />
                                        <div className="ml-4 flex flex-col">
                                            <span className="text-lg font-semibold text-gray-800">Online Payment</span>
                                            <span className="text-sm text-gray-600 mt-1">Do Online Payment And Get a 5% Off On Order Value</span>
                                            <div className="mt-2 flex items-center">
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
                                                    Exclusive Offer
                                                </span>
                                            </div>
                                        </div>
                                    </label>

                                )}

                                {settings?.codAvailable && (
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-3">Cash on Delivery</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Order Note */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Order Note (Optional)
                            </h2>
                            <textarea
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                rows="3"
                                placeholder="Add any special instructions for your order..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            {/* Coupon Section */}
                            {settings?.copounEnables && (
                                <div className="mb-6">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {couponLoading ? 'Applying...' : couponApplied ? 'Remove' : 'Apply'}
                                        </button>
                                    </div>

                                    {couponError && (
                                        <p className="text-red-600 text-sm mt-2">{couponError}</p>
                                    )}

                                    {couponApplied && (
                                        <p className="text-green-600 text-sm mt-2">
                                            Coupon applied successfully!
                                        </p>
                                    )}

                                    <button
                                        onClick={() => setSideModel(true)}
                                        className="text-sm text-green-600 hover:text-green-700 mt-2 underline"
                                    >
                                        View Available Coupons
                                    </button>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalDetails.subtotal.toFixed(2)}</span>
                                </div>

                                {settings?.shippingEnabled && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>₹{totalDetails.shipping.toFixed(2)}</span>
                                    </div>
                                )}

                                {settings?.isTaxEnables && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax ({settings.taxRate}%)</span>
                                        <span>₹{totalDetails.tax.toFixed(2)}</span>
                                    </div>
                                )}

                                {couponApplied && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({totalDetails.discount}%)</span>
                                        <span>-₹{totalDetails.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {paymentMethod === 'ONLINE' && (
                                    <div className="flex justify-between text-green-600">
                                        <span>5% Discount Applied for Online Payment. Thank you for choosing us!</span>
                                    </div>
                                )}


                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-green-600">₹{totalDetails.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>


                            {/* Place Order Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>

                            {/* Order Items */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-700 mb-3">
                                    Order Items ({cart.length})
                                </h3>
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="flex items-center space-x-3">
                                            <img
                                                src={item.image}
                                                alt={item.product_name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{item.product_name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.Qunatity}</p>
                                            </div>
                                            <span className="text-sm font-medium">
                                                ₹{(item.price_after_discount * item.Qunatity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Sidebar */}
            {sideModel && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSideModel(false)}
                >
                    <div
                        className="fixed right-0 top-0 h-screen w-full md:w-96 bg-white shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <Ticket className="w-5 h-5 mr-2" />
                                    Available Coupons
                                </h2>
                                <button
                                    onClick={() => setSideModel(false)}
                                    className="text-white hover:bg-white/20 rounded-full p-1"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                            {allCoupons.length > 0 ? (
                                <div className="space-y-4">
                                    {allCoupons.map((coupon) => (
                                        <div
                                            key={coupon._id}
                                            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                        <Tag className="w-4 h-4 mr-2 text-green-600" />
                                                        {coupon.code}
                                                    </h3>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium text-green-600">
                                                                {coupon.discount}% OFF
                                                            </span>
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Min order: ₹{coupon.minimumOrderAmount}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Expires: {new Date(coupon.expirationDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setCouponCode(coupon.code);
                                                    handleApplyCoupon();
                                                    setSideModel(false);
                                                }}
                                                className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Apply Coupon
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <ArrowDown className="w-16 h-16 mb-4 text-gray-400" />
                                    <p className="text-lg font-medium">No Coupons Available</p>
                                    <p className="text-sm text-center mt-1">
                                        Check back later for exciting offers!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckOut;