import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
  Upload,
  Save
} from 'lucide-react';
import { foodApi, FoodMenuItem, CreateMenuItemData, UpdateMenuItemData } from '../../../services/foodApi';
import { uploadToCloudinary } from '../../../utils/cloudinaryUploader';

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<FoodMenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodMenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [formData, setFormData] = useState<CreateMenuItemData>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    preparation_time_minutes: 30,
    category: '',
    is_available: true,
    image: '',
    image_urls: [],
    tags: [],
    stock: undefined
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [searchQuery, categoryFilter, menuItems]);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await foodApi.getVendorMenuItems();

      if (response.data) {
        setMenuItems(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = menuItems;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field: keyof CreateMenuItemData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'name') {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleTagsInputChange = (value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, tags: array }));
  };

  const handleImageUpload = async (files: FileList) => {
    setIsUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      
      const validUrls = urls.filter(url => url !== null) as string[];
      
      if (validUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          image: prev.image || validUrls[0],
          image_urls: [...(prev.image_urls || []), ...validUrls]
        }));
        setSuccessMessage(`${validUrls.length} image(s) uploaded successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to upload images');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await foodApi.createMenuItem(formData);

      if (response.data) {
        setMenuItems(prev => [response.data!, ...prev]);
        setSuccessMessage('Menu item added successfully');
        setShowAddModal(false);
        resetForm();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add menu item');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);
    setError('');

    try {
      const updateData: UpdateMenuItemData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        preparation_time_minutes: formData.preparation_time_minutes,
        category: formData.category,
        is_available: formData.is_available,
        image: formData.image,
        image_urls: formData.image_urls,
        tags: formData.tags,
        stock: formData.stock
      };

      const response = await foodApi.updateMenuItem(selectedItem.id, updateData);

      if (response.data) {
        setMenuItems(prev =>
          prev.map(item => item.id === selectedItem.id ? response.data! : item)
        );
        setSuccessMessage('Menu item updated successfully');
        setShowEditModal(false);
        setSelectedItem(null);
        resetForm();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update menu item');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await foodApi.deleteMenuItem(itemId);
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      setSuccessMessage('Menu item deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete menu item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleAvailability = async (item: FoodMenuItem) => {
    try {
      await foodApi.toggleMenuItemAvailability(item.id, !item.is_available);
      setMenuItems(prev =>
        prev.map(menuItem =>
          menuItem.id === item.id
            ? { ...menuItem, is_available: !item.is_available }
            : menuItem
        )
      );
      setSuccessMessage(`Menu item ${!item.is_available ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update menu item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openEditModal = (item: FoodMenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: item.price,
      preparation_time_minutes: item.preparation_time_minutes,
      category: item.category,
      is_available: item.is_available,
      image: item.image || '',
      image_urls: item.image_urls || [],
      tags: item.tags || [],
      stock: item.stock
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      preparation_time_minutes: 30,
      category: '',
      is_available: true,
      image: '',
      image_urls: [],
      tags: [],
      stock: undefined
    });
  };

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const MenuItemForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Menu Item Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Jollof Rice with Chicken"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Main Course, Appetizer"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Describe your menu item..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2500"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (mins) *</label>
          <input
            type="number"
            value={formData.preparation_time_minutes}
            onChange={(e) => handleInputChange('preparation_time_minutes', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="30"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock (Optional)</label>
          <input
            type="number"
            value={formData.stock || ''}
            onChange={(e) => handleInputChange('stock', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Unlimited"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Images
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <label className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-700 font-medium">
              {isUploadingImages ? 'Uploading...' : 'Click to upload images'}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              disabled={isUploadingImages}
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
        </div>

        {formData.image_urls && formData.image_urls.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {formData.image_urls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={formData.tags?.join(', ')}
          onChange={(e) => handleTagsInputChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="spicy, popular, vegetarian"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_available"
          checked={formData.is_available}
          onChange={(e) => handleInputChange('is_available', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
          Available for orders
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            resetForm();
          }}
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImages}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin" size={20} />
              {isEdit ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>
              <Save size={20} />
              {isEdit ? 'Update Item' : 'Add Item'}
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600">Manage your food menu items</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Add Menu Item
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-green-800">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-800">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Loading menu items...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <UtensilsCrossed className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-600 mb-6">
              {menuItems.length === 0
                ? 'Start by adding your first menu item'
                : 'No items match your search criteria'}
            </p>
            {menuItems.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
              >
                Add Your First Menu Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={item.image || item.image_urls?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.is_available)}`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xl font-bold text-green-600">₦{item.price.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock size={14} />
                        <span>{item.preparation_time_minutes} mins</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.category}
                    </div>
                  </div>

                  {item.stock !== undefined && (
                    <div className="text-sm text-gray-600 mb-3">
                      Stock: {item.stock > 0 ? item.stock : 'Out of stock'}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                        item.is_available
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {item.is_available ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Add Menu Item</h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                <MenuItemForm onSubmit={handleAddMenuItem} />
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Menu Item</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                <MenuItemForm onSubmit={handleEditMenuItem} isEdit={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MenuManagement;