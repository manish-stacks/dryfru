const Coupon = require('../models/Coupons.model');
const moment = require('moment');

// Create a coupon
exports.createCoupon = async (req, res) => {
    try {
        const { code, discount, minimumOrderAmount, expirationDate } = req.body;
        console.log(req.body)
        // Validation
        if (!code || !discount || !minimumOrderAmount || !expirationDate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Ensure expirationDate is a valid date
        if (moment(expirationDate).isBefore(moment())) {
            return res.status(400).json({ message: 'Expiration date cannot be in the past.' });
        }

        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon code already exists.' });
        }

        const coupon = new Coupon({
            code,
            discount: Number(discount),
            minimumOrderAmount: Number(minimumOrderAmount),
            expirationDate,
        });

        await coupon.save();
        res.status(201).json({ message: 'Coupon created successfully.', coupon });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating coupon.' });
    }
};

exports.getAllCoupons = async (req, res) => {
    try {
        const all_coupons = await Coupon.find()
        if (!all_coupons) {
            return res.status(404).json({ message: 'No coupons found.' });
        }
        res.status(200).json({
            message: 'All coupons fetched successfully.',
            data: all_coupons
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: 'All coupons fetched failed.',
            error: error
        });
    }
}


// Update a coupon
exports.updateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const { discount, minimumOrderAmount, expirationDate, isActive } = req.body;

        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }

        // Apply changes
        coupon.discount = discount || coupon.discount;
        coupon.minimumOrderAmount = minimumOrderAmount || coupon.minimumOrderAmount;
        coupon.expirationDate = expirationDate || coupon.expirationDate;
        coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
        coupon.updatedAt = Date.now();

        await coupon.save();
        res.status(200).json({ message: 'Coupon updated successfully.', coupon });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating coupon.' });
    }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOneAndDelete({ code });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }

        res.status(200).json({ message: 'Coupon deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting coupon.' });
    }
};

// Apply a coupon
exports.applyCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code || !orderAmount) {
            return res.status(400).json({ message: 'Coupon code and order amount are required.' });
        }

        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found or is inactive.' });
        }

        // Validate expiration
        if (moment(coupon.expirationDate).isBefore(moment())) {
            return res.status(400).json({ message: 'Coupon has expired.' });
        }

        // Validate order amount
        if (orderAmount < coupon.minimumOrderAmount) {
            return res.status(400).json({ message: `Minimum order amount for this coupon is Rs ${coupon.minimumOrderAmount}.` });
        }

        // Calculate discount
        const discountAmount = (coupon.discount / 100) * orderAmount;
        const finalAmount = orderAmount - discountAmount;

        res.status(200).json({
            message: 'Coupon applied successfully.',
            discount: coupon.discount,
            discountAmount,
            finalAmount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error applying coupon.' });
    }
};
