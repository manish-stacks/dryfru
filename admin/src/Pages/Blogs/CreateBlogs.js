import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateBlogs = () => {
  const url = `https://api.dyfru.com/api/v1/blog`;

  const [formData, setFormData] = useState({
    meta_title: "",
    metaKeyWord: [],
    tags: "",
    slug: "",
    imageUrl: '',
    metaDescription: "",
    html_content: "",
  });

  const editor = useRef(null);
  const [content, setContent] = useState("");

  // Jodit Editor Config
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing your blog...",
    }),
    []
  );

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Keywords Input
  const handleKeywordsChange = (e) => {
    setFormData({ ...formData, metaKeyWord: e.target.value.split(",") });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const blogData = { ...formData, html_content: content };

      const response = await axios.post(url, blogData);

      if (response.data.success) {
        toast.success("Blog created successfully!");
        setFormData({
          meta_title: "",
          metaKeyWord: [],
          imageUrl: '',
          tags: "",
          slug: "",
          metaDescription: "",
          html_content: "",
        });
        setContent("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Keywords (comma-separated)</label>
          <input
            type="text"
            name="metaKeyWord"
            value={formData.metaKeyWord.join(",")}
            onChange={handleKeywordsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Meta Description */}
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
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        {/* Jodit Editor for HTML Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Blog Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlogs;
