const Ordermodel = require('../models/Order.model')
const Product = require('../models/Product.model')
const Crypto = require('crypto');

const { initiatePayment, initiateRazorpay } = require('../utils/Pay');

const sendEmail = require('../utils/sendMail');
const settings = require('../models/Setting');

var { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

async function toCheckStock(product_id, stock, isVarientTrue = false, Varient_id) {
  try {
    const product = await Product.findById(product_id);
    if (!product) {
      throw new Error('Product Not Found');
    }

    if (isVarientTrue === false) {
      if (product.stock < stock) {
        throw new Error(`Not enough stock for the product: ${product.name}. Available stock: ${product.stock}`);
      }
    } else {
      const varient = product.Varient.find((item) => item._id.toString() === Varient_id);
      if (!varient) {
        throw new Error('Variant Not Found');
      }
      if (varient.stock_quantity < stock) {
        throw new Error(`Not enough stock for the variant: ${varient.quantity}. Available stock: ${varient.stock_quantity}`);
      }
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
async function generateUniqueOrderId() {
  const startString = 'ORD';
  let order_id;
  let orderExists = true;

  while (orderExists) {

    const OrderNo = Crypto.randomInt(1000000, 9999999);
    order_id = startString + OrderNo;

    const order = await Ordermodel.findOne({ orderId: order_id });

    if (!order) {
      orderExists = false;
    }
  }

  return order_id;
}


exports.createOrderOfProduct = async (req, res) => {
  try {


    const user = req.user.id?._id || null
    const order_id = await generateUniqueOrderId();

    const { items, totalAmount, payAmt, isVarientInCart, paymentType, offerId, shipping } = req.body;

    for (let item of items) {
      const { product_id, Qunatity, variantId } = item;

      const isVarientTrue = isVarientInCart && variantId ? true : false;

      const stockCheck = await toCheckStock(product_id, Qunatity, isVarientTrue, variantId);

      if (!stockCheck) {
        return res.status(400).json({
          success: false,
          message: 'Stock check failed for one or more products. Please try again later.'
        });
      }
    }
    const orderItems = items.map(item => ({
      productId: item.product_id,
      varient_type: {
        id: item.variantId || null,
        text: item.variant || ''
      },
      name: item.product_name,
      quantity: item.Qunatity,
      price: item.price_after_discount,
    }));


    const newOrder = new Ordermodel({
      userId: user,
      orderId: order_id,
      items: orderItems,
      totalAmount,
      payAmt,
      paymentType,
      offerId,
      shipping,
      status: 'pending',
      totalquantity: items.length || 0
    });


    const savedOrder = await newOrder.save();

    if (paymentType === 'ONLINE') {

      // return await initiatePayment(req, res, newOrder)
      return await initiateRazorpay(req, res, newOrder)
    } else {
      const SettingsFind = await settings.findOne()


      const findOrderDetails = await Ordermodel.findById(savedOrder?._id).populate('userId')
      console.log(findOrderDetails?.userId?.Email)
      const MailOptions = {
        email: findOrderDetails?.userId?.Email,
        subject: 'Order Placed Successfuly',
        message: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f0faf0; color: #1a1a1a;">
  <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
   
    <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; padding: 32px 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 28px; font-weight: 600;">Order Confirmed! 🎉</h2>
      <p style="margin: 8px 0 0; opacity: 0.9;">Thank you for your purchase</p>
    </div>

    <div style="padding: 32px 24px;">
      <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
          Dear ${findOrderDetails?.userId?.Name},<br>
          Your order has been successfully placed and confirmed. We're preparing your items for shipment!
        </p>
      </div>

    
      <div style="margin-bottom: 32px;">
        <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
          Order Details
        </h3>
        <table style="width: 100%; border-collapse: separate; border-spacing: 0 4px;">
          <tr>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Order ID:</td>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${findOrderDetails?.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Email:</td>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${findOrderDetails?.userId?.Email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Order Date:</td>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${new Date(findOrderDetails?.orderDate).toLocaleDateString()}</td>
          </tr>
        </table>
      </div>


      <div style="margin-bottom: 32px;">
        <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
          Items Ordered
        </h3>
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 16px;">
          <thead>
            <tr style="background: #dcfce7;">
              <th style="padding: 12px; text-align: left; border-radius: 6px 0 0 6px;">Product</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right; border-radius: 0 6px 6px 0;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${findOrderDetails?.items.map(item => `
              <tr style="background: #f0fdf4;">
                <td style="padding: 12px; border-radius: 6px 0 0 6px;">${item.name}</td>
                <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border-radius: 0 6px 6px 0;">₹${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>


      <div style="margin-bottom: 32px;">
        <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
          Payment Information
        </h3>
        <table style="width: 100%; border-collapse: separate; border-spacing: 0 4px;">
          <tr>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Total Amount:</td>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 600;">₹${findOrderDetails?.totalAmount}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Amount:</td>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 600;">₹${findOrderDetails?.payAmt}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Method:</td>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">${findOrderDetails?.paymentType}</td>
          </tr>
         
          <tr>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Status:</td>
            <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">
              <span style="background: #16a34a; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px;">${findOrderDetails?.payment?.status}</span>
            </td>
          </tr>
        </table>
      </div>


      <div style="margin-bottom: 32px;">
        <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
          Delivery Address
        </h3>
        <div style="background: #f0fdf4; padding: 16px; border-radius: 12px;">
          <p style="margin: 0; line-height: 1.6;">
            ${findOrderDetails?.shipping?.addressLine}<br>
            ${findOrderDetails?.shipping?.city}, ${findOrderDetails?.shipping?.state}, ${findOrderDetails?.shipping?.postCode}<br>
            <strong>Mobile:</strong> ${findOrderDetails?.shipping?.mobileNumber}
          </p>
        </div>
      </div>


      <div style="background: #dcfce7; border-radius: 12px; padding: 20px; text-align: center; margin-top: 32px;">
        <p style="margin: 0; font-size: 15px; line-height: 1.6;">
          Need help? Contact our support team at<br>
          <a href="mailto:support@company.com" style="color: #16a34a; text-decoration: none; font-weight: 500;">${SettingsFind?.supportEmail}</a>
        </p>
      </div>
    </div>

  
    <div style="background: #16a34a; padding: 20px; text-align: center; color: #ffffff;">
      <p style="margin: 0; font-size: 14px;">
        &copy; ${new Date().getFullYear()} ${SettingsFind?.siteName}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`,
      }
      await sendEmail(MailOptions)
      return res.status(200).json({
        success: true,
        message: 'Order has been successfully created and placed in pending status.',
        order: findOrderDetails
      });
    }



  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

exports.ChangeOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const Order = await Ordermodel.findById(orderId);
    if (!Order) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, we couldn\'t find the order. Please check the order ID and try again.'
      });
    }

    if (Order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: `The order has already been marked as ${Order.status}. It cannot be updated at this time.`
      });
    }

    if (status === 'confirmed') {
      for (let item of Order.items) {
        const { productId, quantity, varient_type } = item;

        const isVarientTrue = varient_type.id ? true : false;
        console.log(isVarientTrue)

        const stockCheck = await toCheckStock(productId, quantity, isVarientTrue, varient_type?.id);

        if (!stockCheck) {
          return res.status(400).json({
            success: false,
            message: 'Stock check failed for one or more products. Please try again later.'
          });
        }


        const product = await Product.findById(productId);
        if (isVarientTrue) {
          const varient = product.Varient.find((item) => item._id.toString() === varient_type?.id);
          if (varient) {
            varient.stock_quantity -= quantity;
          }
        } else {
          product.stock -= quantity;
        }
        await product.save();
      }
    }


    if (status === 'cancelled') {

      Order.status = status;
      await Order.save();

      return res.status(200).json({
        success: true,
        message: 'The order has been cancelled successfully!'
      });
    }


    Order.status = status;
    await Order.save();

    return res.status(200).json({
      success: true,
      message: 'The order status has been updated successfully!'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Oops! Something went wrong. Please try again later.'
    });
  }
};

exports.OrderProcessRating = async (req, res) => {
  try {
    const orderId = req.params.orderid;
    const { OrderProcessRating } = req.body;


    const orderData = await Ordermodel.findOne({ orderId: orderId })

    if (!orderData) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check the order ID and try again.',
      });
    }
    orderData.OrderProcessRating = OrderProcessRating
    await orderData.save();

    return res.status(200).json({
      success: true,
      message: 'Thank you for sharing your feedback! Your rating has been successfully added to your order.',
      updatedOrder: orderData,
    });

  } catch (error) {
    console.error('Error updating order process rating:', error);


    return res.status(500).json({
      success: false,
      message: 'An error occurred while adding the rating. Please try again later.',
      error: error.message,
    });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const { page = 1, search = '', startDate, endDate, orderStatus, limit } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { 'userId.Name': { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (orderStatus) {
      query.status = orderStatus;
    }

    const limits = limit;
    const orders = await Ordermodel.find(query)
      .populate('userId')
      .skip((page - 1) * limits)
      .limit(limits)
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      totalPages: Math.ceil(await Ordermodel.countDocuments(query) / limits),
      total: orders.length,
      currentPage: page,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Oops! Something went wrong. Please try again later.'
    });
  }
}

exports.getOrderByOrderId = async (req, res) => {
  try {
    const userId = req.user?.id?._id;
    const orderId = req.params.orderId;




    const order = await Ordermodel.findOne({
      userId: userId,
      orderId: orderId
    }).populate('userId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'We couldn’t find an order with the provided ID. Please double-check the order ID and try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order retrieved successfully.',
      data: order,
    });
  } catch (error) {

    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while retrieving the order. Please try again later.',
      error: error.message,
    });
  }
};

exports.getOrderByOrderIdAdmin = async (req, res) => {
  try {

    const orderId = req.params.orderId;




    const order = await Ordermodel.findOne({
      orderId: orderId
    }).populate('userId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'We couldn’t find an order with the provided ID. Please double-check the order ID and try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order retrieved successfully.',
      data: order,
    });
  } catch (error) {

    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while retrieving the order. Please try again later.',
      error: error.message,
    });
  }
};

exports.getRecentsOrders = async (req, res) => {
  try {
    const recentOrders = await Ordermodel.find({
      orderDate: { $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    }).populate('userId').sort({ orderDate: -1 });

    res.status(200).json({ message: 'Recent Orders fetched successfully', data: recentOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recent orders', error });
  }
};


exports.generateOrderReport = async (req, res) => {
  const { reportType, startDate, endDate } = req.body;

  let start, end;

  // Determine the date range based on report type
  switch (reportType) {
    case 'weekly':
      start = new Date();
      start.setDate(start.getDate() - 7); // 7 days ago
      end = new Date(); // Current date
      break;
    case 'monthly':
      start = new Date();
      start.setMonth(start.getMonth() - 1); // 1 month ago
      end = new Date(); // Current date
      break;
    case 'custom':
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide both startDate and endDate' });
      }
      start = new Date(startDate);
      end = new Date(endDate);
      break;
    default:
      return res.status(400).json({ message: 'Invalid report type' });
  }

  try {
    // Fetch the orders within the date range
    const orders = await Ordermodel.find({
      orderDate: { $gte: start, $lte: end }
    }).sort({ orderDate: -1 });

    // Fetch all products to track which ones sold the most and least
    const products = await Product.find();

    // Track the total amount and quantity for each order
    let totalAmount = 0;
    let totalQuantity = 0;

    // Initialize a map to track product sales
    const productSales = new Map();

    // Loop through the orders to calculate total sales and track product sales
    orders.forEach((order) => {
      totalAmount += order.totalAmount;
      totalQuantity += order.totalquantity;

      // Loop through items in the order to track product sales
      order.items.forEach((item) => {
        const productId = item.productId.toString();
        const soldQuantity = item.quantity;

        // Update the sales map for the product
        if (productSales.has(productId)) {
          productSales.set(productId, productSales.get(productId) + soldQuantity);
        } else {
          productSales.set(productId, soldQuantity);
        }
      });
    });

    // Get the product with the most sales and the least sales
    let mostSoldProduct = { productId: null, quantity: 0 };
    let leastSoldProduct = { productId: null, quantity: Infinity };

    // Track products that were not sold
    const soldProductIds = new Set(productSales.keys());
    const unsoldProducts = [];

    // Check each product and update the most and least sold products
    products.forEach((product) => {
      const productId = product._id.toString();
      const soldQuantity = productSales.get(productId) || 0;

      // Most sold product
      if (soldQuantity > mostSoldProduct.quantity) {
        mostSoldProduct = { productId, quantity: soldQuantity };
      }

      // Least sold product
      if (soldQuantity < leastSoldProduct.quantity && soldQuantity > 0) {
        leastSoldProduct = { productId, quantity: soldQuantity };
      }

      // Track unsold products
      if (soldQuantity === 0) {
        unsoldProducts.push(product);
      }
    });

    // Get the most and least sold product details
    const mostSoldProductDetails = products.find(product => product._id.toString() === mostSoldProduct.productId);
    const leastSoldProductDetails = products.find(product => product._id.toString() === leastSoldProduct.productId);

    // Generate the report data
    const reportData = {
      orders: orders[0],
      totalAmount,
      totalQuantity,
      mostSoldProduct: {
        productName: mostSoldProductDetails?.product_name || 'N/A',
        quantitySold: mostSoldProduct.quantity
      },
      leastSoldProduct: {
        productName: leastSoldProductDetails?.product_name || 'N/A',
        quantitySold: leastSoldProduct.quantity
      },
      unsoldProducts: unsoldProducts.map(product => product.product_name)
    };

    // Return the report data
    res.status(200).json({
      message: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully`,
      data: reportData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating report', error });
  }
};



exports.getMyLastOrder = async (req, res) => {
  try {

    const user = req.user?.id?._id || null;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not logged in or ID is invalid."
      });
    }

    // Find the latest order for the user
    const order = await Ordermodel.findOne({ userId: user }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user."
      });
    }

    return res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error("Error fetching last order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the last order.",
      error: error.message
    });
  }
};

exports.getMyAllOrder = async (req, res) => {
  try {

    const user = req.user?.id?._id || null;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not logged in or ID is invalid."
      });
    }

    // Find the latest order for the user
    const order = await Ordermodel.find({ userId: user }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user."
      });
    }

    return res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error("Error fetching last order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the last order.",
      error: error.message
    });
  }
};

// exports.checkStatus = async (req, res) => {
//   const { merchantTransactionId } = req.params;

//   if (!merchantTransactionId) {
//     return res.status(400).json({ success: false, message: "Merchant transaction ID not provided" });
//   }

//   try {
//     const merchantId = process.env.PHONEPE_MERCHANT_ID || 'TESTPGPAYCREDUAT';
//     const apiKey = process.env.PHONEPE_MERCHANT_KEY || '14d6df8a-75bf-4873-9adf-43bc1545094f';
//     const keyIndex = 1;

//     const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}${apiKey}`;
//     const sha256 = Crypto.createHash('sha256').update(string).digest('hex');
//     const checksum = sha256 + "###" + keyIndex;

//     const testUrlCheck = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

//     const options = {
//       method: 'GET',
//       url: testUrlCheck,
//       headers: {
//         accept: 'application/json',
//         'Content-Type': 'application/json',
//         'X-VERIFY': checksum,
//         'X-MERCHANT-ID': merchantId
//       }
//     };


//     const { data } = await axios.request(options);


//     if (data.success === true) {

//       const findOrder = await Ordermodel.findOne({ 'payment.phonepeOrderId': merchantTransactionId }).populate('userId');

//       if (findOrder) {
//         findOrder.payment = {
//           method: data.data?.paymentInstrument?.type,
//           transactionId: data.data?.transactionId,
//           isPaid: true,
//           status: data.data?.state,
//           paidAt: new Date()
//         }

//         await findOrder.save();
//       }

//       const successRedirect = `https://dyfru.com/Receipt/order-confirmed?id=${merchantTransactionId}&success=true&data=${findOrder?.orderId}`;
//       // Send email notification to customer and admin when order is confirmed
//       const MailOptions = {
//         email: findOrder?.userId?.Email,
//         subject: 'Order Placed Successfuly',
//         message: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Order Confirmation</title>
// </head>
// <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f0faf0; color: #1a1a1a;">
//   <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

//     <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; padding: 32px 20px; text-align: center;">
//       <h2 style="margin: 0; font-size: 28px; font-weight: 600;">Order Confirmed! 🎉</h2>
//       <p style="margin: 8px 0 0; opacity: 0.9;">Thank you for your purchase</p>
//     </div>

//     <div style="padding: 32px 24px;">
//       <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
//         <p style="margin: 0; font-size: 16px; line-height: 1.6;">
//           Dear ${findOrder?.userId?.Name},<br>
//           Your order has been successfully placed and confirmed. We're preparing your items for shipment!
//         </p>
//       </div>


//       <div style="margin-bottom: 32px;">
//         <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
//           Order Details
//         </h3>
//         <table style="width: 100%; border-collapse: separate; border-spacing: 0 4px;">
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Order ID:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${findOrder?.orderId}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Email:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${findOrder?.userId?.Email}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Order Date:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${new Date(findOrder?.orderDate).toLocaleDateString()}</td>
//           </tr>
//         </table>
//       </div>


//       <div style="margin-bottom: 32px;">
//         <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
//           Items Ordered
//         </h3>
//         <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 16px;">
//           <thead>
//             <tr style="background: #dcfce7;">
//               <th style="padding: 12px; text-align: left; border-radius: 6px 0 0 6px;">Product</th>
//               <th style="padding: 12px; text-align: center;">Qty</th>
//               <th style="padding: 12px; text-align: right; border-radius: 0 6px 6px 0;">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${findOrder?.items.map(item => `
//               <tr style="background: #f0fdf4;">
//                 <td style="padding: 12px; border-radius: 6px 0 0 6px;">${item.name}</td>
//                 <td style="padding: 12px; text-align: center;">${item.quantity}</td>
//                 <td style="padding: 12px; text-align: right; border-radius: 0 6px 6px 0;">₹${item.price}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
//       </div>


//       <div style="margin-bottom: 32px;">
//         <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
//           Payment Information
//         </h3>
//         <table style="width: 100%; border-collapse: separate; border-spacing: 0 4px;">
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Total Amount:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 600;">₹${findOrder?.totalAmount}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Amount:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 600;">₹${findOrder?.payAmt}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Method:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">${findOrder?.payment?.method}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Transaction ID:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">${findOrder?.payment?.transactionId}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Status:</td>
//             <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">
//               <span style="background: #16a34a; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px;">${findOrder?.payment?.status}</span>
//             </td>
//           </tr>
//         </table>
//       </div>


//       <div style="margin-bottom: 32px;">
//         <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
//           Delivery Address
//         </h3>
//         <div style="background: #f0fdf4; padding: 16px; border-radius: 12px;">
//           <p style="margin: 0; line-height: 1.6;">
//             ${findOrder?.shipping?.addressLine}<br>
//             ${findOrder?.shipping?.city}, ${findOrder?.shipping?.state}, ${findOrder?.shipping?.postCode}<br>
//             <strong>Mobile:</strong> ${findOrder?.shipping?.mobileNumber}
//           </p>
//         </div>
//       </div>


//       <div style="background: #dcfce7; border-radius: 12px; padding: 20px; text-align: center; margin-top: 32px;">
//         <p style="margin: 0; font-size: 15px; line-height: 1.6;">
//           Need help? Contact our support team at<br>
//           <a href="mailto:support@company.com" style="color: #16a34a; text-decoration: none; font-weight: 500;">support@company.com</a>
//         </p>
//       </div>
//     </div>


//     <div style="background: #16a34a; padding: 20px; text-align: center; color: #ffffff;">
//       <p style="margin: 0; font-size: 14px;">
//         &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
//       </p>
//     </div>
//   </div>
// </body>
// </html>`,
//       }
//       await sendEmail(MailOptions)
//       return res.redirect(successRedirect);
//     } else {
//       const failureRedirect = "https://panandacademy.com/payment-failed";
//       return res.redirect(failureRedirect);
//     }

//   } catch (error) {
//     console.error("Error in checkStatus:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error", error });
//   }
// };

exports.checkStatus = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required payment details" });
    }
    const SettingsFind = await settings.findOne();
    const secretKey = SettingsFind?.paymentGateway?.secret || process.env.RAZORPAY_SECRET_KEY

    if (!secretKey) {
      return res.status(500).json({ success: false, message: "Missing Razorpay secret key" });
    }

    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      secretKey
    );

    if (!isValid) {
      const failureRedirect = `${SettingsFind?.siteUrl}/payment-failed?order_id=${razorpay_order_id}`;
      return res.status(400).json({ success: false, message: "Payment verification failed", redirect: failureRedirect });
    }

    const findOrder = await Ordermodel.findOne({ "payment.razorpayOrderId": razorpay_order_id }).populate("userId");

    if (!findOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    findOrder.payment = {
      method: "Razorpay",
      paymentInital: findOrder.payment.paymentInital,
      razorpayOrderId: razorpay_order_id,
      transactionId: razorpay_payment_id,
      isPaid: true,
      status: "Paid",
      paidAt: new Date(),
    };

    await findOrder.save();


    const successRedirect = `${SettingsFind?.siteUrl}/Receipt/order-confirmed?id=${razorpay_order_id}&success=true&data=${findOrder?.orderId}`;
    const MailOptions = {
      email: findOrder?.userId?.Email,
      subject: 'Order Placed Successfuly',
      message: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f0faf0; color: #1a1a1a;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
        <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; padding: 32px 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 28px; font-weight: 600;">Order Confirmed! 🎉</h2>
          <p style="margin: 8px 0 0; opacity: 0.9;">Thank you for your purchase</p>
        </div>
    
        <div style="padding: 32px 24px;">
          <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
              Dear ${findOrder?.userId?.Name},<br>
              Your order has been successfully placed and confirmed. We're preparing your items for shipment!
            </p>
          </div>
    
    
          <div style="margin-bottom: 32px;">
            <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
              Order Details
            </h3>
            <table style="width: 100%; border-collapse: separate; border-spacing: 0 4px;">
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Order ID:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${findOrder?.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Email:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${findOrder?.userId?.Email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Order Date:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 500;">${new Date(findOrder?.orderDate).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
    
    
          <div style="margin-bottom: 32px;">
            <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
              Items Ordered
            </h3>
            <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 16px;">
              <thead>
                <tr style="background: #dcfce7;">
                  <th style="padding: 12px; text-align: left; border-radius: 6px 0 0 6px;">Product</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-radius: 0 6px 6px 0;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${findOrder?.items.map(item => `
                  <tr style="background: #f0fdf4;">
                    <td style="padding: 12px; border-radius: 6px 0 0 6px;">${item.name}</td>
                    <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 12px; text-align: right; border-radius: 0 6px 6px 0;">₹${item.price}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
    
    
          <div style="margin-bottom: 32px;">
            <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
              Payment Information
            </h3>
            <table style="width: 100%; border-collapse: separate; border-spacing: 0 4px;">
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Total Amount:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 600;">₹${findOrder?.totalAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Amount:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 600;">₹${findOrder?.payAmt}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Method:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">${findOrder?.payment?.method}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Transaction ID:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">${findOrder?.payment?.transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 6px 0 0 6px;">Payment Status:</td>
                <td style="padding: 8px 12px; background: #f0fdf4; border-radius: 0 6px 6px 0;">
                  <span style="background: #16a34a; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px;">${findOrder?.payment?.status}</span>
                </td>
              </tr>
            </table>
          </div>
    
    
          <div style="margin-bottom: 32px;">
            <h3 style="color: #16a34a; font-size: 20px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #dcfce7;">
              Delivery Address
            </h3>
            <div style="background: #f0fdf4; padding: 16px; border-radius: 12px;">
              <p style="margin: 0; line-height: 1.6;">
                ${findOrder?.shipping?.addressLine}<br>
                ${findOrder?.shipping?.city}, ${findOrder?.shipping?.state}, ${findOrder?.shipping?.postCode}<br>
                <strong>Mobile:</strong> ${findOrder?.shipping?.mobileNumber}
              </p>
            </div>
          </div>
    
    
          <div style="background: #dcfce7; border-radius: 12px; padding: 20px; text-align: center; margin-top: 32px;">
            <p style="margin: 0; font-size: 15px; line-height: 1.6;">
              Need help? Contact our support team at<br>
              <a href="mailto:support@company.com" style="color: #16a34a; text-decoration: none; font-weight: 500;">support@company.com</a>
            </p>
          </div>
        </div>
    
    
        <div style="background: #16a34a; padding: 20px; text-align: center; color: #ffffff;">
          <p style="margin: 0; font-size: 14px;">
            &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>`,
    }

    await sendEmail(MailOptions)
    return res.status(200).json({ success: true, message: "Payment verified", redirectUrl: successRedirect });


  } catch (error) {
    console.error("Error in checkStatus:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params
    const deletedOrder = await Ordermodel.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, message: "Order deleted successfully" });

  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });

  }
}