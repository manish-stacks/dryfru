const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    position: {
        type: Number,
        default: 0
    },
    SubCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],
    NumberOfProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;