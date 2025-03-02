import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TestimonialCreate = () => {
    const createUrl = "https://api.dyfru.com/api/v1/testimonial";

    const [formData, setFormData] = useState({
        name: "",
        message: "",
        rating: 0,
        whatPurchased: "",
        gender: "",
    });

    const [loading, setLoading] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(createUrl, formData);
            toast.success("Testimonial added successfully!");
            setFormData({
                name: "",
                message: "",
                rating: 0,
                whatPurchased: "",
                gender: "",
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Add Testimonial</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block font-medium">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
                        required
                    ></textarea>
                </div>

                {/* Rating */}
                <div>
                    <label className="block font-medium">Rating (1-5)</label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* What Purchased */}
                <div>
                    <label className="block font-medium">What Purchased</label>
                    <input
                        type="text"
                        name="whatPurchased"
                        value={formData.whatPurchased}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block font-medium">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default TestimonialCreate;
