const Blog = require("../models/BlogModel");

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { meta_title, author,imageUrl, metaKeyWord, metaDescription, slug, html_content } = req.body;

        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            return res.status(400).json({ success: false, message: "Slug already exists" });
        }

        const newBlog = new Blog({ meta_title,imageUrl, author, metaKeyWord, metaDescription, slug, html_content });
        await newBlog.save();

        res.status(201).json({ success: true, message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Update a blog by ID
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Delete a blog by ID
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
