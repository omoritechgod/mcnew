import React, { useState } from 'react';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardPath, getStoredUser, getUserInitials, isUserLoggedIn } from '../utils/dashboardUtils';
import logo from '../assets/img/MC-logo.png';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const user = getStoredUser();
  const isLoggedIn = isUserLoggedIn();
  const dashboardPath = user ? getDashboardPath(user) : '/dashboard';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('vendor');
    setProfileMenuOpen(false);
    navigate('/');
    window.location.reload(); // Refresh to update header state
  };

  return (
    <div className="w-full flex justify-center pt-[30px] fixed top-0 left-0 z-[999] px-4 md:px-0 bg-transparent">
      <header className="w-full max-w-[1200px] bg-[#BDC0C4] rounded-[47px] shadow-md flex items-center justify-between px-6 md:px-[60px] h-[70px]">
        
        {/* Logo */}
        <div className="flex items-center h-full">
          <img
            src={logo}
            alt="MC Dee Logo"
            className="h-[60px] w-[60px] object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-[30px] text-[#043873] font-medium">
          <a href="#" className="hover:text-[#F76300] transition no-underline">Home</a>
          <a href="#services" className="hover:text-[#F76300] transition no-underline">Services</a>
          <a href="#about" className="hover:text-[#F76300] transition no-underline">About Us</a>
          <a href="#faq" className="hover:text-[#F76300] transition no-underline">Contact Us</a>
          {isLoggedIn && (
            <button
              onClick={() => navigate(dashboardPath)}
              className="hover:text-[#F76300] transition no-underline"
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Desktop Auth Section */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center gap-4 relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="relative">
                {user?.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#043873] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials(user?.name || '')}
                  </div>
                )}
                {/* Verification Badge */}
                {user?.user_type === 'vendor' && user.vendor?.is_verified && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <span className="text-[#043873] font-medium">{user?.name}</span>
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    navigate(dashboardPath);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User size={16} />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate(`${dashboardPath}/profile`);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings size={16} />
                  Manage Profile
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex gap-[12px] h-[40px]">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#F76300] text-[#043873] px-[20px] py-2 rounded-[10px] font-semibold text-sm transition hover:opacity-90 no-underline flex items-center justify-center"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-[#3B82F6] text-white px-[20px] py-2 rounded-[10px] font-semibold text-sm transition hover:opacity-90 no-underline flex items-center justify-center"
            >
              Sign Up →
            </button>
          </div>
        )}

        {/* Hamburger Icon (Mobile Only) */}
        <div className="md:hidden flex items-center z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <X className="w-8 h-8 text-[#043873]" />
            ) : (
              <Menu className="w-8 h-8 text-[#043873]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden absolute top-[80px] w-full bg-[#BDC0C4] rounded-b-[30px] shadow-lg py-6 px-8 flex flex-col gap-4 text-[#043873] font-medium transition-all duration-300">
          <a href="#" className="hover:text-[#F76300] transition no-underline">Home</a>
          <a href="#services" className="hover:text-[#F76300] transition no-underline">Services</a>
          <a href="#about" className="hover:text-[#F76300] transition no-underline">About Us</a>
          <a href="#faq" className="hover:text-[#F76300] transition no-underline">Contact Us</a>
          {isLoggedIn && (
            <button
              onClick={() => {
                navigate(dashboardPath);
                setMenuOpen(false);
              }}
              className="text-left hover:text-[#F76300] transition no-underline"
            >
              Dashboard
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex flex-col gap-[10px] mt-4">
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                <div className="relative">
                  {user?.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#043873] rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials(user?.name || '')}
                    </div>
                  )}
                  {/* Verification Badge */}
                  {user?.user_type === 'vendor' && user.vendor?.is_verified && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-[#043873]">{user?.name}</div>
                  <div className="text-sm text-[#043873]/70">{user?.email}</div>
                  {user?.user_type === 'vendor' && user.vendor?.is_verified && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  navigate(`${dashboardPath}/profile`);
                  setMenuOpen(false);
                }}
                className="bg-[#F76300] text-[#043873] px-[20px] py-2 rounded-[10px] font-semibold text-sm no-underline text-center"
              >
                Manage Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-[20px] py-2 rounded-[10px] font-semibold text-sm no-underline text-center"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[10px] mt-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-[#F76300] text-[#043873] px-[20px] py-2 rounded-[10px] font-semibold text-sm no-underline text-center"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#3B82F6] text-white px-[20px] py-2 rounded-[10px] font-semibold text-sm no-underline text-center"
              >
                Sign Up →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close profile menu */}
      {profileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Header;