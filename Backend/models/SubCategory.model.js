const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    main_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    NumberOfProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;