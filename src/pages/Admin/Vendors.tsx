import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Search, 
  Filter, 
  Eye, 
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { adminApi, LiveVendor } from '../../services/adminApi';

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<LiveVendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<LiveVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<LiveVendor | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    'all', 'mechanic', 'rider', 'product', 'service-apartment', 'service', 'food'
  ];

  const statuses = [
    'all', 'verified', 'pending', 'rejected'
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchQuery, categoryFilter, statusFilter]);

  const fetchVendors = async () => {
    try {
      const response = await adminApi.getLiveVendors();
      setVendors(response.data);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      setError('Failed to load vendors');
      // Set empty array for demo
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = vendors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'verified') {
        filtered = filtered.filter(vendor => vendor.is_verified);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(vendor => !vendor.is_verified && vendor.verification_status === 'pending');
      } else if (statusFilter === 'rejected') {
        filtered = filtered.filter(vendor => vendor.verification_status === 'rejected');
      }
    }

    setFilteredVendors(filtered);
  };

  const getStatusColor = (vendor: LiveVendor) => {
    if (vendor.is_verified) {
      return 'bg-green-100 text-green-800';
    } else if (vendor.verification_status === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (vendor.verification_status === 'rejected') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (vendor: LiveVendor) => {
    if (vendor.is_verified) {
      return <CheckCircle size={16} />;
    } else if (vendor.verification_status === 'pending') {
      return <Clock size={16} />;
    } else if (vendor.verification_status === 'rejected') {
      return <AlertTriangle size={16} />;
    }
    return <Clock size={16} />;
  };

  const getStatusText = (vendor: LiveVendor) => {
    if (vendor.is_verified) {
      return 'Live';
    } else if (vendor.verification_status === 'pending') {
      return 'Pending';
    } else if (vendor.verification_status === 'rejected') {
      return 'Rejected';
    }
    return 'Unknown';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Management</h2>
          <p className="text-gray-600">Manage and monitor all platform vendors</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={20} />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-500">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No vendors have been registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Vendor</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Business</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold relative">
                            {vendor.user.name.charAt(0).toUpperCase()}
                            {vendor.is_verified && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{vendor.user.name}</div>
                            <div className="text-sm text-gray-500">{vendor.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{vendor.business_name}</div>
                        <div className="text-sm text-gray-500">{vendor.vendor_type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {vendor.category === 'mechanic' && <User size={14} />}
                          {vendor.category === 'service-apartment' && <Building size={14} />}
                          {vendor.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{vendor.user.phone}</div>
                        <div className="text-sm text-gray-500">
                          {vendor.user.email_verified_at ? 'Email verified' : 'Email not verified'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(vendor)}`}>
                          {getStatusIcon(vendor)}
                          {getStatusText(vendor)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(vendor.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Vendor Detail Modal */}
        {showModal && selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
            
            <div className="relative bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Vendor Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Vendor Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedVendor.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedVendor.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedVendor.user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium">{new Date(selectedVendor.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-gray-400" />
                      <span className="text-gray-600">Business Name:</span>
                      <span className="font-medium">{selectedVendor.business_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-gray-400" />
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedVendor.vendor_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedVendor.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedVendor)}
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        selectedVendor.is_verified ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {getStatusText(selectedVendor)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Verification Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {selectedVendor.user.email_verified_at ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Clock size={16} className="text-yellow-600" />
                      )}
                      <span className="text-gray-600">Email Verification:</span>
                      <span className={`font-medium ${
                        selectedVendor.user.email_verified_at ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedVendor.user.email_verified_at ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedVendor.is_verified ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Clock size={16} className="text-yellow-600" />
                      )}
                      <span className="text-gray-600">Document Verification:</span>
                      <span className={`font-medium ${
                        selectedVendor.is_verified ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedVendor.verification_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VendorManagement;