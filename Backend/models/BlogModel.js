const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    meta_title: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl:{
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        default: 'admin',
        trim: true
    },
   
    metaKeyWord: {
        type: [String],
        default: []
    },
    metaDescription: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    html_content: {
        type: String,
        required: true,
        trim: true
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

BlogSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;