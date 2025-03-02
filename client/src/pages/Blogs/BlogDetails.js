import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, User } from "lucide-react";
import { Helmet } from "react-helmet";

const BlogDetails = () => {
    const { slug } = useParams();
    const baseUrl = `https://api.dyfru.com/api/v1/blog/${slug}`;
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(baseUrl);
                console.log(response.data.blog);
                setBlog(response.data.blog);
            } catch (error) {
                console.error("Error fetching blog details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogDetails();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-green-600 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-xl font-semibold">
                    Blog not found!
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 bg-green-50 rounded-lg shadow-md">
        

            <Helmet>
                <title>{blog?.meta_title || "Default Title"}</title>
                <meta name="description" content={blog?.metaDescription || "Default description"} />
                <meta
                    name="keywords"
                    content={blog?.metaKeyWord ? blog.metaKeyWord.join(", ") : "default, keywords"}
                />
            </Helmet>

            <h1 className="text-3xl font-bold text-green-800 mb-4">{blog.meta_title}</h1>
            <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
                <div className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-green-700" />
                    <span>{blog.author}</span>
                </div>
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-green-700" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <img
                src={blog.imageUrl}
                alt={blog.meta_title}
                className="w-full h-auto object-cover rounded-lg shadow-sm mb-6"
            />

            <p dangerouslySetInnerHTML={{
                __html: blog.html_content,
            }} className="text-gray-700 leading-relaxed">

            </p>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-green-700">Keywords:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {blog.metaKeyWord.map((keyword, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                        >
                            #{keyword.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
