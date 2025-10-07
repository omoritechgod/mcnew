import React from "react"
import { Navigate } from "react-router-dom"

interface Props {
  children: JSX.Element
}

const PrivateRouteUser = ({ children }: Props) => {
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const token = localStorage.getItem("token")

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRouteUser
