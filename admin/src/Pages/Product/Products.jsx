import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    axios.get('https://api.dyfru.com/api/v1/get-product')
      .then(response => {
        if (response.data.success) {
          console.log(response.data)
          setProducts(response.data.products);
        }
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log('Delete product:', id);
  };

  const handleEdit = (id) => {
    window.location.href = `/products/edit/${id}`
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await axios.delete(`https://api.dyfru.com/api/v1/delete-product/${id}`)
      if (res.data.success) {
        setProducts(products.filter(product => product._id !== id))
        toast.success("Product deleted successfully")
      } else {
        console.log("Error deleting product", res.data.message)
      }
    } catch (error) {
      console.log("Internal server error", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.ProductMainImage.url}
                        alt={product.product_name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.product_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.isVarient ? (
                    <div className="text-sm text-gray-900">
                      {product.Varient.length > 0 && (
                        <>
                          ₹{product.Varient[0].price}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">
                      ₹{product.price}

                    </div>
                  )}
                </td>
                <td>
                  {product.isVarient ? (
                    <div className="text-sm text-gray-900">
                      {product.Varient.length > 0 && (
                        <>
                          {product.Varient[0].discount_percentage}%
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">
                      {product.discount}%

                    </div>
                  )}

                </td>
               
                <td>
                  {product.isVarient ? (
                    <div className="text-sm text-gray-900">
                      {product.Varient.length > 0 && (
                        <>
                          ₹{product.Varient[0].price_after_discount || 0}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">
                      ₹{product.afterDiscountPrice || 0}

                    </div>
                  )}

                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.isVarient ? (
                    <div className="text-sm text-gray-900">
                      {product.Varient.reduce(
                        (total, variant) => total + variant.stock_quantity,
                        0
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  )}
                </td>
                <td>
                  {product?.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.isVarient ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.Varient.length} variants
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      No variants
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white mt-4 rounded-lg shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(endIndex, filteredProducts.length)}
              </span>{' '}
              of <span className="font-medium">{filteredProducts.length}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
