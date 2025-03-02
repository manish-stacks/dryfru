import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Package } from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
  progress: "bg-indigo-100 text-indigo-800",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.dyfru.com/api/v1/admin/get-all-order", {
        params: { page, limit: 6 },
      });
      const { data, totalPages } = response.data;
      setOrders(data);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleStatusChange = async (orderId, status) => {
    try {
      setLoading(true);
      const data = await axios.post("https://api.dyfru.com/api/v1/admin/change-order-status", { orderId, status });
      console.log(data)
      fetchOrders(currentPage);
    } catch (err) {
      console.log(err);
      // setError("Failed to update order status. Please try again later.");
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setLoading(true);
        await axios.delete(`https://api.dyfru.com/api/v1/admin/delete-order/${orderId}`);
        fetchOrders(currentPage);
        toast.success("Order deleted successfully");
      } catch (err) {
        console.log(err)
        setError("Failed to delete order. Please try again later.");
        setLoading(false);
      }
    }
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Details - ${order.orderId}</title>
          <link rel="stylesheet" href="billStyles.css">
        </head>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  color: #333;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.header {
  background-color: #4a90e2;
  color: #ffffff;
  padding: 20px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.order-info {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}

.order-info div {
  flex: 1;
}

.order-info h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #4a90e2;
}

.status {
  font-weight: bold;
  color: #4caf50;
}

.customer-details, .order-items, .order-summary {
  padding: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th, .table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #4a90e2;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.total {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  text-align: right;
  color: #4a90e2;
}

.footer {
  margin-top: 10px;
  padding: 20px;
  background-color: #f4f4f4;
  font-size: 14px;
  color: #666;
  border-top: 1px solid #e0e0e0;
}

.footer h3 {
  color: #4a90e2;
  margin-bottom: 5px;
}

.footer ul {
  padding-left: 5px;
  margin: 0;
}

.footer li {
  margin-bottom: 5px;
}

@media print {
  body {
    background-color: #ffffff;
  }
  
  .container {
    box-shadow: none;
  }
}


        </style>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Invoice</h1>
            </div>
            
            <div class="order-info">
              <div>
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
              </div>
              <div>
                <h2>Payment Info</h2>
                <p><strong>Status:</strong> <span class="status">${order.status}</span></p>
                <p><strong>Payment Type:</strong> ${order.paymentType}</p>
              </div>
            </div>
  
            <div class="customer-details">
              <h2>Customer Details</h2>
              <p><strong>Name:</strong> ${order?.userId.Name}</p>
              <p><strong>Email:</strong> ${order?.userId.Email}</p>
              <p><strong>Mobile Number:</strong> ${order?.userId.ContactNumber}</p>
            </div>
  
            <div class="order-items">
              <h2>Order Items</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price (₹)</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
  
            <div class="order-summary">
              <div class="total">
                <p>Total Paid: ₹${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
  
            <div class="footer">
              <h3>Terms and Conditions</h3>
              <ul>
                <li>All sales are final. Returns are accepted within 30 days of purchase with the original receipt.</li>
                <li>Shipping times may vary depending on location and availability.</li>
                <li>Prices include all applicable taxes and fees.</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </header>

        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-900">{order.orderId}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">Rs: {order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{order.paymentType}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => handlePrintOrder(order)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Print
                    </button>
                    <select
                      className="ml-2 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue === "delete") {
                          handleDeleteOrder(order._id);
                        } else {
                          handleStatusChange(order._id, selectedValue);
                        }
                      }}
                    >
                      <option value="" disabled selected>
                        Select Action
                      </option>
                      {["pending", "confirmed", "shipped", "delivered", "cancelled", "returned", "progress"].map(
                        (status) => (
                          <option key={status} value={status}>
                            Set to {status}
                          </option>
                        )
                      )}
                      <option value="delete" className="text-red-600">
                        Delete Order
                      </option>
                    </select>
                    <button
                      onClick={() => window.location.href = `/order/${order?.orderId}`}
                      className="px-4 ml-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;
