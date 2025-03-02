const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    Phone: {
        type: String,
        required: true,
        trim: true,

    },

    Message: {
        type: String,
        trim: true
    },
    isContact: {
        type: String,
        default: 'New Request'

    }
}, {
    timestamps: true
});

// Export the model
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;