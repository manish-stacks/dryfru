const Testimonial = require("../models/testimonial");

// ✅ Create a new testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const { name, message, rating, whatPurchased, gender, isActive } = req.body;

        if (!name || !message || !rating || !gender) {
            return res.status(400).json({ success: false, message: "All required fields must be filled." });
        }

        const newTestimonial = new Testimonial({ name, message, rating, whatPurchased, gender, isActive });

        await newTestimonial.save();
        res.status(201).json({ success: true, message: "Testimonial created successfully", testimonial: newTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Get all testimonials (optionally filter by active status)
exports.getAllTestimonials = async (req, res) => {
    try {
        const { isActive } = req.query;
        const filter = isActive ? { isActive: isActive === "true" } : {};

        const testimonials = await Testimonial.find(filter).sort({ date: -1 });
        res.status(200).json({ success: true, count: testimonials.length, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Get a single testimonial by ID
exports.getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: "Testimonial not found" });
        }
        res.status(200).json({ success: true, testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Update a testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedTestimonial) {
            return res.status(404).json({ success: false, message: "Testimonial not found" });
        }

        res.status(200).json({ success: true, message: "Testimonial updated successfully", testimonial: updatedTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);

        if (!deletedTestimonial) {
            return res.status(404).json({ success: false, message: "Testimonial not found" });
        }

        res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
