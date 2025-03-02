const mongoose = require('mongoose');

const heroPageSchema = new mongoose.Schema({
    first_title: {
        type: String,
        
    },
    tag_line:{
        type: String,
        
    },
    second_title: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    button_title: {
        type: String,
        
    },
    button_href: {
        type: String,
        
    },
    image: {
        type: String,
        
    },
    sticky_note_content: {
        type: String,
        
    },
    sticky_note_content_p: {
        type: String,
        
    },
    sticky_note_content_second: {
        type: String,
        
    },
    sticky_note_content_second_p: {
        type: String,
        
    }
});

// Add a unique field to prevent multiple entries
heroPageSchema.index({}, { unique: true });

module.exports = mongoose.model('HeroPage', heroPageSchema);
