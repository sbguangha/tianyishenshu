import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../utils/auth'
import { useAuth } from '../utils/auth'

interface WeChatModalProps {
  isOpen: boolean
  onClose: () => void
}

const WeChatModal: React.FC<WeChatModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h3 className="text-lg font-medium mb-4">客服微信</h3>
        <img 
          src="/images/wechat-qrcode.jpg"
          alt="微信二维码" 
          className="w-48 h-48 mx-auto mb-4" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.alt = '微信二维码图片加载失败';
          }}
        />
        <p className="text-sm text-gray-600">扫码添加客服，解决您的问题</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          关闭
        </button>
      </div>
    </div>
  )
}

type LoginMode = 'password' | 'sms'

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const Login: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>('sms')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [showWeChatModal, setShowWeChatModal] = useState(false)

  const navigate = useNavigate()
  const auth = useAuth()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isSendingCode && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setIsSendingCode(false)
      setCountdown(60)
    }
    return () => clearTimeout(timer)
  }, [isSendingCode, countdown])

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      console.log('🔍 用户已登录，跳转到dashboard')
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSendCode = async () => {
    if (!/^\d{11}$/.test(phone)) {
      setError('请输入有效的11位手机号码')
      return
    }
    setError('')
    setIsSendingCode(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-sms-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || '发送失败')
      }
      // 可以在这里加一个成功提示，比如 toast
    } catch (err: any) {
      setError(err.message)
      setIsSendingCode(false)
      setCountdown(60)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isSmsLogin = mode === 'sms';
    // 决定API的URL和请求体
    const url = isSmsLogin 
      ? `${API_BASE_URL}/api/auth/login-with-sms` 
      : `${API_BASE_URL}/api/auth/login`;
      
    const body = isSmsLogin 
      ? { phone, code } 
      : { phone, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }
      
      auth.login(data.token, data.user);
      navigate('/user-form');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSmsForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          手机号码
        </label>
        <div className="mt-1">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          短信验证码
        </label>
        <div className="mt-1 flex space-x-2">
          <input
            id="code"
            name="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={isSendingCode}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSendingCode ? `${countdown}s` : '发送验证码'}
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </div>
    </form>
  )

  const renderPasswordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
       <div>
        <label htmlFor="phone-pw" className="block text-sm font-medium text-gray-700">
          手机号码
        </label>
        <div className="mt-1">
          <input
            id="phone-pw"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          密码
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录您的账户
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setMode('sms')}
                className={`${
                  mode === 'sms'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                短信登录
              </button>
              <button
                onClick={() => setMode('password')}
                className={`${
                  mode === 'password'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                密码登录
              </button>
            </nav>
          </div>
          
          {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}
          
          {mode === 'sms' ? renderSmsForm() : renderPasswordForm()}

        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="text-gray-600 hover:text-black transition-colors lg:text-lg">
          ← 返回首页
        </Link>
      </div>

      <WeChatModal 
        isOpen={showWeChatModal} 
        onClose={() => setShowWeChatModal(false)} 
      />
    </div>
  )
}

export default Login 