import React from "react"
import { Navigate } from "react-router-dom"

interface Props {
  children: JSX.Element
}

const PrivateRouteVendor = ({ children }: Props) => {
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const vendor = JSON.parse(localStorage.getItem("vendor") || "null")

  // Ensure user is logged in and is a vendor
  if (!user || user.user_type !== "vendor" || !vendor) {
    return <Navigate to="/login" replace />
  }

  // Vendor must be "live" to access dashboard
  if (!vendor.is_live) {
    return <Navigate to="/compliance" replace />
  }

  return children
}

export default PrivateRouteVendor
