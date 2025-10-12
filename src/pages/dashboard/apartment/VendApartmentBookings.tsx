import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  User,
  Phone,
  Mail,
  MessageSquare,
  X,
} from 'lucide-react';
import { vendorBookingApi, Booking } from '../../../services/bookingApi';

const VendApartmentBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await vendorBookingApi.getVendorBookings();
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock size={16} />,
        label: 'Pending Review',
      },
      processing: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <AlertCircle size={16} />,
        label: 'Processing',
      },
      paid: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CreditCard size={16} />,
        label: 'Paid',
      },
      checked_in: {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <CheckCircle size={16} />,
        label: 'Checked In',
      },
      checked_out: {
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <CheckCircle size={16} />,
        label: 'Checked Out',
      },
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle size={16} />,
        label: 'Completed',
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle size={16} />,
        label: 'Cancelled',
      },
      refunded: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <RefreshCw size={16} />,
        label: 'Refunded',
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const filteredBookings =
    selectedStatus === 'all' ? bookings : bookings.filter((booking) => booking.status === selectedStatus);

  const statusCounts = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const stats = {
    totalBookings: bookings.length,
    checkedIn: bookings.filter((b) => b.status === 'checked_in').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    pending: bookings.filter((b) => b.status === 'pending' || b.status === 'processing').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apartment Bookings</h1>
          <p className="text-gray-600">View and manage bookings for your listed apartments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{stats.checkedIn}</div>
            <div className="text-sm text-gray-600">Currently Checked In</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed Stays</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Payment</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({bookings.length})
            </button>
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getStatusConfig(status).label} ({count})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Booking</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Guest</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Property</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Dates</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">#{booking.id}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{booking.user?.name}</div>
                          <div className="text-sm text-gray-600">{booking.user?.email}</div>
                          {booking.user?.phone && <div className="text-sm text-gray-600">{booking.user.phone}</div>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.listing?.images[0] || '/placeholder.svg'}
                            alt={booking.listing?.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{booking.listing?.title}</div>
                            <div className="text-sm text-gray-600">{booking.listing?.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(booking.check_in_date).toLocaleDateString()} -{' '}
                            {new Date(booking.check_out_date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-600">
                            {booking.nights} night{booking.nights > 1 ? 's' : ''} • {booking.guests} guest
                            {booking.guests > 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">
                          ₦{Number.parseFloat(booking.total_price).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all'
                  ? 'You have no bookings yet. Keep your listings updated to attract more guests!'
                  : `No ${getStatusConfig(selectedStatus).label.toLowerCase()} bookings found.`}
              </p>
            </div>
          )}
        </div>

        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Booking ID</div>
                    <div className="text-lg font-semibold text-gray-900">#{selectedBooking.id}</div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                      getStatusConfig(selectedBooking.status).color
                    }`}
                  >
                    {getStatusConfig(selectedBooking.status).icon}
                    {getStatusConfig(selectedBooking.status).label}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User size={18} />
                    Guest Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <div className="text-sm text-gray-600">Name</div>
                      <div className="font-medium text-gray-900">{selectedBooking.user?.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail size={14} />
                        Email
                      </div>
                      <div className="font-medium text-gray-900">{selectedBooking.user?.email}</div>
                    </div>
                    {selectedBooking.user?.phone && (
                      <div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone size={14} />
                          Phone
                        </div>
                        <div className="font-medium text-gray-900">{selectedBooking.user.phone}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={18} />
                    Property Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex gap-4">
                      <img
                        src={selectedBooking.listing?.images[0] || '/placeholder.svg'}
                        alt={selectedBooking.listing?.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{selectedBooking.listing?.title}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin size={14} />
                          {selectedBooking.listing?.location}
                        </div>
                        <div className="text-sm text-gray-600">Type: {selectedBooking.listing?.type}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar size={18} />
                    Booking Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <div className="text-sm text-gray-600">Check-in</div>
                      <div className="font-medium text-gray-900">
                        {new Date(selectedBooking.check_in_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Check-out</div>
                      <div className="font-medium text-gray-900">
                        {new Date(selectedBooking.check_out_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-medium text-gray-900">
                        {selectedBooking.nights} night{selectedBooking.nights > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Guests</div>
                      <div className="font-medium text-gray-900">{selectedBooking.guests}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="font-semibold text-green-600 text-lg">
                        ₦{Number.parseFloat(selectedBooking.total_price).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare size={18} />
                      Special Requests
                    </h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-900">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Booking Created</div>
                      <div className="font-medium text-gray-900">
                        {new Date(selectedBooking.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Last Updated</div>
                      <div className="font-medium text-gray-900">
                        {new Date(selectedBooking.updated_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VendApartmentBookings;
