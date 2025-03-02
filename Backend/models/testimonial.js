const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now
    },
    whatPurchased: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;