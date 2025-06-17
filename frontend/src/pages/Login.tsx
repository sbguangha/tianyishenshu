import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../utils/auth'

interface WeChatModalProps {
  isOpen: boolean
  onClose: () => void
}

const WeChatModal = ({ isOpen, onClose }: WeChatModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-black mb-4">添加客服微信</h3>
          <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <img 
              src={`/images/wechat-qrcode.jpg?t=${Date.now()}`}
              alt="客服微信二维码" 
              className="w-full h-full object-contain"
              onLoad={() => {
                console.log('微信二维码加载成功');
              }}
              onError={(e) => {
                console.error('微信二维码加载失败:', e);
                // 如果图片加载失败，显示占位内容
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement!;
                container.innerHTML = `
                  <div class="text-center text-gray-500">
                    <div class="text-4xl mb-2">📱</div>
                    <p class="text-sm">微信二维码</p>
                    <p class="text-xs mt-1">图片加载失败</p>
                    <p class="text-xs mt-1 text-red-500">请检查文件路径</p>
                  </div>
                `;
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            扫描二维码添加客服微信<br />
            获得专业命理咨询服务
          </p>
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

const Login: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 表单状态
  const [verifyCode, setVerifyCode] = useState('')
  const [exchangeCode, setExchangeCode] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
  // UI状态
  const [showWeChatModal, setShowWeChatModal] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 检查是否已经登录
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      console.log('🔍 用户已登录，跳转到dashboard')
      navigate('/dashboard')
    }
  }, [navigate])

  // 手机号格式验证
  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  // 兑换码格式验证 - 16位数字字母组合
  const validateExchangeCode = (code: string) => {
    const codeRegex = /^[A-Za-z0-9]{16}$/
    return codeRegex.test(code)
  }

  // 格式化兑换码输入 - 16位连续字符
  const formatExchangeCode = (value: string) => {
    const cleanValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    return cleanValue.substring(0, 16) // 最大长度16位
  }

  // 发送验证码
  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      return
    }

    setCountdown(60)
    
    try {
      // 预留API接口
      const response = await fetch('/api/auth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      if (!response.ok) {
        throw new Error('发送验证码失败')
      }
      
      // 成功提示
      console.log('验证码已发送')
    } catch (error) {
      console.error('发送验证码错误:', error)
      setCountdown(0)
    }
  }

  // 实时验证兑换码
  const handleExchangeCodeChange = async (value: string) => {
    const formatted = formatExchangeCode(value)
    setExchangeCode(formatted)
    
    if (formatted.length === 16 && validateExchangeCode(formatted)) {
      try {
        // 预留API接口 - 实时验证兑换码
        const response = await fetch('/api/auth/validate-exchange-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exchangeCode: formatted })
        })
        
        if (!response.ok) {
          console.error('兑换码无效')
        }
      } catch (error) {
        console.error('验证兑换码错误:', error)
      }
    }
  }

  // 粘贴兑换码
  const handlePasteExchangeCode = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const formatted = formatExchangeCode(text)
      handleExchangeCodeChange(formatted)
    } catch (error) {
      console.error('粘贴失败:', error)
    }
  }

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 表单验证
    const newErrors: any = {}
    
    if (!validatePhone(phone)) {
      newErrors.phone = '请输入正确的手机号'
    }
    
    if (!verifyCode || verifyCode.length !== 6) {
      newErrors.verifyCode = '请输入6位验证码'
    }
    
    if (!validateExchangeCode(exchangeCode)) {
      newErrors.exchangeCode = '请输入正确格式的兑换码'
    }
    
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code: verifyCode,
          exchangeCode,
          rememberMe
        })
      })

      if (!response.ok) {
        throw new Error('登录失败')
      }

      const data = await response.json()
      
      // 调试信息
      console.log('🔍 登录响应数据:', data)
      console.log('接收到的token:', data.token)
      
      // 使用AuthService保存登录状态
      AuthService.saveAuth(data.token, data.user, rememberMe)

      // 跳转到用户信息表单页
      navigate('/user-form')
      
    } catch (error) {
      console.error('登录错误:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full">
      <div className="max-w-md w-full lg:max-w-lg xl:max-w-xl space-y-8">
        {/* Logo和标题 */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-black">天乙神数</span>
          </Link>
          <h2 className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
            欢迎回来
          </h2>
          <p className="mt-2 text-gray-600 lg:text-lg">验证身份，开启命理探索之旅</p>
        </div>

        {/* 登录进度指示器 */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-sm font-medium text-black">身份验证</span>
            </div>
            <div className="flex-1 mx-4 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm text-gray-500">完善信息</span>
            </div>
            <div className="flex-1 mx-4 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm text-gray-500">进入应用</span>
            </div>
          </div>
        </div>
        
        {/* 登录表单 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 手机验证码登录 */}
            <div className="space-y-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">手机验证码登录</h3>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  手机号码
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                    +86
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                    placeholder="请输入手机号"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="flex-1">
                  <label htmlFor="verifyCode" className="block text-sm font-medium text-gray-700 mb-2">
                    验证码
                  </label>
                  <input
                    id="verifyCode"
                    name="verifyCode"
                    type="text"
                    required
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                    placeholder="6位验证码"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || !phone}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap lg:text-lg"
                  >
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </button>
                </div>
              </div>
            </div>

            {/* 兑换码输入 */}
            <div className="space-y-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">兑换码</h3>
              <div>
                <label htmlFor="exchangeCode" className="block text-sm font-medium text-gray-700 mb-2">
                  请输入兑换码
                </label>
                <div className="flex space-x-3">
                  <input
                    id="exchangeCode"
                    name="exchangeCode"
                    type="text"
                    required
                    value={exchangeCode}
                    onChange={(e) => handleExchangeCodeChange(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono tracking-wider lg:text-lg"
                    placeholder="2406AB8F9E2D4C7K"
                  />
                  <button
                    type="button"
                    onClick={handlePasteExchangeCode}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap lg:text-lg"
                  >
                    粘贴
                  </button>
                </div>
                {exchangeCode && validateExchangeCode(exchangeCode) && (
                  <p className="mt-1 text-sm text-green-600">✓ 兑换码格式正确</p>
                )}
              </div>
            </div>

            {/* 记住我 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm lg:text-base text-gray-700">
                  记住我（30天内免登录）
                </label>
              </div>
            </div>

            {/* 客服微信按钮 */}
            <button
              type="button"
              onClick={() => setShowWeChatModal(true)}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium lg:text-lg lg:py-4"
            >
              添加客服微信
            </button>

            {/* 提交按钮 */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg lg:text-xl lg:py-5 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    验证中...
                  </>
                ) : (
                  '步入玄境'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="text-gray-600 hover:text-black transition-colors lg:text-lg">
            ← 返回首页
          </Link>
        </div>
      </div>

      {/* 微信客服弹窗 */}
      <WeChatModal 
        isOpen={showWeChatModal} 
        onClose={() => setShowWeChatModal(false)} 
      />
    </div>
  )
}

export default Login 