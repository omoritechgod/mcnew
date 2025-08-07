import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { vendorApi } from '../../../services/vendorApi';

const ListedPropertiesPage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await vendorApi.getMyListings(); // ✅ correct method
        setListings(res.data || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Listed Properties</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-500">You haven't listed any properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white shadow rounded-lg overflow-hidden">
                {listing.images && listing.images.length > 0 && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {listing.title || 'Untitled Apartment'}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{listing.description || 'No description provided.'}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Location: <span className="font-medium text-gray-700">{listing.location || 'Unknown'}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ₦
                    {new Intl.NumberFormat('en-NG', {
                      style: 'decimal',
                      minimumFractionDigits: 0,
                    }).format(listing.price_per_night)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {listing.is_verified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ListedPropertiesPage;
