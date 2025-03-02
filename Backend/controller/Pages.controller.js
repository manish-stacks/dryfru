const Page = require('../models/Pages.');
const announcements = require('../models/Announcements.model')
// Create a page
exports.createPage = async (req, res) => {
    try {
        const { title, content, url, meta_title, meta_dec, meta_keywords, slug, isShown } = req.body;

        const existingPage = await Page.findOne({ $or: [{ slug }, { url }] });
        if (existingPage) {
            return res.status(400).json({ message: "Slug or URL already exists" });
        }

        const newPage = new Page({
            title,
            content,
            url,
            meta_title,
            meta_dec,
            meta_keywords,
            slug,
            isShown
        });

        await newPage.save();
        return res.status(201).json({ message: 'Page created successfully', page: newPage });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all pages
exports.getAllPages = async (req, res) => {
    try {
        const pages = await Page.find();
        return res.status(200).json({ pages });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.getSinglePage = async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        return res.status(200).json({ page });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update a page
exports.updatePage = async (req, res) => {
    try {
        const { title, content, url, meta_title, meta_desc, meta_keywords, slug, isShown } = req.body;
        console.log(meta_desc)

        const page = await Page.findOneAndUpdate(
            { slug: req.params.slug },
            { title, content, url, meta_title, meta_desc, meta_keywords, slug, isShown, updatedAt: Date.now() },
            { new: true }
        );

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        return res.status(200).json({ message: 'Page updated successfully', page });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete a page
exports.deletePage = async (req, res) => {
    try {
        const page = await Page.findOneAndDelete({ slug: req.params.slug });

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        return res.status(200).json({ message: 'Page deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.createAnnouncements = async (req, res) => {
    try {
        const { title, status } = req.body;
        const newAnnouncement = new announcements({ title, status });
        await newAnnouncement.save();
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: newAnnouncement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create announcement',
            error: error.message
        });
    }
}
exports.getAnnouncements = async (req, res) => {
    try {
        const FindAnnouncements = await announcements.find();
        return res.status(200).json({
            success: true,
            data: FindAnnouncements,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}


exports.updateAnnouncement = async (req, res) => {
    try {
        console.log(req.body)
        const { title, status } = req.body;
        const updatedAnnouncement = await announcements.findByIdAndUpdate(
            req.params.id,
            { title, status },
            { new: true, runValidators: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: updatedAnnouncement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update announcement',
            error: error.message
        });
    }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const deletedAnnouncement = await announcements.findByIdAndDelete(req.params.id);

        if (!deletedAnnouncement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete announcement',
            error: error.message
        });
    }
};