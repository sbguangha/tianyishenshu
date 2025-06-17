import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthService } from '../utils/auth'

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (AuthService.isAuthenticated()) {
    return <>{children}</>;
  }
  
  // 如果未认证，则重定向到登录页
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute 