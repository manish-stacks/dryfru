const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            varient_type: {
                id: {
                    type: String
                },
                text: {
                    type: String
                }
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            _id: false,
        },
    ],
    isDeliveryFeePay: {
        type: Boolean,
        default: false
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    payAmt: {
        type: Number,
        required: true,
    },
    paymentType: {
        type: String,
        required: true,
    },
    payment: {
        method: { type: String, },
        transactionId: { type: String },
        isPaid: { type: Boolean, default: false },
        paymentInital: {
            type: Date
        },
        razorpayOrderId:{
            type: String
        },
        phonepeOrderId: {
            type: String
        },
        status: {
            type: String,
            default: 'pending',
        },
        paidAt: { type: Date },
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
    },
    shipping: {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postCode: { type: String, required: true },
        mobileNumber: { type: String, required: true },
    },

    totalquantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned', 'progress'],
        default: 'pending',
    },

    orderDate: {
        type: Date,
        default: Date.now,
    },
    estimatedDeliveryDate: {
        type: Date,
    },

    refund: {
        amount: { type: Number, default: 0 },
        refundMethod: { type: String, enum: ['bank', 'wallet', 'cash'], default: 'wallet' },
        refundStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        refundedAt: { type: Date },
    },
    OrderProcessRating: {
        type: Number,
        default: 0
    },
    shipment: {
        carrier: { type: String },
        trackingNumber: { type: String },
        shipmentDate: { type: Date },
        deliveredAt: { type: Date },
    },

}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
