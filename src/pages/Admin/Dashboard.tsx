import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, 
  UserCheck, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { adminApi, DashboardStats } from '../../services/adminApi';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
      // Set default stats for demo purposes
      setStats({
        total_vendors: 0,
        pending_kyc: 0,
        approved_vendors: 0,
        rejected_vendors: 0,
        total_users: 0,
        active_vendors: 0
      });
    } finally {
      setIsLoading(false);
    }
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600">Monitor and manage the McDee platform</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={20} />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.total_vendors || 0}
            </div>
            <div className="text-sm text-gray-600">Total Vendors</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <span className="text-sm font-medium text-yellow-600">Pending</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.pending_kyc || 0}
            </div>
            <div className="text-sm text-gray-600">Pending KYC</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">Approved</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.approved_vendors || 0}
            </div>
            <div className="text-sm text-gray-600">Approved Vendors</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <XCircle className="text-red-600" size={24} />
              </div>
              <span className="text-sm font-medium text-red-600">Rejected</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.rejected_vendors || 0}
            </div>
            <div className="text-sm text-gray-600">Rejected Vendors</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold text-gray-900">{stats?.total_users || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Vendors</span>
                <span className="font-semibold text-gray-900">{stats?.active_vendors || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verification Rate</span>
                <span className="font-semibold text-green-600">
                  {stats?.total_vendors ? Math.round((stats.approved_vendors / stats.total_vendors) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <Shield className="text-blue-600" size={20} />
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/admin/kyc/review'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck size={16} />
                Review KYC Applications
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/vendors'}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Users size={16} />
                Manage Vendors
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Recent activity will be displayed here</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;