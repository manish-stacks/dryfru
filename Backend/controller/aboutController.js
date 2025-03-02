const About = require("../models/About");


exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne(); 
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: "Error fetching About data", error });
  }
};

// Create or Update About Page Data
exports.createOrUpdateAbout = async (req, res) => {
  try {
    const { title, description, sections, contact, socialLinks } = req.body;
    
    let about = await About.findOne(); // Check if data exists
    
    if (about) {
      // Update existing
      about.title = title;
      about.description = description;
      about.sections = sections;
      about.contact = contact;
      about.socialLinks = socialLinks;
    } else {
      // Create new
      about = new About({ title, description, sections, contact, socialLinks });
    }

    await about.save();
    res.status(200).json({ message: "About page updated successfully", about });
  } catch (error) {
    res.status(500).json({ message: "Error updating About page", error });
  }
};
