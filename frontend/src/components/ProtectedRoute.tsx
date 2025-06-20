import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/auth'

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>加载中...</div>; // 或者一个加载动画
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const hasRequiredRole = user?.roles?.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      // 用户已登录但没有权限，可以导航到未授权页面或首页
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute 