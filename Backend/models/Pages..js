const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PageSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,

    },
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    meta_title: {
        type: String,
    },
    meta_desc: {
        type: String,
    },
    meta_keywords: [String],
    write_by: {
        type: String,
        default: 'admin'
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isShown: {
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

PageSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Page', PageSchema);