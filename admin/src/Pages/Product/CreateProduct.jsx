import React, { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios from 'axios'
const Input = ({ label, type, name, value, onChange, className = "", readonly = false, placeholder = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            readOnly={readonly}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />
    </div>
);

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        product_name: "",
        product_description: "",
        isVarient: false,
        Varient: [

        ],
        category: "",
        sub_category: "",
        extra_description: "",
        tag: "",
        isShowOnHomeScreen: false,
        ProductMainImage: null,
        SecondImage: null,
        ThirdImage: null,
        FourthImage: null,
        FifthImage: null,
        price: '',
        discount: '',
        afterDiscountPrice: "",
        stock: '',
    });
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [isVariantOpen, setIsVariantOpen] = useState(true);
    const [allCategory, setCategory] = useState([])
    const [selectedSubCategories, setSelectedSubCategories] = useState([])

    const handleAddVarients = () => {
        setFormData((prevData) => ({
            ...prevData,
            Varient: [
                ...prevData.Varient,
                {
                    quantity: "",
                    price: "",
                    discount_percentage: "",
                    isStock: false,
                    stock_quantity: "",
                    price_after_discount: "",
                },
            ],
        }));
    };
    const fetchCategoryData = async () => {
        try {
            const res = await axios.get('https://api.dyfru.com/api/v1/admin/category')
            const data = res.data.categories

            console.log("categirr", res.data)
            if (data) {
                setCategory(data)
            }

        } catch (error) {
            console.log(error)
            setCategory([])
        }
    }
    const handleRemoveVarients = (index) => {
        const updatedVarients = formData.Varient.filter((_, i) => i !== index);
        setFormData((prevData) => ({
            ...prevData,
            Varient: updatedVarients,
        }));
    };

    const calculateDiscountPrice = (price, priceDiscountPercentage) => {
        const discountedPrice = price - (price * priceDiscountPercentage) / 100;
        return discountedPrice;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: newValue,
            };

            if (name === 'price' || name === 'discount') {
                const price = name === 'price' ? newValue : updatedData.price;
                const discount = name === 'discount' ? newValue : updatedData.discount;
                const discountedPrice = calculateDiscountPrice(price, discount);
                updatedData.afterDiscountPrice = discountedPrice;
            }

            return updatedData;
        });

        if (name === 'category') {
            const selectedCategory = value;
            const category = allCategory.find((c) => c._id === selectedCategory);
            if (category) {
                setSelectedSubCategories(category.SubCategory);
            } else {
                setSelectedSubCategories([]);
            }
        }


    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const field = name.split('.').pop();

        setFormData((prevData) => {
            const updatedVarients = [...prevData.Varient];
            updatedVarients[index] = {
                ...updatedVarients[index],
                [field]: value,
            };

            return {
                ...prevData,
                Varient: updatedVarients,
            };
        });
    };

    const handleFileChange = (e, imageType) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setFormData((prevData) => ({
                ...prevData,
                [imageType]: {
                    file,
                    previewUrl: reader.result,
                },
            }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true)
        const formDataObject = new FormData();

       Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === 'object' && value.previewUrl) {
            const { previewUrl, ...cleanedValue } = value;
            formDataObject.append(key, cleanedValue.file || value);
        } else if (key === 'Varient') {
            formDataObject.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
            formDataObject.append(key, value);
        }
    });


        try {
            const data = await axios.post('https://api.dyfru.com/api/v1/add-new-product', formDataObject, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(data.data)
            if (data.data.success) {
                setSuccess(true)
                setError('')
                setLoading(false)
                console.log('Product added successfully')
            } else {
                setSuccess(false)
                setError(data.data.message)
                setLoading(false)
            }
            setTimeout(() => {
                setSuccess(false)
                setError('')
                setLoading(false)
            }, 4000)
        } catch (error) {
            setSuccess(false)
            setError(error.response.data.message || "Please Re try to add a new product ,Some Error In System Settings")
            setLoading(false)
            console.log(error)
        }

    };
    useEffect(() => {
        fetchCategoryData()
    }, [])

    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75 z-50">
                <div className="text-center">
                    {/* Spinner */}
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>

                    {/* Loading Text */}
                    <p className="mt-4 text-lg font-semibold text-white">
                        Please wait, adding the product. It might take a moment due to image uploading.
                    </p>
                </div>
            </div>
        );
    }


    if (success) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75 z-50">
                {/* Success Modal */}
                <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                    <h2 className="text-xl font-semibold text-green-500">Product Added Successfully!</h2>
                    <p className="mt-4 text-gray-700">Your product has been added successfully. You can now proceed with other actions.</p>

                    <button
                        onClick={() => {
                            setSuccess(false);
                        }}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 ">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Create New Product</h1>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Product Name"
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleInputChange}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData?.category || ''}
                                onChange={handleInputChange}
                                className="custom-select"
                            >
                                <option value="">Select Category</option>
                                {allCategory?.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sub Category
                            </label>
                            <select
                                name="sub_category"
                                value={formData?.sub_category || ''}
                                onChange={handleInputChange}
                                className="custom-select"
                            >
                                <option value="">Select Sub Category</option>
                                {selectedSubCategories?.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Product Description"
                            type="text"
                            name="product_description"
                            value={formData.product_description}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Extra Description"
                            type="text"
                            name="extra_description"
                            value={formData.extra_description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-4">
                        <div className="border-black border-2 dark:border-gray-300 rounded-3xl px-12 py-3">
                            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                <span>Enable Product Variants</span>
                                <input
                                    type="checkbox"
                                    name="isVarient"
                                    checked={formData.isVarient}
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <div className="relative">
                                    <div
                                        className={`w-14 h-5 rounded-full transition duration-300 ease-in-out ${formData.isVarient ? 'bg-indigo-600' : 'bg-gray-400'}`}
                                    >
                                        <div
                                            className={`absolute top-1 left-1 w-6 h-3 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${formData.isVarient ? 'transform translate-x-6' : ''}`}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className="border-black border-2  dark:border-gray-300 rounded-3xl px-12 py-3">
                            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                <span>Enable Home Screen Preview</span>
                                <input
                                    type="checkbox"
                                    name="isShowOnHomeScreen"
                                    checked={formData.isShowOnHomeScreen}
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <div className="relative">
                                    <div
                                        className={`w-14 h-5 rounded-full transition duration-300 ease-in-out ${formData.isShowOnHomeScreen ? 'bg-indigo-600' : 'bg-gray-400'}`}
                                    >
                                        <div
                                            className={`absolute top-1 left-1 w-6 h-3 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${formData.isShowOnHomeScreen ? 'transform translate-x-6' : ''}`}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {formData.isVarient === false && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Input
                                label="Price"
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Discount"
                                type="text"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Final Price"
                                type="text"
                                name="afterDiscountPrice"
                                readonly={true}
                                value={formData.afterDiscountPrice}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Stock"
                                type="text"
                                name="stock"

                                value={formData.stock}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    {/* Variants Section */}
                    {formData.isVarient && (
                        <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setIsVariantOpen(!isVariantOpen)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 text-left text-gray-900 dark:text-white font-medium"
                            >
                                <span>Product Variants</span>
                                {isVariantOpen ? <FiChevronUp /> : <FiChevronDown />}
                            </button>

                            {isVariantOpen && (
                                <div className="p-4 space-y-4">
                                    {formData.Varient.map((variant, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Write Weight of Product (ex:500gram , 2Kg)"
                                                    type="text"
                                                    placeholder="Write Weight of Product"
                                                    name={`Varient[${index}].quantity`}
                                                    value={variant.quantity}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                                <Input
                                                    label="Price"
                                                    type="number"
                                                    name={`Varient[${index}].price`}
                                                    value={variant.price}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                                <Input
                                                    label="Discount Percentage"
                                                    type="number"
                                                    name={`Varient[${index}].discount_percentage`}
                                                    value={variant.discount_percentage}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                                <Input
                                                    label="Stock Quantity"
                                                    type="number"
                                                    name={`Varient[${index}].stock_quantity`}
                                                    value={variant.stock_quantity}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                            </div>

                                            {variant.price && variant.discount_percentage && (
                                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                        Price After Discount:{" "}
                                                        <span className="font-semibold">
                                                            Rs:{calculateDiscountPrice(variant.price, variant.discount_percentage)}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex space-x-2 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveVarients(index)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                                >
                                                    Remove Variant
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddVarients}
                                        className="w-full py-2 px-4 border bg-gray-800 text-white rounded-md mt-4"
                                    >
                                        Add Variant
                                    </button>
                                </div>
                            )}
                        </div>
                    )}


                    <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {/* Main Image */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                                    Main Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'ProductMainImage')}
                                    className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                {formData.ProductMainImage && (
                                    <div className="mt-4">
                                        <img
                                            src={formData.ProductMainImage.previewUrl}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Second Image */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                                    Second Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'SecondImage')}
                                    className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                {formData.SecondImage && (
                                    <div className="mt-4">
                                        <img
                                            src={formData.SecondImage.previewUrl}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Third Image */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                                    Third Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'ThirdImage')}
                                    className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                {formData.ThirdImage && (
                                    <div className="mt-4">
                                        <img
                                            src={formData.ThirdImage.previewUrl}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Fourth Image */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                                    Fourth Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'FourthImage')}
                                    className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                {formData.FourthImage && (
                                    <div className="mt-4">
                                        <img
                                            src={formData.FourthImage.previewUrl}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Fifth Image */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                                    Fifth Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'FifthImage')}
                                    className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                {formData.FifthImage && (
                                    <div className="mt-4">
                                        <img
                                            src={formData.FifthImage.previewUrl}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Create Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
