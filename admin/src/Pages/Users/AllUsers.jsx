import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    searchTerm: '',
    isVerified: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.dyfru.com/api/v1/admin/get-users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and pagination to the users
  const applyFiltersAndPagination = () => {
    let filteredData = users;

    // Apply search filter
    if (filters.searchTerm) {
      filteredData = filteredData.filter(user =>
        user.Name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.startDate) {
      filteredData = filteredData.filter(user =>
        new Date(user.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filteredData = filteredData.filter(user =>
        new Date(user.createdAt) <= new Date(filters.endDate)
      );
    }

    // Apply verification filter
    if (filters.isVerified !== '') {
      filteredData = filteredData.filter(user =>
        user.isVerified.toString() === filters.isVerified
      );
    }

    // Apply pagination
    const itemsPerPage = 10;
    const startIndex = (pagination.currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    setFilteredUsers(paginatedData);
    setPagination({
      ...pagination,
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
    });
  };

  // Update filters state
  const handleSearchChange = (e) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };

  const handleDateChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, isVerified: e.target.value });
  };

  const handlePaginationChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleDelete = async (id) => {
    console.log("Deleting user with ID:", id);
    try {
      const response = await axios.delete(`https://api.dyfru.com/api/v1/admin/delete/${id}`);

      if (response.data.success) {
        setUsers(users.filter(user => user._id !== id));
        toast.success('User deleted successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };





  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [filters, pagination.currentPage, users]);

  return (
    <div className="container mx-auto p-6">

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block dark:text-white text-gray-900  text-sm font-medium mb-1">Search by Name, Email, or Phone</label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm dark:text-white text-gray-900 font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm dark:text-white text-gray-900 font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* User Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">Loading...</td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user.Name}</td>
                <td className="py-2 px-4 border-b">{user.Email}</td>
                <td className="py-2 px-4 border-b">{user.ContactNumber}</td>
                <td className="py-2 px-4 border-b">{user.Role}</td>
                <td className="py-2 px-4 border-b">
                  
                  <button
                   onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePaginationChange(1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          First
        </button>
        <div className='dark:text-white text-gray-900'>
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <button
          onClick={() => handlePaginationChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
