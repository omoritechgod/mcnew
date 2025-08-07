import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

const PrivateRouteVendor = ({ children }: Props) => {
  const vendor = JSON.parse(localStorage.getItem('vendor') || 'null');

  // Ensure vendor is logged in and category is "service-apartment"
  if (!vendor || vendor.category !== 'service_apartment') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRouteVendor;
