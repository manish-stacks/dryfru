import { DoorClosed, PackageX, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import SubCategory from './SubCategory';

const Categories = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [ViewselectedCategory, setViewSelectedCategory] = useState(null);
    const [add_sub_model, setAdd_sub_model] = useState(false);
    const [add_cat_model, setAdd_cat_model] = useState(false);
    const [view_sub_model, setView_sub_model] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.dyfru.com/api/v1/admin/category');

            if (response.data.categories) {
                setData(response.data.categories);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error(error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            setLoading(true);
            try {
                await axios.delete(`https://api.dyfru.com/api/v1/admin/category-del/${id}`);
                toast.promise(
                    fetchCategories(),
                    {
                        pending: "Deleting category...",
                        success: "Category deleted successfully! 🎉",
                        error: "Error while deleting category. 😞",
                    }
                );
            } catch (error) {
                console.error(error);
                toast.error("Error in Category Deleting");
            } finally {
                setLoading(false);
            }
        } else {
            toast("Category deletion cancelled", {
                icon: "🚫",
                style: {
                    border: "1px solid #f44336",
                    padding: "16px",
                    color: "#f44336",
                },
            });
        }
    };

    const AddCategory = async () => {
        setLoading(true);
        try {
            await axios.post(
                `https://api.dyfru.com/api/v1/admin/create/category`,
                { name }
            );
            fetchCategories();
            setAdd_cat_model(false);
            setName('');
            toast.success("Category Added successfully")

        } catch (error) {
            console.error(error);
            toast.error("Error In Added  Category !!")

        } finally {
            setLoading(false);
            setAdd_cat_model(false);
        }
    };

    const updateCategory = async () => {
        setLoading(true);
        try {
            await axios.put(
                `https://api.dyfru.com/api/v1/admin/category/edit/${selectedCategory}`,
                { name }
            );
            fetchCategories();
            setSelectedCategory(null);
            setName('');
            toast.success("Category Updated successfully")

        } catch (error) {
            console.error(error);
            toast.error("Error In Updateing Sub Category !!")

        } finally {
            setLoading(false);
        }
    };
    const AddSubCategory = async () => {
        setLoading(true);
        try {
            await axios.post(
                `https://api.dyfru.com/api/v1/admin/create/sub-category/${selectedCategory}`,
                { name }
            );
            toast.success("Sub Category Added successfully")
            setAdd_sub_model(false)
            fetchCategories();
            setSelectedCategory(null);
            setName('');
        } catch (error) {
            console.error(error);
            toast.error("Error In Adding Sub Category !!")

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="py-10">
            <div className="bg-gray-200 py-3 px-4 rounded flex items-center justify-between">
                <h2 className="text-xl font-bold flex gap-3 text-pretty">
                    <PackageX />
                    Categories
                </h2>
                <Link
                    onClick={() => setAdd_cat_model(true)}
                    className="text-sm transition-colors ease-linear rounded-full text-gray-800 hover:bg-green-600 hover:text-white font-medium flex gap-3 bg-green-500 py-2 px-3"
                >
                    <Plus />
                    Add Category
                </Link>
            </div>

            {loading ? (
                <p className="text-center my-4">Loading...</p>
            ) : (
                <div className="mt-5 dark:bg-white">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">#</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Subcategories</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((category, index) => (
                                <tr key={category._id}>
                                    <td className="border border-gray-300  text-black px-4 py-2 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-300  text-black px-4 py-2">{category.name}</td>
                                    <td className="border border-gray-300  text-black px-4 py-2">
                                        {category.SubCategory.length}
                                    </td>
                                    <td className="border border-gray-300  text-black px-4 py-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(category._id);
                                                setName(category.name);
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAdd_sub_model(true);
                                                setSelectedCategory(category._id);
                                            }}
                                            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                                        >
                                            + Sub Category
                                        </button>
                                        <button
                                            onClick={() => {
                                                setView_sub_model(true);
                                                setViewSelectedCategory(category._id);
                                            }}
                                            className="bg-violet-500 text-white px-3 py-1 rounded hover:bg-violet-600"
                                        >
                                            View Sub Category
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedCategory && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 p-6 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => {
                                setSelectedCategory(null);
                                setName('');
                            }}
                        >
                            <X />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Edit Category</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                            placeholder="Enter new category name"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setName('');
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateCategory}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {add_sub_model && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 p-6 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => {
                                setAdd_sub_model(false);
                                setSelectedCategory(null);
                                setName('');
                            }}
                        >
                            <X />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Add Sub Category</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                            placeholder="Enter new category name"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setName('');
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={AddSubCategory}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {add_cat_model && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 p-6 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => {
                                setAdd_cat_model(false);
                            
                                setName('');
                            }}
                        >
                            <X />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Add Category</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                            placeholder="Enter new category name"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setAdd_cat_model(false);
                                    setName('');
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={AddCategory}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {ViewselectedCategory && (
                <SubCategory onClose={() => setView_sub_model(false)} isOpen={view_sub_model} selectedCategory={ViewselectedCategory} />
            )}
        </div>
    );
};

export default Categories;
