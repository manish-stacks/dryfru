import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const Blogs = () => {
    const baseUrl = "https://api.dyfru.com/api/v1/blog";
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const blogsPerPage = 6;

    const [formData, setFormData] = useState({
        meta_title: "",
        metaKeyWord: [],
        tags: "",
        imageUrl:'',
        slug: "",
        metaDescription: "",
        html_content: "",
    });

    const editor = useRef(null);
    const [content, setContent] = useState("");

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Start typing your blog...",
            height: 400,
        }),
        []
    );

    // Fetch Blogs
    const fetchBlogs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}?page=${page}&limit=${blogsPerPage}`);
            setBlogs(response.data.blogs);
            setTotalPages(Math.ceil(response.data.count / blogsPerPage));
        } catch (error) {
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Keywords Input
    const handleKeywordsChange = (e) => {
        setFormData({ ...formData, metaKeyWord: e.target.value.split(",") });
    };

    // Handle Editor Content
    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, html_content: newContent });
    };

    // Edit Blog
    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setFormData({
            meta_title: blog.meta_title,
            metaKeyWord: blog.metaKeyWord,
            slug: blog.slug,
            imageUrl:blog.imageUrl || '',
            metaDescription: blog.metaDescription,
            html_content: blog.html_content,
        });
        setShowModal(true);
    };

    // Update Blog
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${baseUrl}/${selectedBlog._id}`, formData);
            toast.success("Blog updated successfully!");
            setShowModal(false);
            fetchBlogs(currentPage);
            resetForm();
        } catch (error) {
            toast.error("Failed to update blog");
        }
    };

    // Delete Blog
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await axios.delete(`${baseUrl}/${id}`);
                toast.success("Blog deleted successfully!");
                fetchBlogs(currentPage);
            } catch (error) {
                toast.error("Failed to delete blog");
            }
        }
    };

    // Reset Form
    const resetForm = () => {
        setFormData({
            meta_title: "",
            metaKeyWord: [],
            tags: "",
            slug: "",
            imageUrl:"",
            metaDescription: "",
            html_content: "",
        });
        setSelectedBlog(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-blue-200 rounded w-48"></div>
                    <div className="h-4 bg-blue-200 rounded w-64"></div>
                    <div className="h-4 bg-blue-200 rounded w-52"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Management</h1>

                    {/* Blog List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {blog.meta_title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {blog.metaDescription}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {blog.metaKeyWord.map((keyword, index) => (
                                            keyword && (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {keyword}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {selectedBlog ? "Edit Blog" : "Create Blog"}
                            </h2>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        name="meta_title"
                                        value={formData.meta_title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meta Keywords (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.metaKeyWord.join(",")}
                                        onChange={handleKeywordsChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <small className="text-gray-600 flex items-center space-x-2">
            *Upload Image at
            <a
              href="https://imgbb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 flex items-center"
            >
              <img
                src="https://simgbb.com/images/logo.png"
                alt="ImgBB Logo"
                className=" h-5 ml-1"
              />
            </a>
          </small>

          <label className="block text-sm font-medium text-gray-700 mt-2">
            Image URL
          </label>

          <textarea
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50 text-gray-700 resize-none"
            placeholder="Paste your image URL here..."
            rows="3"
          ></textarea>
        </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Content
                                    </label>
                                    <JoditEditor
                                        ref={editor}
                                        value={formData.html_content}
                                        config={config}
                                        onChange={handleEditorChange}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blogs;