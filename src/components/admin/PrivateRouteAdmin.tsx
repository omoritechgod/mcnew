import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteAdminProps {
  children: React.ReactNode;
}

const PrivateRouteAdmin: React.FC<PrivateRouteAdminProps> = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRouteAdmin;
