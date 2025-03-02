import React, { useEffect, useState } from 'react';
import { ApiHandleLogout, findMyAllOrders, findMyDetails } from '../utils/Api';
import {
    User,
    Package,
    Calendar,
    Phone,
    Mail,
    Star,
    X,
    Truck,
    AlertCircle,
    LogOut,
    Settings,
    Lock,
    Edit,
    ShoppingBag,
    Heart,
    Clock,
    ChevronRight
} from 'lucide-react';
import Login from '../pages/Login/Login';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [loading, setLoading] = useState(true);  // Keep loading true until both data is fetched
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // To track authentication status

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await findMyDetails();
                const ordersData = await findMyAllOrders();
                setUserData(response);
                setOrders(ordersData);
                setLoading(false);  // Once data is fetched, set loading to false
                setIsAuthenticated(true); // User data fetched successfully, set authenticated status
            } catch (error) {
                console.error(error);
                setLoading(false);  // Set loading to false even in case of error
                setIsAuthenticated(false); // In case of error, set authenticated status to false
            }
        };
        fetchUserData();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleLogout = async () => {
        // Implement logout logic
        await ApiHandleLogout()
        sessionStorage.clear();
        window.location.href = '/';
        console.log('Logging out...');
    };

    const handleChangePassword = () => {
        // Implement change password logic
        console.log('Changing password...');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <div className="spinner-border text-blue-500" role="status" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        window.location.href = "/login";
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <ShoppingBag className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">My Profile</span>
                        </div>
                        <div className="flex items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center space-x-3 focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <span className="hidden md:block font-medium text-gray-700">{userData?.Name}</span>
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <button
                                            onClick={() => {/* Implement edit profile */ }}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                        >
                                            <Edit className="h-4 w-4 mr-3" />
                                            Edit Profile
                                        </button>
                                        <button
                                            onClick={handleChangePassword}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                        >
                                            <Lock className="h-4 w-4 mr-3" />
                                            Change Password
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Profile Overview */}
                <div className="mb-8 grid grid-cols-1 p-5 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <button className="text-blue-100 hover:text-white">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-blue-100">Total Orders</p>
                        <h3 className="text-3xl font-bold">{orders.length}</h3>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
                                <Clock className="h-6 w-6" />
                            </div>
                            <button className="text-purple-100 hover:text-white">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-purple-100">Pending Orders</p>
                        <h3 className="text-3xl font-bold">
                            {orders.filter(order => order.status === 'pending').length}
                        </h3>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
                                <Package className="h-6 w-6" />
                            </div>
                            <button className="text-green-100 hover:text-white">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-green-100">Completed Orders</p>
                        <h3 className="text-3xl font-bold">
                            {orders.filter(order => order.status === 'completed').length}
                        </h3>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Array.isArray(orders) && orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No orders found. Please check back later or place a new order!
                                        </td>
                                    </tr>
                                ) : Array.isArray(orders) && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.orderId || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {order.orderDate ? formatDate(order.orderDate) : "Unknown Date"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    ₹{order.totalAmount || "0"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status ? getStatusColor(order.status) : "bg-gray-300"
                                                        }`}
                                                >
                                                    {order.status || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    >
                                                        <Truck className="h-4 w-4 mr-1" />
                                                        Track
                                                    </button>
                                                    {order.status === "completed" && !order.OrderProcessRating && (
                                                        <button className="text-green-600 hover:text-green-900 flex items-center">
                                                            <Star className="h-4 w-4 mr-1" />
                                                            Review
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-red-500">
                                            Unable to fetch orders. Please try again later.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-[999] bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Order Tracking</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Package className="h-5 w-5 text-blue-600 mr-2" />
                                    <span className="font-medium">Order #{selectedOrder.orderId}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Shipping Address</h4>
                                <p className="text-gray-600">
                                    {selectedOrder.shipping.addressLine}<br />
                                    {selectedOrder.shipping.city}, {selectedOrder.shipping.state}<br />
                                    {selectedOrder.shipping.postCode}<br />
                                    Phone: {selectedOrder.shipping.mobileNumber}
                                </p>
                            </div>
                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Order Items</h4>
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            {item.varient_type.text && (
                                                <p className="text-sm text-gray-500">Variant: {item.varient_type.text}</p>
                                            )}
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="font-medium text-blue-600">₹{selectedOrder.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;