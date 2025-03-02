import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';

const Coupon = () => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    minimumOrderAmount: '',
    expirationDate: '',
    isActive: false,
  });
  const [allCoupons, setAllCoupons] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.dyfru.com/api/v1/get-coupon');
      setAllCoupons(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const createAndEditCoupon = async (type) => {
    try {
      setLoading(true);
      if (type === 'edit') {
        await axios.post(`https://api.dyfru.com/api/v1/update-coupon/${selectedCoupon?.code}`, formData);
      } else {
        await axios.post('https://api.dyfru.com/api/v1/add-coupon', formData);
      }
      setSuccess('Coupon saved successfully!');
      setLoading(false);
      setOpenModal(false);
      fetchCoupons();
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message);
      setLoading(false);
    }
  };

  const deleteCoupon = async (code) => {
    try {
      setLoading(true);
      await axios.delete(`https://api.dyfru.com/api/v1/delete-coupon/${code}`);
      setSuccess('Coupon deleted successfully!');
      setLoading(false);
      fetchCoupons();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      minimumOrderAmount: coupon.minimumOrderAmount,
      expirationDate: coupon.expirationDate,
      isActive: coupon.isActive,
    });
    setOpenModal(true);
  };

  const paginatedCoupons = allCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl dark:text-white text-gray-9000 font-bold">Coupons</h1>
        <button
          onClick={() => {
            setFormData({ code: '', discount: '', minimumOrderAmount: '', expirationDate: '', isActive: false });
            setSelectedCoupon(null);
            setOpenModal(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Code</th>
            <th className="border border-gray-300 px-4 py-2">Discount</th>
            <th className="border border-gray-300 px-4 py-2">Min Order</th>
            <th className="border border-gray-300 px-4 py-2">Expires On</th>
            <th className="border border-gray-300 px-4 py-2">Active</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCoupons.map((coupon) => (
            <tr key={coupon.code}>
              <td className="border dark:text-white text-gray-900 border-gray-300 px-4 py-2">{coupon.code}</td>
              <td className="border dark:text-white text-gray-900 border-gray-300 px-4 py-2">{coupon.discount}</td>
              <td className="border dark:text-white text-gray-900 border-gray-300 px-4 py-2">{coupon.minimumOrderAmount}</td>
              <td className="border dark:text-white text-gray-900 border-gray-300 px-4 py-2">{coupon.expirationDate}</td>
              <td className="border dark:text-white text-gray-900 border-gray-300 px-4 py-2">{coupon.isActive ? 'Yes' : 'No'}</td>
              <td className="border dark:text-white text-gray-900 border-gray-300 px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteCoupon(coupon.code)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(allCoupons.length / itemsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {openModal && (
        <div className="fixed  z-50 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6  overflow-scroll rounded max-h-[90vh] w-1/2">
            <h2 className="text-xl font-bold mb-4">{selectedCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAndEditCoupon(selectedCoupon ? 'edit' : 'create');
              }}
            >
              <div className="mb-4">
                <label className="block mb-1 font-medium">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  disabled={!!selectedCoupon}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Minimum Order Amount</label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  value={formData.minimumOrderAmount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Expiration Date</label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Active</label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: 'isActive',
                        value: e.target.checked,
                      },
                    })
                  }
                  className="form-checkbox"
                />
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="ml-4 bg-gray-300 text-white px-4 py-2 rounded mt-4 hover:bg-gray-400"
                >
                  Cancel
                </button>
                {selectedCoupon && (
                  <button
                    type="button"
                    onClick={() => deleteCoupon(selectedCoupon.code)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
              {loading && <div className="text-center mt-4">Loading...</div>}
              {error && <div className="text-red-500 mt-4">{error}</div>}
              {success && <div className="text-green-500 mt-4">{success}</div>}
            </form>
          </div>
        </div>
      )}

    </div>

  )
}
export default Coupon

