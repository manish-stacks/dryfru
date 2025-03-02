const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/Order.model')
const Settings = require('../models/Setting');
const Razorpay = require('razorpay');
async function initiatePayment(req, res, order) {
    try {
        const { totalAmount } = req.body;
        const SettingsFind = await Settings.findOne()
        const transactionId = crypto.randomBytes(9).toString('hex');
        const merchantUserId = crypto.randomBytes(12).toString('hex');

        const merchantId = process.env.PHONEPE_MERCHANT_ID || SettingsFind?.paymentGateway?.key;
        const apiKey = process.env.PHONEPE_MERCHANT_KEY || SettingsFind?.paymentGateway?.secret;


        const data = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId: merchantUserId,
            name: "User",
            amount: totalAmount * 100,
            callbackUrl: 'https://api.dyfru.com/payment-failed',
            redirectUrl: `https://api.dyfru.com/api/v1/verify-payment/${transactionId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE',
            },
        };


        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;


        const string = payloadMain + '/pg/v1/pay' + apiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;


        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";



        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
            },
            data: {
                request: payloadMain,
            },
        };

        // Make the Axios request
        const response = await axios.request(options);
        // console.log("response.data.data.orderId", response.data.data.merchantTransactionId)
        const date = new Date()
        // console.log(date)
        if (response.status) {
            const findOrder = await Order.findById(order?._id)
            if (findOrder) {
                findOrder.payment = {
                    method: 'PAY_PAGE',
                    paymentInital: date,
                    phonepeOrderId: response.data.data.merchantTransactionId,
                    status: "pending",
                };
            }
            await findOrder.save();
        }
        // console.log(response.data.data.instrumentResponse.redirectInfo.url)
        res.status(201).json({
            success: true,
            msg: "Payment initiated successfully",
            amount: totalAmount,
            phonepeOrderId: response.data.data?.merchantTransactionId,
            order: order,
            success: true,
            url: response.data.data.instrumentResponse.redirectInfo.url,
        });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(501).json({
            success: false,
            msg: "Payment initiation failed",
        });
    }
}

async function initiateRazorpay(req, res, order) {
    try {
        const { totalAmount } = order || {};
        if (!totalAmount) {
            return res.status(400).json({ success: false, msg: "Total amount is required" });
        }



        const SettingsFind = await Settings.findOne();
        const razorpayKey = process.env.RAZORPAY_KEY_ID || SettingsFind?.paymentGateway?.key;
        const razorpaySecret = process.env.RAZORPAY_SECRET || SettingsFind?.paymentGateway?.secret;

        const razorpay = new Razorpay({
            key_id: razorpayKey,
            key_secret: razorpaySecret,
        });

        const options = {
            amount: Math.round(totalAmount * 100), // Ensure integer value
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex'),
            payment_capture: 1,
        };

        const response = await razorpay.orders.create(options);
        console.log(response)
        const date = new Date();

        if (response) {
            const findOrder = await Order.findById(order?._id);
            if (findOrder) {
                findOrder.payment = {
                    method: 'RAZORPAY',
                    paymentInital: date,
                    razorpayOrderId: response.id,
                    status: 'pending',
                };
                await findOrder.save();
            }
        }

        res.status(201).json({
            success: true,
            msg: 'Payment initiated successfully',
            amount: totalAmount,
            razorpayOrderId: response.id,
            order: order,
            currency: response.currency,
        });
    } catch (error) {
        console.error('Error initiating Razorpay payment:', error);
        res.status(500).json({
            success: false,
            msg: 'Payment initiation failed',
            error: error?.error || error,
        });
    }
}





module.exports = { initiatePayment , initiateRazorpay };
