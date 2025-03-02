const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sections: [
        {
            title: String,
            icon: String,
            content: String,
            list: [
                {
                    title: String,
                    description: String,
                    icon: String,
                },
            ],
        },
    ],
    contact: {
        email: { type: String },
        phone: { type: String },
        website: { type: String },
        address: { type: String },
    },
    socialLinks: [
        {
            platform: String,
            url: String,
        },
    ],
});

const About = mongoose.model("About", aboutSchema);
module.exports = About;
