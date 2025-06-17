import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../utils/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      console.log('🚫 用户未登录，重定向到:', redirectTo)
      navigate(redirectTo)
    }
  }, [navigate, redirectTo])

  // 如果用户已认证，渲染子组件
  if (AuthService.isAuthenticated()) {
    return <>{children}</>
  }

  // 如果未认证，显示加载状态（在重定向之前）
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">正在验证登录状态...</p>
      </div>
    </div>
  )
}

export default ProtectedRoute 