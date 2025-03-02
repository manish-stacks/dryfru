import React, { useEffect, useState } from 'react';
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useParams } from "react-router-dom";
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../store/slice/cart.slice';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

function ProductPage() {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState('');

  const handleFetchProduct = async () => {
    try {
      const { data } = await axios.get(`https://api.dyfru.com/api/v1/get-product/${_id}`)
      setProduct(data.data);
      setMainImage(data.data?.ProductMainImage?.url);
    } catch (error) {
      console.log("Internal server error", error)
    }
  }

  useEffect(() => {
    handleFetchProduct()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [_id])

  const handleQuantityChange = (increment) => {
    const newQuantity = quantity + increment;
    if (newQuantity >= 1 && newQuantity <= (product.isVarient ? product.Varient[selectedVariant].stock_quantity : product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = (product) => {
    console.log(product)
    const selected = {
      product_id: product._id,
      product_name: product.product_name,
      price: product.isVarient ? product.Varient[selectedVariant].price : product.price,
      discount_percentage: product.isVarient ? product.Varient[selectedVariant].discount_percentage : 0,
      price_after_discount: product.isVarient ? product.Varient[selectedVariant].price_after_discount : product?.afterDiscountPrice,
      isVarient: product.isVarient,
      Qunatity: quantity,
      variantId: product.isVarient ? product.Varient[0]._id : null,
      variant: product.isVarient ? product.Varient[selectedVariant].quantity : null,
      image: product?.ProductMainImage?.url,
    }
    dispatch(addProduct(selected));
    toast.success('Hooray! Your product has been added to the cart successfully.')
  };

  // Get all available product images
  const productImages = [
    product?.ProductMainImage?.url,
    product?.SecondImage?.url,
    product?.ThirdImage?.url,
    product?.FourthImage?.url,
    product?.FifthImage?.url
  ].filter(Boolean); // Remove null/undefined values

  return (
    <>
      <Helmet>
        <title>{`${product.product_name} - Dyfru`}</title>
        <meta name="description" content={product.product_description} />

      </Helmet>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-3 md:p-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={mainImage}
                    alt={product.product_name}
                    className="h-96 w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image)}
                      className={`relative rounded-lg overflow-hidden h-20 transition-all duration-200 ${mainImage === image
                        ? 'ring-2 ring-green-500 ring-offset-2'
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`Product view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {mainImage === image && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-10" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
                  <p className="mt-4 text-gray-600">{product.product_description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{product.isVarient
                        ? product.Varient[selectedVariant].price_after_discount
                        : product.afterDiscountPrice}
                    </span>
                    {(product.isVarient ? product.Varient[selectedVariant].discount_percentage : product.discount) > 0 && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ₹{product.isVarient ? product.Varient[selectedVariant].price : product.price}
                        </span>
                        <span className="text-sm font-semibold text-green-500">
                          {product.isVarient ? product.Varient[selectedVariant].discount_percentage : product.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Variants */}
                {product.isVarient && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Size Options</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.Varient.map((variant, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedVariant(index)}
                          className={`px-4 py-2 rounded-lg border transition-all duration-200 ${selectedVariant === index
                            ? 'border-green-600 bg-green-50 text-green-600 shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {variant.quantity}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                  <div className="inline-flex items-center border border-gray-200 rounded-full p-1">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 text-white py-3 px-8 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t border-gray-200 p-6 space-y-4">
              {product.extra_description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h3>
                  <p className="text-gray-600">{product.extra_description}</p>
                </div>
              )}
            </div>
          </div>
          <ProductCard bg={false} title={'Related Products'} />
        </div>
      </div>
    </>
  );
}

export default ProductPage;
