import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../utils/auth'
import MarkdownRenderer from '../components/MarkdownRenderer'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  messages?: Message[]
  isPinned: boolean
  timestamp: Date
}

const PersonalityReport = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [report, setReport] = useState<string>('')
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false)
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到消息底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 滚动到页面顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 加载用户信息
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo))
    }
  }, [])

  // 生成性格报告
  useEffect(() => {
    if (userInfo) {
      generatePersonalityReport()
    }
  }, [userInfo])

  // 加载聊天历史
  useEffect(() => {
    loadChatHistories()
  }, [])

  // 滚动到底部当有新消息时
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (_event: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const generatePersonalityReport = async () => {
    setIsLoadingReport(true)
    try {
      const response = await AuthService.authenticatedFetch('/api/coze/personality-report', {
        method: 'POST',
        body: JSON.stringify({ userInfo })
      })

      if (response.ok) {
        const data = await response.json()
        setReport(data.report)
      } else {
        const errorData = await response.json()
        setReport(errorData.error || '生成报告时出现错误，请稍后重试。')
      }
    } catch (error) {
      console.error('生成性格报告失败:', error)
      setReport('生成报告时出现错误，请稍后重试。')
    } finally {
      setIsLoadingReport(false)
    }
  }

  const loadChatHistories = async () => {
    try {
      const response = await AuthService.authenticatedFetch('/api/coze/chat-history')
      if (response.ok) {
        const data = await response.json()
        setChatHistories(data.histories.map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        })))
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error)
    }
  }

  const createNewChat = async () => {
    try {
      const response = await AuthService.authenticatedFetch('/api/coze/chat-history', {
        method: 'POST',
        body: JSON.stringify({ title: '新对话' })
      })

      if (response.ok) {
        const data = await response.json()
        const newChat = {
          ...data.chat,
          timestamp: new Date(data.chat.timestamp)
        }
        setChatHistories(prev => [newChat, ...prev])
        setCurrentChatId(newChat.id)
        setMessages([])
      }
    } catch (error) {
      console.error('创建新对话失败:', error)
    }
  }

  const loadChatMessages = async (chatId: string) => {
    try {
      const response = await AuthService.authenticatedFetch(`/api/coze/chat-history/${chatId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.chat.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
        setCurrentChatId(chatId)
      }
    } catch (error) {
      console.error('加载对话消息失败:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoadingChat) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoadingChat(true)

    try {
      const response = await AuthService.authenticatedFetch('/api/coze/personality-chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.content,
          context: { userInfo, report, previousMessages: messages.slice(-5) },
          chatId: currentChatId
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('API调用失败')
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '抱歉，我现在无法回复您的消息，请稍后重试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const togglePin = async (chatId: string, isPinned: boolean) => {
    try {
      const response = await AuthService.authenticatedFetch(`/api/coze/chat-history/${chatId}/pin`, {
        method: 'PUT',
        body: JSON.stringify({ isPinned: !isPinned })
      })

      if (response.ok) {
        setChatHistories(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, isPinned: !isPinned } : chat
        ).sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1
          return b.timestamp.getTime() - a.timestamp.getTime()
        }))
      }
    } catch (error) {
      console.error('置顶操作失败:', error)
    }
    setShowDropdown(null)
  }

  const startRename = (chatId: string, currentTitle: string) => {
    setIsRenaming(chatId)
    setRenameValue(currentTitle)
    setShowDropdown(null)
  }

  const confirmRename = async (chatId: string) => {
    if (!renameValue.trim()) return

    try {
      const response = await AuthService.authenticatedFetch(`/api/coze/chat-history/${chatId}/rename`, {
        method: 'PUT',
        body: JSON.stringify({ title: renameValue.trim() })
      })

      if (response.ok) {
        setChatHistories(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, title: renameValue.trim() } : chat
        ))
      }
    } catch (error) {
      console.error('重命名失败:', error)
    }
    setIsRenaming(null)
    setRenameValue('')
  }

  const deleteChat = async (chatId: string) => {
    if (!confirm('确定要删除这个对话吗？此操作不可撤销。')) return

    try {
      const response = await AuthService.authenticatedFetch(`/api/coze/chat-history/${chatId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setChatHistories(prev => prev.filter(chat => chat.id !== chatId))
        if (currentChatId === chatId) {
          setCurrentChatId(null)
          setMessages([])
        }
      }
    } catch (error) {
      console.error('删除对话失败:', error)
    }
    setShowDropdown(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const logout = () => {
    AuthService.clearAuth()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50 flex">
      {/* 左侧工具栏 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* 回到顶部按钮 */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={scrollToTop}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>性格报告</span>
          </button>
        </div>

        {/* 用户信息 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {userInfo?.nickname?.charAt(0) || '用'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{userInfo?.nickname || '用户'}</p>
              <p className="text-sm text-gray-500">性格分析师</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span>返回仪表板</span>
            </button>
            
            <div className="w-full px-4 py-3 text-blue-600 bg-blue-50 rounded-lg flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>性格报告</span>
            </div>
          </nav>
        </div>

        {/* 底部操作 */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>退出登录</span>
          </button>
        </div>
      </div>

      {/* 聊天记录侧边栏 */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isChatHistoryOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">聊天记录</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={createNewChat}
                className="p-1 hover:bg-gray-100 rounded text-blue-600"
                title="新对话"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => setIsChatHistoryOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {chatHistories.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">暂无聊天记录</p>
            ) : (
              <div className="space-y-2">
                {chatHistories.map((history) => (
                  <div key={history.id} className={`relative p-3 hover:bg-gray-50 rounded-lg cursor-pointer group ${currentChatId === history.id ? 'bg-blue-50 border border-blue-200' : ''}`}>
                    <div onClick={() => loadChatMessages(history.id)} className="flex-1">
                      {isRenaming === history.id ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => confirmRename(history.id)}
                          onKeyPress={(e) => e.key === 'Enter' && confirmRename(history.id)}
                          className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1">
                            {history.isPinned && (
                              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                            <p className="font-medium text-sm text-gray-900 truncate flex-1">{history.title}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDropdown(showDropdown === history.id ? null : history.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {history.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* 下拉菜单 */}
                    {showDropdown === history.id && (
                      <div className="absolute right-2 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-24">
                        <button
                          onClick={() => togglePin(history.id, history.isPinned)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          <span>{history.isPinned ? '取消置顶' : '置顶'}</span>
                        </button>
                        <button
                          onClick={() => startRename(history.id, history.title)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>重命名</span>
                        </button>
                        <button
                          onClick={() => deleteChat(history.id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>删除</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 聊天记录展开按钮 */}
      {!isChatHistoryOpen && (
        <button
          onClick={() => setIsChatHistoryOpen(true)}
          className="fixed left-64 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 shadow-sm hover:bg-gray-50 transition-colors z-10"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 报告展示区域 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">性格分析报告</h1>
              <p className="text-gray-600">基于您的个人信息生成的专属性格分析</p>
            </div>

            {isLoadingReport ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">正在生成您的专属报告...</span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-sm">
                <MarkdownRenderer content={report || '报告生成中，请稍候...'} />
              </div>
            )}
          </div>
        </div>

        {/* 聊天界面 */}
        <div className="h-96 bg-gray-50 border-t border-gray-200 flex flex-col">
          {/* 聊天头部 */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">性格分析师</p>
                  <p className="text-sm text-gray-500">在线 · 随时为您解答</p>
                </div>
              </div>
              {!currentChatId && (
                <button
                  onClick={createNewChat}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  开始新对话
                </button>
              )}
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">您好！我是您的专属性格分析师</p>
                <p className="text-gray-500 text-sm">有任何关于性格报告的问题，随时问我吧！</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoadingChat && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-200 px-4 py-2 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">正在思考...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentChatId ? "输入您的问题..." : "请先创建新对话"}
                  disabled={!currentChatId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoadingChat || !currentChatId}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-2xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalityReport 