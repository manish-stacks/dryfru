import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SubCategory = ({ isOpen = true, onClose, selectedCategory }) => {
    console.log(selectedCategory);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [editSubCategoryId, setEditSubCategoryId] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.dyfru.com/api/v1/admin/sub-category/${selectedCategory}`);
            if (response.data.subcategories) {
                setSubCategories(response.data.subcategories);
            } else {
                setSubCategories([]);
            }
        } catch (error) {
            console.error(error);
            setSubCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const updateSubCategory = async (subCategoryId) => {
        setLoading(true);
        try {
            await axios.put(`https://api.dyfru.com/api/v1/admin/sub-category/edit/${subCategoryId}`, { name });

            toast.success('Subcategory updated successfully');
            fetchCategories()
        } catch (error) {
            console.error(error);
            toast.error('Error updating subcategory');
        } finally {
            setLoading(false);
        }
    };

    const deleteSubCategory = async (subCategoryId) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            setLoading(true);
            try {
                await axios.delete(`https://api.dyfru.com/api/v1/admin/sub-category/delete/${subCategoryId}`);
                toast.success('Subcategory deleted successfully');
                fetchCategories()
            } catch (error) {
                console.error(error);
                toast.error('Error deleting subcategory');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchCategories();
        }
    }, [selectedCategory]);

    return (
        <>
            {/* Modal background */}
            {isOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    {/* Modal content */}
                    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
                        {/* Modal header with close button */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Sub Categories</h3>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal body */}
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div>
                                {subCategories.length > 0 ? (
                                    <ul>
                                        {subCategories.map((subCategory) => (
                                            <li key={subCategory._id} className="flex justify-between items-center py-2">
                                                <span>{subCategory.name}</span>

                                                {/* Edit button to trigger the update */}
                                                <button
                                                    onClick={() => {
                                                        setEditSubCategoryId(subCategory._id);
                                                        setName(subCategory.name); // Pre-fill with the current name
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete button */}
                                                <button
                                                    onClick={() => deleteSubCategory(subCategory._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No subcategories available</p>
                                )}
                            </div>
                        )}

                        {/* Update Subcategory Form */}
                        {editSubCategoryId && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Edit Subcategory</h4>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border px-3 py-2 rounded-md w-full mt-2"
                                />
                                <div className="mt-2 flex justify-between">
                                    <button
                                        onClick={() => updateSubCategory(editSubCategoryId)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditSubCategoryId(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Modal footer */}
                        <div className="mt-4 flex justify-end">
                            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubCategory;
