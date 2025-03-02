'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Save, X } from 'lucide-react';

const EditAboutUs = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sections: [],
    contact: {
      email: "",
      phone: "",
      website: "",
      address: "",
    },
    socialLinks: [],
  });

  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const getUrl = "https://api.dyfru.com/api/v1/get-about";
  const editUrl = "https://api.dyfru.com/api/v1/create-or-update-about";

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await axios.get(getUrl);
      setFormData(res.data);
      const initialExpandedState = {};
      res.data.sections.forEach((_, index) => {
        initialExpandedState[index] = false;
      });
      setExpandedSections(initialExpandedState);
    } catch (err) {
      toast.error("Failed to fetch About Us data.");
    }
  };

  const handleChange = (e, field, index, subIndex) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev };

      if (field === "sections") {
        updated.sections[index][name] = value;
      } else if (field === "list") {
        updated.sections[index].list[subIndex][name] = value;
      } else if (field === "contact") {
        updated.contact[name] = value;
      } else if (field === "socialLinks") {
        updated.socialLinks[index][name] = value;
      } else {
        updated[name] = value;
      }

      return updated;
    });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: "", icon: "", content: "", list: [] },
      ],
    }));
    setExpandedSections((prev) => ({
      ...prev,
      [formData.sections.length]: true,
    }));
  };

  const deleteSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    setExpandedSections((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const addListItem = (sectionIndex) => {
    setFormData((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].list.push({
        title: "",
        description: "",
        icon: "",
      });
      return { ...prev, sections: updatedSections };
    });
  };

  const deleteListItem = (sectionIndex, itemIndex) => {
    setFormData((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].list.splice(itemIndex, 1);
      return { ...prev, sections: updatedSections };
    });
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const deleteSocialLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(editUrl, formData);

console.log(res.data)
        toast.success("About Us updated successfully!");
      
    } catch (error) {
        console.error(error)
      toast.error("An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionExpansion = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit About Us</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-semibold">Title</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-semibold">Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Section
            </button>
          </div>
          {formData.sections.map((section, index) => (
            <div key={index} className="border rounded-md p-4 relative">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-700">{section.title || `Section ${index + 1}`}</h4>
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSectionExpansion(index)}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                  >
                    {expandedSections[index] ? 'Collapse' : 'Expand'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSection(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {expandedSections[index] && (
                <>
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="title"
                      placeholder="Section Title"
                      value={section.title}
                      onChange={(e) => handleChange(e, "sections", index)}
                      className="w-full p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      name="icon"
                      placeholder="Section Icon"
                      value={section.icon}
                      onChange={(e) => handleChange(e, "sections", index)}
                      className="w-full p-2 border rounded-md"
                    />
                    <textarea
                      name="content"
                      placeholder="Section Content"
                      value={section.content}
                      onChange={(e) => handleChange(e, "sections", index)}
                      rows="3"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <h5 className="font-semibold text-gray-700 mb-2">List Items</h5>
                    {section.list.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          name="title"
                          placeholder="Item Title"
                          value={item.title}
                          onChange={(e) => handleChange(e, "list", index, itemIndex)}
                          className="flex-grow p-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="description"
                          placeholder="Item Description"
                          value={item.description}
                          onChange={(e) => handleChange(e, "list", index, itemIndex)}
                          className="flex-grow p-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="icon"
                          placeholder="Item Icon"
                          value={item.icon}
                          onChange={(e) => handleChange(e, "list", index, itemIndex)}
                          className="w-20 p-2 border rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => deleteListItem(index, itemIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem(index)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                    >
                      Add Item
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
          {Object.entries(formData.contact).map(([field, value]) => (
            <label key={field} className="block">
              <span className="text-gray-700 font-semibold capitalize">{field}</span>
              <input
                type="text"
                name={field}
                value={value}
                onChange={(e) => handleChange(e, "contact")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
          ))}
        </div>

        {/* <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Social Links</h3>
            <button
              type="button"
              onClick={addSocialLink}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Social Link
            </button>
          </div>
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                name="platform"
                placeholder="Platform"
                value={link.platform}
                onChange={(e) => handleChange(e, "socialLinks", index)}
                className="flex-grow p-2 border rounded-md"
              />
              <input
                type="text"
                name="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleChange(e, "socialLinks", index)}
                className="flex-grow p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => deleteSocialLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div> */}

        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Save size={18} className="mr-2" />
              Save Changes
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditAboutUs;
