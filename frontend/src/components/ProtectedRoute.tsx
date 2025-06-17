import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
// import { AuthService } from '../utils/auth'

const isAuthenticated = () => {
  // 这里可以换成更复杂的逻辑，比如检查token是否过期
  return localStorage.getItem('token') !== null
}

const ProtectedRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute 