const HeroPage = require("../models/Hero.Page");

exports.createHeroPage = async (req, res) => {
    try {
        const existingHeroPage = await HeroPage.findOne();

        if (existingHeroPage) {
            const updatedHeroPage = await HeroPage.findByIdAndUpdate(
                existingHeroPage._id,
                req.body,
                { new: true, runValidators: true }
            );
            return res.status(200).json({ success: true, data: updatedHeroPage });
        }


        const heroPage = new HeroPage(req.body);
        await heroPage.save();

        res.status(201).json({ success: true, data: heroPage });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.getHeroPage = async (req, res) => {
    try {
        const heroPage = await HeroPage.findOne();
        if (!heroPage) {
            return res.status(404).json({ success: false, message: "Hero page not found" });
        }
        res.status(200).json({ success: true, data: heroPage });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });

    }
}