import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Truck, 
  CreditCard, 
  Package, 
  User, 
  Calendar,
  MapPin,
  Star,
  RefreshCw,
  CheckCircle2,
  Clock
} from 'lucide-react';
import axios from 'axios';

const ViewOrder = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.dyfru.com/api/v1/recent-order/${id}`);
        setOrderData(response.data.data);
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'delivered': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'processing': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto p-3 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-gray-900">Order #{orderData.orderId}</h1>
          <p className="dark:text-white text-gray-500 mt-1">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            {formatDate(orderData.orderDate)}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full ${getStatusColor(orderData.status)}`}>
          <span className="font-medium capitalize">{orderData.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Customer Details</h2>
          </div>
          <div className="space-y-3">
            <p><span className="text-gray-600">Name:</span> {orderData.userId.Name}</p>
            <p><span className="text-gray-600">Email:</span> {orderData.userId.Email}</p>
            <p><span className="text-gray-600">Phone:</span> {orderData.userId.ContactNumber}</p>
            {orderData.OrderProcessRating && (
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 font-medium">{orderData.OrderProcessRating}/5</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Shipping Details</h2>
          </div>
          <div className="space-y-3">
            <p><span className="text-gray-600">Address:</span> {orderData.shipping.addressLine}</p>
            <p><span className="text-gray-600">City:</span> {orderData.shipping.city}</p>
            <p><span className="text-gray-600">State:</span> {orderData.shipping.state}</p>
            <p><span className="text-gray-600">Postal Code:</span> {orderData.shipping.postCode}</p>
            <p><span className="text-gray-600">Phone:</span> {orderData.shipping.mobileNumber}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Payment Details</h2>
          </div>
          {orderData?.paymentType === 'COD' ? (
  <div className="border p-4 rounded-md shadow bg-gray-50">
    <p className="text-lg font-semibold text-gray-800">Payment Details</p>
    <p className="text-gray-600">
      <span className="font-medium">Payment Type:</span> Cash On Delivery (COD)
    </p>
  </div>
) : (
  <div className="border p-4 rounded-md shadow bg-gray-50 space-y-3">
    <p className="text-lg font-semibold text-gray-800">Payment Details</p>
    <div className="flex justify-between">
      <span className="text-gray-600 font-medium">Method:</span>
      <span className="text-gray-800">{orderData.payment.method}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600 font-medium">Transaction ID:</span>
      <span className="text-gray-800">{orderData?.payment?.transactionId}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-medium">Status:</span>
      <span
        className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
          orderData.payment.status === 'Paid'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {orderData.payment.status}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600 font-medium">Paid At:</span>
      <span className="text-gray-800">{formatDate(orderData.payment.paidAt)}</span>
    </div>
  </div>
)}

        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Order Items</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 underline text-green-500 whitespace-nowrap"><a href={`/products/edit/${item?.productId}?type=View-Product`}>{item.name}</a></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.varient_type.text || 'No Weight'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity || 'No Weight'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{orderData.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{orderData.isDeliveryFeePay ? `₹${orderData.deliveryFee}` : 'Free'}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{orderData.payAmt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Information (if applicable) */}
      {orderData.refund && orderData.refund.amount > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <RefreshCw className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Refund Details</h2>
          </div>
          <div className="space-y-3">
            <p><span className="text-gray-600">Amount:</span> ₹{orderData.refund.amount}</p>
            <p><span className="text-gray-600">Method:</span> {orderData.refund.refundMethod}</p>
            <p><span className="text-gray-600">Status:</span> {orderData.refund.refundStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;