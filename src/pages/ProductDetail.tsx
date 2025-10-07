// src/pages/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShoppingCart,
  Package,
  MapPin,
  Truck,
  Store,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Minus,
} from 'lucide-react';
import { productApi, Product } from '../services/productApi';
import { cartApi } from '../services/cartApi';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productApi.getMarketplaceProductById(Number(id));
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Product not found');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    try {
      await cartApi.addToCart({
        product_id: product.id,
        quantity: quantity,
      });
      alert('Added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
  };

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {/* ADJUSTMENT: Added pt-32 to push content below fixed header */}
        <div className="flex items-center justify-center h-96 pt-32">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {/* ADJUSTMENT: Added pt-32 to push content below fixed header */}
        <div className="max-w-7xl mx-auto px-4 py-12 text-center pt-32">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Marketplace
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ADJUSTMENT: Added pt-32 to push content below fixed header (header height ~130px with spacing) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Back Button */}
        <button
          onClick={() => navigate('/ecommerce')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <div className="aspect-square relative">
                <img
                  src={product.images[selectedImage] || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {product.stock_quantity === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {/* Title & Category */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                  {product.category?.name}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {product.vendor?.business_name}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    product.condition === 'new' ? 'bg-blue-100 text-blue-800' :
                    product.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {product.condition}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ₦{price.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package size={16} />
                  <span>{product.stock_quantity} items available</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Delivery Options */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Options</h3>
                <div className="space-y-2">
                  {product.allow_pickup && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Store size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Pickup Available</div>
                        <div className="text-sm text-gray-600">Collect from vendor location</div>
                      </div>
                    </div>
                  )}
                  {product.allow_shipping && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Truck size={20} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Shipping Available</div>
                        <div className="text-sm text-gray-600">Delivery to your address</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), product.stock_quantity));
                    }}
                    className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                  <span className="text-sm text-gray-600 ml-2">
                    (Max: {product.stock_quantity})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0 || addingToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Buy Now
                    </>
                  )}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0 || addingToCart}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>

              {/* Vendor Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sold By</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Store className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.vendor?.business_name}</div>
                    <div className="text-sm text-gray-600">Verified Vendor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Condition:</dt>
                  <dd className="font-medium text-gray-900 capitalize">{product.condition}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Category:</dt>
                  <dd className="font-medium text-gray-900">{product.category?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Stock:</dt>
                  <dd className="font-medium text-gray-900">{product.stock_quantity} units</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Listed:</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(product.created_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery & Returns</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Secure escrow payment protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Verified vendor guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Multiple delivery options available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Customer support available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;