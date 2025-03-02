const ProductModel = require('../models/Product.model');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'dryfruit/products',
                public_id: fileName
            },
            (error, result) => {
                if (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

exports.createProduct = async (req, res) => {
    try {
        const {
            product_name,
            product_description,
            isVarient,
            price,
            discount,
            afterDiscountPrice,
            stock,
            Varient,
            category,
            sub_category,
            extra_description,
            tag,
            isShowOnHomeScreen
        } = req.body;

        const uploadedImages = [];


        for (const file of req.files) {
            const result = await uploadBufferToCloudinary(file.buffer, file.originalname);
            uploadedImages.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }


        let parsedVarients = JSON.parse(Varient || "[]");
        parsedVarients = parsedVarients.map(variant => {
            if (!variant.price_after_discount || variant.price_after_discount === '') {
                const price = parseFloat(variant.price) || 0;
                const discountPercentage = parseFloat(variant.discount_percentage) || 0;
                const discountAmount = (price * discountPercentage) / 100;
                variant.price_after_discount = (price - discountAmount).toFixed(2);
            }
            return variant;
        });

        let categoriesChile;
        if (sub_category === null) {
            categoriesChile = null
        }
        // Map uploaded images to specific fields
        const productData = {
            product_name,
            product_description,
            isVarient: JSON.parse(isVarient || false),
            Varient: isVarient === 'false' ? [] : parsedVarients,
            category,
            extra_description,
            tag,
            sub_category: categoriesChile,
            price,
            discount,
            afterDiscountPrice,
            stock,
            isShowOnHomeScreen: JSON.parse(isShowOnHomeScreen || false),
            ProductMainImage: uploadedImages[0] || null,
            SecondImage: uploadedImages[1] || null,
            ThirdImage: uploadedImages[2] || null,
            FourthImage: uploadedImages[3] || null,
            FifthImage: uploadedImages[4] || null,
        };



        // Create product in the database
        const product = await ProductModel.create(productData);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message,
        });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 }).populate('category');
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message,
        });
    }
};


exports.getProductsByCategory = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }
        const products = await ProductModel.find({ category: req.query.id }).sort({ createdAt: -1 }).populate('category');
        res.status(200).json({
            success: true,
            count: products.length,
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message,
        });
    }
};
exports.getProductsBySubCategory = async (req, res) => {
    try {
        console.log("sun hshsh", req.params.id)
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }
        const products = await ProductModel.find({ sub_category: req.params.id }).sort({ createdAt: -1 }).populate('category');
        res.status(200).json({
            success: true,
            count: products.length,
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message,
        });
    }
};



exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message,
        });
    }
};



exports.deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateFields = {};

        const {
            product_name,
            product_description,
            isVarient,
            price,
            sub_category,
            discount,
            afterDiscountPrice,
            stock,
            Varient,
            category,
            extra_description,
            tag,
            isShowOnHomeScreen,
        } = req.body;

        console.log(Varient)


        if (product_name !== undefined) updateFields.product_name = product_name;
        if (product_description !== undefined) updateFields.product_description = product_description;
        if (price !== undefined) updateFields.price = price;
        if (discount !== undefined) updateFields.discount = discount;
        if (afterDiscountPrice !== undefined) updateFields.afterDiscountPrice = afterDiscountPrice;
        if (stock !== undefined) updateFields.stock = stock;
        if (category !== undefined) updateFields.category = category;
        if (extra_description !== undefined) updateFields.extra_description = extra_description;
        if (tag !== undefined) updateFields.tag = tag;
        if (sub_category !== undefined) updateFields.sub_category = sub_category;

        if (isVarient !== undefined) {
            updateFields.isVarient = JSON.parse(isVarient);
            let parsedVarients = JSON.parse(Varient || "[]");

            parsedVarients = parsedVarients.map(variant => {
                const price = Number(variant.price) || 0;
                console.log("price:", price);

                const discountPercentage = Number(variant.discount_percentage) || 0;
                console.log("discountPercentage:", discountPercentage);

                const discountAmount = (price * discountPercentage) / 100;
                console.log("discountAmount:", discountAmount);

                const newPriceAfterDiscount = (price - discountAmount).toFixed(2);
                console.log("newPriceAfterDiscount:", newPriceAfterDiscount);

                // Ensure recalculation when discount or price changes
                if (
                    price !== Number(variant.price) ||
                    discountPercentage !== Number(variant.discount_percentage) ||
                    newPriceAfterDiscount !== variant.price_after_discount
                ) {
                    variant.price_after_discount = newPriceAfterDiscount;
                }

                console.log("Updated Variant:", variant);
                return variant;
            });

            updateFields.Varient = parsedVarients;
        }


        if (Varient !== undefined) {
            updateFields.Varient = JSON.parse(Varient || "[]");
        }
        if (isShowOnHomeScreen !== undefined) {
            updateFields.isShowOnHomeScreen = JSON.parse(isShowOnHomeScreen);
        }

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadBufferToCloudinary(file.buffer, file.originalname);

                switch (file.fieldname) {
                    case "ProductMainImage":
                        updateFields.ProductMainImage = {
                            public_id: result.public_id,
                            url: result.secure_url,
                        };
                        break;
                    case "SecondImage":
                        updateFields.SecondImage = {
                            public_id: result.public_id,
                            url: result.secure_url,
                        };
                        break;
                    case "ThirdImage":
                        updateFields.ThirdImage = {
                            public_id: result.public_id,
                            url: result.secure_url,
                        };
                        break;
                    case "FourthImage":
                        updateFields.FourthImage = {
                            public_id: result.public_id,
                            url: result.secure_url,
                        };
                        break;
                    case "FifthImage":
                        updateFields.FifthImage = {
                            public_id: result.public_id,
                            url: result.secure_url,
                        };
                        break;
                    default:
                        // Ignore unknown fields
                        break;
                }
            }
        }

        // Update product in the database
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        console.log("updatedProduct", updatedProduct)
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error: error.message,
        });
    }
};


exports.search_product_and_filter = async (req, res) => {
    try {
        const { query, page = 1 } = req.query;
        const perPage = 10; 
        let filter = {};

        if (query) {
            filter = {
                $or: [
                    { product_name: { $regex: query, $options: 'i' } },
                    { product_description: { $regex: query, $options: 'i' } },
                ],
            };
        }

        let totalProducts = await ProductModel.countDocuments(filter);
        let products = await ProductModel.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('category');

        let message = "Products found based on your search.";

        // If no products found, return all products as fallback
        if (products.length === 0) {
            totalProducts = await ProductModel.countDocuments();
            products = await ProductModel.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate('category');

            message = "No matching products found. Showing all available products.";
        }

        const totalPages = Math.ceil(totalProducts / perPage);

        res.json({
            success: true,
            message,
            totalProducts,
            totalPages,
            currentPage: Number(page),
            data: products,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

