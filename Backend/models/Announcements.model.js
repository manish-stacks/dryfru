const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
      
    }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;