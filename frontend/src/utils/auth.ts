// 认证工具类
export class AuthService {
  private static readonly TOKEN_KEY = 'authToken'
  private static readonly USER_KEY = 'userInfo'
  
  // 保存登录状态
  static saveAuth(token: string, user: any, rememberMe: boolean = true) {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(this.TOKEN_KEY, token)
    storage.setItem(this.USER_KEY, JSON.stringify(user))
    
    console.log('✅ 登录状态已保存:', { 
      storage: rememberMe ? 'localStorage' : 'sessionStorage',
      token: token.substring(0, 50) + '...',
      user: user.phone 
    })
  }
  
  // 获取JWT令牌
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY)
  }
  
  // 获取用户信息
  static getUser(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }
  
  // 检查是否已登录
  static isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    
    try {
      // 简单检查JWT格式
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // 解码payload检查过期时间
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < now) {
        console.log('⚠️ JWT令牌已过期')
        this.clearAuth()
        return false
      }
      
      return true
    } catch (error) {
      console.error('JWT令牌格式错误:', error)
      this.clearAuth()
      return false
    }
  }
  
  // 清除登录状态
  static clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    sessionStorage.removeItem(this.TOKEN_KEY)
    sessionStorage.removeItem(this.USER_KEY)
    console.log('🔄 登录状态已清除')
  }
  
  // 获取认证头
  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  
  // 创建认证请求
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const authHeaders = this.getAuthHeader()
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    })
    
    // 如果返回401，清除登录状态
    if (response.status === 401) {
      console.log('🚫 认证失败，清除登录状态')
      this.clearAuth()
      // 可以在这里触发重定向到登录页
      window.location.href = '/login'
    }
    
    return response
  }
} 