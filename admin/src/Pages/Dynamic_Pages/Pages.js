import React, { useState, useEffect, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Pages = () => {
    const { page } = useParams();
    const [content, setContent] = useState("");
    const [data, setData] = useState(null);
    const [meta, setMeta] = useState({
        meta_title: "",
        meta_desc: "",
        meta_keywords: "",
        url: "",
        slug: "",
        write_by: "",
        isShown: true,
    });
    const editor = useRef(null);

    const config = useMemo(
        () => ({
            readonly: false, // Make the editor editable
            placeholder: "Start typing...",
        }),
        []
    );

    // Fetch page data on component mount
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const { data } = await axios.get(
                    `https://api.dyfru.com/api/v1/admin/page/${page}`
                );
                setData(data.page);
                setContent(data.page.content); // Set the content to be displayed
                setMeta({
                    meta_title: data.page.meta_title,
                    meta_desc: data.page.meta_desc,
                    meta_keywords: data.page.meta_keywords.join(", "),
                    url: data.page.url,
                    slug: data.page.slug,
                    write_by: data.page.write_by,
                    isShown: data.page.isShown,
                }); // Set meta information
            } catch (error) {
                console.error("Error fetching page:", error);
            }
        };

        fetchPage();
    }, [page]);

    // Handle content change in the editor
    const handleContentChange = (newContent) => {
        setContent(newContent);
    };

    // Handle meta information change
    const handleMetaChange = (e) => {
        const { name, value } = e.target;
        setMeta((prevMeta) => ({
            ...prevMeta,
            [name]: value,
        }));
    };

    // Save the updated content and meta information
    const handleSave = async () => {
        try {
            const updatedData = { content, ...meta };
            console.log(updatedData)
            await axios.put(
                `https://api.dyfru.com/api/v1/admin/page/${page}`,
                updatedData
            );
            alert("Page content updated successfully");
        } catch (error) {
            console.error("Error saving page:", error);
            alert("Failed to save page content");
        }
    };

    return (
        <div className="text-gray-800 dark:text-white p-6">
            <h1 className="text-2xl font-semibold mb-6">Edit Page: {data?.title}</h1>

            {/* Display the content */}
            {data ? (
                <div className="space-y-6">
                    {/* Display HTML content */}
                    <div className="relative">
                        {/* Preview Badge */}
                        <span className="absolute top-2 right-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                            Preview
                        </span>

                        {/* Content View */}
                        <div
                            className="content-view bg-gray-100 p-4 rounded-md"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>

                    {/* Jodit Editor */}
                    <div className="relative editor-container mt-4 p-4 rounded-md shadow-md">
                        {/* Edit Badge */}
                        <span className="absolute top-0 z-30 right-2 bg-green-500 text-white text-sm px-7 py-1 rounded-full">
                            Edit
                        </span>

                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            onChange={handleContentChange}
                        />
                    </div>


                    {/* Meta Information Form */}
                    <div className="mt-8 relative  p-6 rounded-md shadow-md">
                        {/* Edit Badge */}
                        <span className="absolute top-0 z-30 right-2 bg-green-500 text-white text-sm px-7 py-1 rounded-full">
                            Edit
                        </span>
                        <h3 className="text-xl font-semibold mb-4">Meta Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="meta_title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    id="meta_title"
                                    name="meta_title"
                                    value={meta.meta_title}
                                    onChange={handleMetaChange}
                                    className="mt-1 block w-full dark:text-gray-900  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="meta_desc"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Meta Description
                                </label>
                                <textarea
                                    id="meta_desc"
                                    name="meta_desc"
                                    value={meta.meta_desc}
                                    onChange={handleMetaChange}
                                    rows="3"
                                    className="mt-1 block w-full dark:text-gray-900  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="meta_keywords"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Meta Keywords
                                </label>
                                <input
                                    type="text"
                                    id="meta_keywords"
                                    name="meta_keywords"
                                    value={meta.meta_keywords}
                                    onChange={handleMetaChange}
                                    className="mt-1 block w-full dark:text-gray-900  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="url"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    URL
                                </label>
                                <input
                                    type="text"
                                    id="url"
                                    name="url"
                                    value={meta.url}
                                    onChange={handleMetaChange}
                                    className="mt-1 block w-full dark:text-gray-900  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="slug"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    value={meta.slug}
                                    onChange={handleMetaChange}
                                    className="mt-1 block w-full dark:text-gray-900  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="write_by"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Written By
                                </label>
                                <input
                                    type="text"
                                    id="write_by"
                                    name="write_by"
                                    value={meta.write_by}
                                    onChange={handleMetaChange}
                                    className="mt-1 block w-full dark:text-gray-900  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="isShown"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Is Visible
                                </label>
                                <input
                                    type="checkbox"
                                    id="isShown"
                                    name="isShown"
                                    checked={meta.isShown}
                                    onChange={(e) =>
                                        handleMetaChange({
                                            target: { name: "isShown", value: e.target.checked },
                                        })
                                    }
                                    className="mt-1 h-4 w-4 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Pages;
