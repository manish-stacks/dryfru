const Settings = require('../models/Setting');


exports.addSettings = async (req, res) => {
    try {
        const newSettings = new Settings(req.body);
        await newSettings.save();
        res.status(201).json({ success: true, data: newSettings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.editSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSettings = await Settings.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedSettings) {
            return res.status(404).json({ success: false, message: "Settings not found" });
        }

        res.status(200).json({ success: true, data: updatedSettings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ success: false, message: "Settings not found" });
        }

        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
