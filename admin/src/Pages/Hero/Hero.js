import React, { useEffect, useState } from "react";
import { ArrowRight, Leaf, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import almonds from "./almonds.png";

const Hero = () => {
    const [heroPageData, setHeroPageData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        const fetchHeroPageData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "https://api.dyfru.com/api/v1/admin/get/hero_page"
                );
                setHeroPageData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchHeroPageData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHeroPageData((prevData) => ({ ...prevData, [name]: value }));
    };

    const updateHeroPageData = async () => {
        try {
            setLoading(true);
            await axios.post("https://api.dyfru.com/api/v1/admin/create_and_update/hero_page", heroPageData);
            setIsEditable(false); // Exit edit mode after update
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden px-0 md:px-10">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[length:20px_20px]" />

            <div className="relative w-full mx-auto px-4 pt-6 md:pt-24 pb-16 sm:pt-32 lg:pt-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {isEditable ? (
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="tag_line" className="block text-sm font-medium text-gray-700">
                                        Tag Line
                                    </label>
                                    <input
                                        type="text"
                                        id="tag_line"
                                        name="tag_line"
                                        value={heroPageData.tag_line || ""}
                                        onChange={handleInputChange}
                                        placeholder="Tag Line"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="first_title" className="block text-sm font-medium text-gray-700">
                                        First Title
                                    </label>
                                    <input
                                        type="text"
                                        id="first_title"
                                        name="first_title"
                                        value={heroPageData.first_title || ""}
                                        onChange={handleInputChange}
                                        placeholder="First Title"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="second_title" className="block text-sm font-medium text-gray-700">
                                        Second Title
                                    </label>
                                    <input
                                        type="text"
                                        id="second_title"
                                        name="second_title"
                                        value={heroPageData.second_title || ""}
                                        onChange={handleInputChange}
                                        placeholder="Second Title"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={heroPageData.description || ""}
                                        onChange={handleInputChange}
                                        placeholder="Description"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="button_title" className="block text-sm font-medium text-gray-700">
                                        Button Title
                                    </label>
                                    <input
                                        type="text"
                                        id="button_title"
                                        name="button_title"
                                        value={heroPageData.button_title || ""}
                                        onChange={handleInputChange}
                                        placeholder="Button Title"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="button_href" className="block text-sm font-medium text-gray-700">
                                        Button Href
                                    </label>
                                    <input
                                        type="text"
                                        id="button_href"
                                        name="button_href"
                                        value={heroPageData.button_href || ""}
                                        onChange={handleInputChange}
                                        placeholder="Button Href"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        id="image"
                                        name="image"
                                        value={heroPageData.image || ""}
                                        onChange={handleInputChange}
                                        placeholder="Image URL"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sticky_note_content" className="block text-sm font-medium text-gray-700">
                                        Sticky Note Content
                                    </label>
                                    <input
                                        type="text"
                                        id="sticky_note_content"
                                        name="sticky_note_content"
                                        value={heroPageData.sticky_note_content || ""}
                                        onChange={handleInputChange}
                                        placeholder="Sticky Note Content"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sticky_note_content_p" className="block text-sm font-medium text-gray-700">
                                        Sticky Note Content P
                                    </label>
                                    <input
                                        type="text"
                                        id="sticky_note_content_p"
                                        name="sticky_note_content_p"
                                        value={heroPageData.sticky_note_content_p || ""}
                                        onChange={handleInputChange}
                                        placeholder="Sticky Note Content P"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="sticky_note_Second_content" className="block text-sm font-medium text-gray-700">
                                        Sticky Note Second Content
                                    </label>
                                    <input
                                        type="text"
                                        id="sticky_note_content_second"
                                        name="sticky_note_content_second"
                                        value={heroPageData.sticky_note_content_second || ""}
                                        onChange={handleInputChange}
                                        placeholder="Sticky Note Second Content"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sticky_note_content_p" className="block text-sm font-medium text-gray-700">
                                        Sticky Note Second Content P
                                    </label>
                                    <input
                                        type="text"
                                        id="sticky_note_content_second_p"
                                        name="sticky_note_content_second_p"
                                        value={heroPageData.sticky_note_content_second_p || ""}
                                        onChange={handleInputChange}
                                        placeholder="Sticky Note Content P"
                                        className="border rounded-lg px-4 py-2 w-full"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={updateHeroPageData}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </form>

                        ) : (
                            <>
                                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full text-green-700 font-medium text-sm">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    {heroPageData?.tag_line || "Tag Line"}
                                </div>
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
                                    {heroPageData?.first_title || "Title One"}
                                    <span className="block mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {heroPageData?.second_title || "Title Two"}
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-600 max-w-xl">
                                    {heroPageData?.description || "Shop Collection"}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        to={heroPageData?.button_href || "/shop"}
                                        className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                                    >
                                        {heroPageData?.button_title || "Shop Collection"}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
                                    <div className="mt-4">
                                        <p>
                                            <strong>Sticky Note Content:</strong> {heroPageData.sticky_note_content || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Sticky Note Content P:</strong> {heroPageData.sticky_note_content_p || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Sticky Note Second Content:</strong> {heroPageData.sticky_note_content_second || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Sticky Note Second Content P:</strong> {heroPageData.sticky_note_content_second_p || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => setIsEditable(!isEditable)}
                            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg"
                        >
                            {isEditable ? "Cancel" : "Edit Hero Section"}
                        </button>
                    </div>

                    {/* Right Column */}
                    <div className="relative z-50">
                        <img
                            src={heroPageData?.image || "https://via.placeholder.com/500"}
                            alt="Hero Section"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
