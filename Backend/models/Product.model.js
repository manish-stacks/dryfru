const mongoose = require("mongoose");

const varient_schema = new mongoose.Schema({
    quantity: {
        type: String,

    },
    price: {
        type: Number,

    },
    price_after_discount: {
        type: Number,

    },
    discount_percentage: {
        type: Number,

    },
    isStock: {
        type: Boolean,

    },
    stock_quantity: {
        type: Number,

    },
});

const Product_Schema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_description: {
            type: String,
            required: true,
        },
        ProductMainImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        SecondImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        ThirdImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        FourthImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        FifthImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        price: {
            type: Number,

        },
        discount: {
            type: Number,
            default: 0,
        },
        afterDiscountPrice: {
            type: Number,
            default: null,
        },
        stock: {
            type: Number,
            default: null,
        },
        isVarient: {
            type: Boolean,
            default: false,
        },
        Varient: [varient_schema],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        sub_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            default: null,
        },
        extra_description: {
            type: String,
            default: null,
        },
        tag: {
            type: String,
        },
        isShowOnHomeScreen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

Product_Schema.pre("save", function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});


Product_Schema.add({
    updatedAt: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model("Product", Product_Schema);
