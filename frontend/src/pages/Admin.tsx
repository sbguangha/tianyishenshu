import React, { useState, useEffect } from 'react'

interface ExchangeCode {
  id: string
  code: string
  status: 'pending' | 'used' | 'expired'
  createdAt: string
  usedAt?: string
  usedBy?: string
  createdBy: string
}

interface Stats {
  total: number
  pending: number
  used: number
  expired: number
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [adminToken, setAdminToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // 兑换码相关状态
  const [codes, setCodes] = useState<ExchangeCode[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, used: 0, expired: 0 })
  const [filter, setFilter] = useState<'all' | 'pending' | 'used' | 'expired'>('all')
  const [generating, setGenerating] = useState(false)

  // 管理员验证
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        setAdminToken(data.token)
        setIsAuthenticated(true)
        setSuccess('管理员验证成功')
        loadCodes(data.token)
      } else {
        setError(data.error || '验证失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 加载兑换码列表
  const loadCodes = async (token?: string) => {
    try {
      const authToken = token || adminToken
      const response = await fetch(`/api/admin/codes?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setCodes(data.codes)
        setStats(data.stats)
      } else {
        setError(data.error || '加载失败')
      }
    } catch (err) {
      setError('加载兑换码列表失败')
    }
  }

  // 生成新兑换码
  const generateCode = async () => {
    setGenerating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/generate-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`新兑换码生成成功: ${data.code.code}`)
        loadCodes() // 重新加载列表
      } else {
        setError(data.error || '生成失败')
      }
    } catch (err) {
      setError('生成兑换码失败')
    } finally {
      setGenerating(false)
    }
  }

  // 复制兑换码到剪贴板
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setSuccess(`兑换码 ${code} 已复制到剪贴板`)
      setTimeout(() => setSuccess(''), 3000)
    })
  }

  // 删除兑换码
  const deleteCode = async (id: string) => {
    if (!confirm('确定要删除这个兑换码吗？')) return

    try {
      const response = await fetch(`/api/admin/codes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('兑换码删除成功')
        loadCodes()
      } else {
        setError(data.error || '删除失败')
      }
    } catch (err) {
      setError('删除兑换码失败')
    }
  }

  // 格式化时间
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('zh-CN')
  }

  // 状态标签样式
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      used: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    }
    const labels = {
      pending: '待使用',
      used: '已使用',
      expired: '已过期'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCodes()
    }
  }, [filter])

  // 登录表单
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              🔐 管理员登录
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              请输入管理员密码以访问兑换码管理系统
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="password" className="sr-only">
                管理员密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="请输入管理员密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '验证中...' : '登录管理系统'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // 管理界面
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">兑换码管理系统</h1>
              <p className="mt-1 text-sm text-gray-600">生成和管理客户兑换码</p>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false)
                setAdminToken('')
                setPassword('')
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">总</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">总数量</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">待</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">待使用</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">用</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">已使用</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.used}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">期</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">已过期</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.expired}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作区域 */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={generateCode}
                  disabled={generating}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? '生成中...' : '🎫 生成新兑换码'}
                </button>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待使用</option>
                  <option value="used">已使用</option>
                  <option value="expired">已过期</option>
                </select>
              </div>
              
              <button
                onClick={() => loadCodes()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                🔄 刷新
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
          </div>
        </div>

        {/* 兑换码列表 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              兑换码列表 ({codes.length} 条记录)
            </h3>
            
            {codes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无兑换码记录
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        兑换码
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        使用信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {codes.map((code) => (
                      <tr key={code.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-mono font-medium text-gray-900">
                              {code.code}
                            </span>
                            <button
                              onClick={() => copyToClipboard(code.code)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="复制兑换码"
                            >
                              📋
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(code.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTime(code.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {code.status === 'used' ? (
                            <div>
                              <div>用户: {code.usedBy}</div>
                              <div>时间: {code.usedAt ? formatTime(code.usedAt) : '-'}</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {code.status === 'pending' && (
                            <button
                              onClick={() => deleteCode(code.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              删除
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin 