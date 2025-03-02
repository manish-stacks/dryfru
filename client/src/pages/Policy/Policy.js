import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import {
    ChevronRight,
    Shield,
    Clock,
    User,
    ExternalLink
} from 'lucide-react';

const Policy = () => {
    const { page } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://api.dyfru.com/api/v1/admin/page/${page}`
                );
                setData(response.data.page);
            } catch (error) {
                console.error('Error fetching page:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [page]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Shield className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Policy Not Found</h2>
                <p className="text-gray-500 mt-2">The requested policy page could not be found.</p>
                <Link to="/" className="mt-4 text-indigo-600 hover:text-indigo-700">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{data.meta_title}</title>
                <meta name="description" content={data.meta_dec} />
                <meta name="keywords" content={data.meta_keywords?.join(', ')} />
            </Helmet>

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <nav className="flex items-center text-sm mb-6 text-indigo-100">
                                <Link to="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                                <ChevronRight className="w-4 h-4 mx-2" />
                                <span className="font-medium">{data.title}</span>
                            </nav>
                            <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
                            <div className="flex items-center space-x-6 text-sm">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Last updated: {new Date(data.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>Written by {data.write_by}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                          

                            {/* Main Content */}
                            <div className="p-6 lg:p-8">
                                <div
                                    className="prose prose-indigo max-w-none"
                                    dangerouslySetInnerHTML={{ __html: data.content }}
                                />
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 border-t border-gray-100 p-6">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Shield className="w-4 h-4 mr-2" />
                                        <span>Protected by our commitment to privacy</span>
                                    </div>
                                    {/* <a
                                        href={data.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="mr-2">View Original</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Policy;