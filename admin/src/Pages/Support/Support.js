import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Support = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const pageSize = 5; // Number of records per page

    // Fetch all data from the API
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.dyfru.com/api/v1/admin/support-request/all');
            setData(response.data.data); // All data
            setFilteredData(response.data.data); // Initially set filtered data as all data
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter data based on search query and date range
    const filterData = () => {
        let filtered = [...data];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (item) =>
                    item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.Message.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Date filter
        if (startDate) {
            filtered = filtered.filter((item) => new Date(item.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter((item) => new Date(item.createdAt) <= new Date(endDate));
        }

        setFilteredData(filtered);
        setTotalPages(Math.ceil(filtered.length / pageSize));
    };

    useEffect(() => {
        filterData(); // Re-filter data whenever filters change
    }, [searchQuery, startDate, endDate, data]);

    // Paginate the filtered data
    const paginateData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    // Handle date filter change
    const handleDateChange = (e) => {
        if (e.target.name === 'startDate') {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
    };

    // Handle pagination change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by Name, Email, or Message"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded-lg"
                />
                <div>
                    <input
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={handleDateChange}
                        className="px-4 py-2 border rounded-lg mr-2"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={handleDateChange}
                        className="px-4 py-2 border rounded-lg"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border-b">Name</th>
                                <th className="px-4 py-2 border-b">Email</th>
                                <th className="px-4 py-2 border-b">Phone</th>
                                <th className="px-4 py-2 border-b">Message</th>
                                <th className="px-4 py-2 border-b">Date</th>
                                <th className="px-4 py-2 border-b">Read It</th>

                            </tr>
                        </thead>
                        <tbody>
                            {paginateData().map((item) => (
                                <tr key={item._id}>
                                    <td className="px-4 py-2 border-b">{item.Name}</td>
                                    <td className="px-4 py-2 border-b">{item.Email}</td>
                                    <td className="px-4 py-2 border-b">{item.Phone}</td>
                                    <td className="px-4 py-2 border-b">{item.Message}</td>
                                    <td className="px-4 py-2 border-b">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-b">{item?.isContact}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                        Prev
                    </button>
                    <span className="mx-2 dark:text-white">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
