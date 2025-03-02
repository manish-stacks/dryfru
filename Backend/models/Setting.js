const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    siteName: {
        type: String,
    },
    siteUrl: {
        type: String,
       
    },
    copounEnables:{
        type: Boolean,
        default: false
    },
    paymentGateway: {
        key:{
            type: String,
          
        },
        secret: {
            type: String,
          
        },
        provider:{
            type: String,
          
        }

    },
    currency: {
        type: String,
       default: 'INR'
    },
    isTaxEnables:{
        type: Boolean,
        default: false
    },
    taxRate: {
        type: Number,
    },
    shippingEnabled: {
        type: Boolean,
        default: true
    },
    shippingCost: {
        type: Number,
        required: true
    },
    freeShippingThreshold: {
        type: Number,
        default: 0 
    },
    onlinePaymentAvailable: {
        type: Boolean,
        default: true
    },
    codAvailable: {
        type: Boolean,
        default: true
    },
    smtp_email: {
        type: String,
        required: true
    },
    smtp_password: {
        type: String,
        required: true
    },
    supportEmail: {
        type: String,
        required: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    
  
    
    logoUrl: {
        type: String,
        default: ""
    },
    
    socialMediaLinks: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        youtube: { type: String, default: "" }
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
   
   
    analytics: {
        googleAnalyticsId: {
            type: String,
            default: ""
        },
        facebookPixelId: {
            type: String,
            default: ""
        }
    },

    lowStockThreshold: {
        type: Number,
        default: 5 
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
