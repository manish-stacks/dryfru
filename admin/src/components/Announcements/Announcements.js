import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle } from "lucide-react";

const Announcements = () => {
  const base_url = `https://api.dyfru.com/api/v1`;
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: "", status: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  const fetchAllAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/admin/annoncements`);
      setAnnouncements(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch announcements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedAnnouncement) {
        // Update existing announcement
        await axios.post(`${base_url}/admin/annoncement/${selectedAnnouncement._id}`, formData);
      } else {
        // Create new announcement
        await axios.post(`${base_url}/annoncement`, formData);
      }
      fetchAllAnnouncements();
      closeModal();
    } catch (err) {
      setError("Failed to save the announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        setLoading(true);
        await axios.delete(`${base_url}/admin/annoncements/${id}`);
        fetchAllAnnouncements();
      } catch (err) {
        setError("Failed to delete announcement. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        status: announcement.status,
      });
    } else {
      setSelectedAnnouncement(null);
      setFormData({ title: "", status: false });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
    setFormData({ title: "", status: false });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl dark:text-white text-gray-900 font-bold">Announcements</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Announcement
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      )}

      {/* Announcements List */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{announcement.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        announcement.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {announcement.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(announcement)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isSubmitting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
