import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Tag, User } from "lucide-react";

const Blogs = () => {
  const baseUrl = "https://api.dyfru.com/api/v1/blog";
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(baseUrl);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Our Blog</h1>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Discover insights, tips, and stories about health, wellness, and the benefits of natural foods
          </p>
        </div>

        {loading ? (
          <div className="text-center text-green-600">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-green-200"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-green-600 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-green-900 mb-3 hover:text-green-700 transition-colors duration-200">
                    <a href={`/blog/${blog.slug}`}>{blog.meta_title}</a>
                  </h2>

                  <p className="text-green-700 mb-4 line-clamp-2">
                    {blog.metaDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.metaKeyWord.map((keyword, index) => (
                      keyword && (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {keyword.trim()}
                        </span>
                      )
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <a
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read More
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 
                  ${currentPage === index + 1
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-700 hover:bg-green-50"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;