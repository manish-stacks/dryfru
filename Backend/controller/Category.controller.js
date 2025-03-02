const Category = require('../models/Category.model');
const SubCategory = require('../models/SubCategory.model');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('SubCategory', 'name');
        res.status(200).json({ message: "Categories fetched successfully", categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category fetched successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error });
    }
};


exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
};

exports.addSubcategory = async (req, res) => {
    try {
        const category_id = req.params.id
        if (!category_id) {
            return res.status(400).json({ message: "Invalid category id" })
        }
        const checkCategory = await Category.findById(category_id)
        if (!checkCategory) {
            return res.status(404).json({ message: "Category not found" })
        }

        const { name } = req.body

        if (!name) {
            return res.status(400).json({ message: "Subcategory name is required" })
        }
        const newSubcategory = new SubCategory({ name, main_category: category_id })

        await newSubcategory.save()
        checkCategory.SubCategory.push(newSubcategory._id);
        await checkCategory.save()

        res.status(201).json({ message: "Subcategory created successfully", subcategory: newSubcategory })

    } catch (error) {
        res.status(501).json({
            message: "Error creating subcategory",
            error: error.message
        })
    }
}

exports.UpdateSubcategory = async (req, res) => {
    try {
        const sub_category_id = req.params.id;

        if (!sub_category_id) {
            return res.status(400).json({ message: "Invalid subcategory ID" });
        }

        const check_Sub_Category = await SubCategory.findById(sub_category_id);
        if (!check_Sub_Category) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        const { name, new_category } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Subcategory name is required" });
        }

        if (new_category) {
            const checkCategory = await Category.findById(new_category);
            if (!checkCategory) {
                return res.status(404).json({ message: "Associated category not found" });
            }

            const oldCategory = await Category.findById(check_Sub_Category.main_category);

            if (oldCategory) {
                oldCategory.SubCategory = oldCategory.SubCategory.filter(
                    (subcategoryId) => subcategoryId.toString() !== sub_category_id
                );
                await oldCategory.save();
            }

            checkCategory.SubCategory.push(sub_category_id);
            await checkCategory.save();

            check_Sub_Category.main_category = new_category;
        }

        check_Sub_Category.name = name;

        await check_Sub_Category.save();

        res.status(200).json({
            message: "Subcategory updated successfully",
            subcategory: check_Sub_Category,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating subcategory",
            error: error.message,
        });
    }
};


exports.deleteSubcategory = async (req, res) => {
    try {
        const sub_category_id = req.params.id;

        // Check if subcategory ID is provided
        if (!sub_category_id) {
            return res.status(400).json({ message: "Invalid subcategory ID" });
        }

        // Find the subcategory by ID
        const check_Sub_Category = await SubCategory.findById(sub_category_id);
        if (!check_Sub_Category) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // Find the associated category
        const category = await Category.findById(check_Sub_Category.main_category);
        if (!category) {
            return res.status(404).json({ message: "Associated category not found" });
        }

        // Remove the subcategory reference from the category's SubCategory array
        category.SubCategory = category.SubCategory.filter(
            (subcategoryId) => subcategoryId.toString() !== sub_category_id
        );
        await category.save();


        await SubCategory.findByIdAndDelete(sub_category_id);

        res.status(200).json({
            message: "Subcategory deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting subcategory",
            error: error.message,
        });
    }
};


exports.getSubcategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const category = await Category.findById(categoryId).populate({
            path: "SubCategory",
            select: "name",
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Subcategories retrieved successfully",
            subcategories: category.SubCategory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving subcategories",
            error: error.message,
        });
    }
};
