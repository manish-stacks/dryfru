const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    discount: {
        type: Number,
        required: true
    },
    minimumOrderAmount: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

couponSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;