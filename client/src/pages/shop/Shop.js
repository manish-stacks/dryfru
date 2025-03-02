import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Home, ChevronRight, ShoppingBag, ArrowUpDown, ArrowDownUp, Package2, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const productsPerPage = 16;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.dyfru.com/api/v1/get-product');
      const productData = response?.data?.products || [];
      setProducts(productData);
      setFilteredProducts(productData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.afterDiscountPrice >= priceRange[0] &&
      product.afterDiscountPrice <= priceRange[1]
    );

    // Apply stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product =>
        stockFilter === 'inStock' ? product.stock > 0 : product.stock === 0
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.afterDiscountPrice - b.afterDiscountPrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.afterDiscountPrice - a.afterDiscountPrice);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, priceRange, products, sortBy, stockFilter]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleVariantSelect = (productId, variantId) => {
    setSelectedVariant(prev => ({
      ...prev,
      [productId]: variantId
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>

      <helmet>
        <title>{`Shop Premium Dry Fruits & Nuts Online - DyFru`}</title>
        <meta
          name="description"
          content="Explore DyFru's wide range of premium dry fruits and nuts. Shop online for fresh almonds, cashews, pistachios, walnuts, and more at the best prices."
        />
        <meta
          name="keywords"
          content="Shop dry fruits, buy nuts online, premium dry fruits, healthy snacks, organic nuts, almonds, cashews, pistachios, walnuts, DyFru online store"
        />
      </helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span className="text-green-600 font-medium">Shop</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with Stats */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Package2 className="w-6 h-6 text-green-600" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Our Products</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Total: {products.length}</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">Showing: {filteredProducts.length}</span>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white p-3 rounded-lg shadow-sm flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters and Search Section */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-8`}>
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Sort and Filter Options */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sort By</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Items</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>

              {/* Price Range Filter
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Price Range</h3>
                <span className="text-sm text-gray-600">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
            </div> */}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {currentProducts.map((product) => (
              <Link
                to={`/productpage/${product?._id}?name=${encodeURIComponent(product.product_name.replace(/\s+/g, '-').toLowerCase())}`}
                key={product._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative pb-[100%] group">
                  <img
                    src={product.ProductMainImage.url}
                    alt={product.product_name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                    {product.discount}% OFF
                  </div>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-1">{product.product_name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                    {product.product_description}
                  </p>

                  {product.isVarient && (
                    <div className="mb-2 sm:mb-3">
                      <select
                        value={selectedVariant[product._id] || ''}
                        onChange={(e) => handleVariantSelect(product._id, e.target.value)}
                        className="w-full p-1.5 sm:p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Quantity</option>
                        {product.Varient.map((variant) => (
                          <option key={variant._id} value={variant._id}>
                            {variant.quantity} - ₹{variant.price_after_discount}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-lg sm:text-2xl font-bold text-green-600">₹{product.afterDiscountPrice}</span>
                      <span className="text-xs sm:text-sm text-gray-500 sm:ml-2 line-through">₹{product.price}</span>
                    </div>
                    <button
                      className={`p-1.5 sm:p-2 rounded-full transition-colors ${product.stock === 0
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      disabled={product.stock === 0}
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm ${currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-green-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;