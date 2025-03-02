import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Star, Edit2, Trash2, X, MessageSquare, User, Package, ThumbsUp } from "lucide-react";

const TestimonialGet = () => {
  const baseUrl = "https://api.dyfru.com/api/v1/testimonial";
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      setTestimonials(response.data.testimonials);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      toast.success("Testimonial deleted successfully!");
      setDeleteConfirm(null);
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/${selectedTestimonial._id}`, selectedTestimonial);
      toast.success("Testimonial updated successfully!");
      setShowModal(false);
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to update testimonial");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="p-6 border rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  const RatingStars = ({ rating }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6  border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Customer Testimonials
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {testimonial.gender}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(testimonial._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                        <p className="text-gray-600">{testimonial.message}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="h-5 w-5 text-gray-400" />
                        <RatingStars rating={testimonial.rating} />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Purchased: {testimonial.whatPurchased}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Testimonial
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6  overflow-scroll h-[85vh] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedTestimonial.name}
                  onChange={(e) =>
                    setSelectedTestimonial({
                      ...selectedTestimonial,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={selectedTestimonial.message}
                  onChange={(e) =>
                    setSelectedTestimonial({
                      ...selectedTestimonial,
                      message: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={selectedTestimonial.rating}
                  onChange={(e) =>
                    setSelectedTestimonial({
                      ...selectedTestimonial,
                      rating: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Purchased
                </label>
                <input
                  type="text"
                  value={selectedTestimonial.whatPurchased}
                  onChange={(e) =>
                    setSelectedTestimonial({
                      ...selectedTestimonial,
                      whatPurchased: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={selectedTestimonial.gender}
                  onChange={(e) =>
                    setSelectedTestimonial({
                      ...selectedTestimonial,
                      gender: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialGet;