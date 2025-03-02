import { useEffect, useState } from 'react';
import {
  CircleCheck,
  Receipt,
  User,
  ShoppingBag,
  Truck,
  Calculator,
  Mail,
  ScrollText,
  RefreshCcw,
  PhoneCall
} from 'lucide-react'
import axios from 'axios'
const ReceiptComponent = () => {
  const location = new URLSearchParams(window.location.search)
  const orderIdInParams = location.get('data');


  const [orderData, setOrderData] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const findOrder = async () => {
    try {
      const { data } = await axios.get(`https://api.dyfru.com/api/v1/my-recent-order/${orderIdInParams}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token_login')}`,
        },
      });
      console.log("Order", data.data)
      setOrderData(data.data);
    } catch (error) {
      console.log("Failed to fetch order", error)
    }
  }

  const AddRatingOfOrder = async (rating) => {
    console.log(rating)
    try {
      await axios.post(`https://api.dyfru.com/api/v1/order-proccessing/${orderIdInParams}`, {
        OrderProcessRating: rating
      });
      // console.log(response.data)
      setSelectedRating(rating)

        window.location.href = '/'

    } catch (error) {
      console.log("Failed to give rating", error)
    }
  }


  useEffect(() => {
    findOrder()
  }, [orderIdInParams])

  const ratings = [
    { emoji: '😠', label: 'Very Dissatisfied', value: 1 },
    { emoji: '🙁', label: 'Dissatisfied', value: 2 },
    { emoji: '😐', label: 'Neutral', value: 3 },
    { emoji: '🙂', label: 'Satisfied', value: 4 },
    { emoji: '😊', label: 'Very Satisfied', value: 5 },
  ];

  const subtotal = orderData?.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  if (!orderData) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center space-y-4">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              We're sorry, but we couldn't find your order. If your payment has been deducted, please don't worry.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">What you can do:</h3>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li className="flex items-center">
                  <RefreshCcw className="h-4 w-4 mr-2 flex-shrink-0" />
                  Try refreshing the page
                </li>
                <li className="flex items-center">
                  <PhoneCall className="h-4 w-4 mr-2 flex-shrink-0" />
                  Contact our support team
                </li>
              </ul>
            </div>
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-500 mb-4">
                Our support team is available 24/7 to assist you
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:support@example.com"
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center space-x-2 border border-gray-300 w-full py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Refresh Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          {/* Rating Section */}
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-center">How was your experience?</h2>
            <div className="flex flex-wrap justify-center space-x-4">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => AddRatingOfOrder(rating.value)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedRating === rating.value
                    ? 'bg-blue-100 scale-110'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <span className="text-4xl mb-2">{rating.emoji}</span>
                  <span className="text-sm text-gray-600">{rating.label}</span>
                </button>
              ))}
            </div>
            {selectedRating && (
              <div className="mt-4 text-center text-green-600">
                Thank you for your feedback!
              </div>
            )}
          </div>
          <div className="bg-blue-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Receipt className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">Order Receipt</h1>
                  <p className="text-blue-100">Order {orderData?.orderId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-green-500 px-4 py-2 rounded-full">
                <CircleCheck className="h-6 w-6" />
                <span className="font-semibold">Payment Successful</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="flex items-start space-x-4">
              <User className="h-6 w-6 text-gray-400" />
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  Customer Details
                </h2>
                <div className="text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <span className="font-medium">{orderData.userId?.Name}</span>
                  </p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {orderData.userId?.Email}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-semibold">Order Items</h2>
              </div>
              <div className="border rounded-lg overflow-hidden">
                {orderData?.items?.map((item, index) => (
                  <div key={index} className={`p-4 ${index !== orderData.items.length - 1 ? 'border-b' : ''
                    }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                  <span>Total Paid</span>
                  <span className="text-blue-600">₹{orderData?.payAmt}</span>
                </div>
              </div>
            </div>



            {/* Terms and Conditions */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <ScrollText className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-semibold">Terms & Conditions</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. All sales are final. Returns are accepted within 30 days of purchase with original receipt.</p>
                <p>2. Shipping times may vary depending on location and availability.</p>
                {/* <p>3. Warranty claims must be processed through the manufacturer.</p> */}
                <p>3. Prices include all applicable taxes and fees.</p>
                {/* <p>5. This receipt is valid for warranty and return purposes.</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptComponent;
