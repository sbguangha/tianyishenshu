import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDaysIcon,
  // ClockIcon
} from '@heroicons/react/24/outline'
// import { Lunar, Solar } from 'lunar-javascript'
// import type { Solar } from 'lunar-javascript'
import RegionSelector from '../components/RegionSelector'
import { AuthService } from '../utils/auth'

interface UserProfile {
  nickname: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthMinute: number
  birthRegion: string
  regionInfo?: {
    province?: { code: string; name: string }
    city?: { code: string; name: string }
    district?: { code: string; name: string }
    fullName?: string
  }
  lunarInfo?: {
    year: number
    month: number
    day: number
    isLeap: boolean
    yearInChinese: string
    monthInChinese: string
    dayInChinese: string
  }
}

const UserForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showLunarModal, setShowLunarModal] = useState(false)
  const [lunarInput, setLunarInput] = useState({
    year: 1990,
    month: 1,
    day: 1,
    isLeap: false
  })

  const [profile, setProfile] = useState<UserProfile>({
    nickname: '',
    gender: '男',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    birthRegion: ''
  })

  // 生成年份选项 (1900-2024)
  const years = Array.from({ length: 125 }, (_, i) => 2024 - i)
  // 生成月份选项
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  // 生成日期选项
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }
  const days = Array.from({ length: getDaysInMonth(profile.birthYear, profile.birthMonth) }, (_, i) => i + 1)
  // 生成小时选项
  const hours = Array.from({ length: 24 }, (_, i) => i)
  // 生成分钟选项
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // 处理农历转换
  const handleLunarConvert = () => {
    // Temporarily disabled for Vercel deployment
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile.nickname.trim()) {
      alert('请输入昵称')
      return
    }

    setLoading(true)
    
    try {
      // 使用AuthService进行认证请求
      const response = await AuthService.authenticatedFetch('/api/user/profile', {
        method: 'POST',
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ 用户信息保存成功:', result)
        
        // 将用户信息保存到localStorage，以便Dashboard页面使用
        localStorage.setItem('userInfo', JSON.stringify({ 
          nickname: profile.nickname,
          ...result.profile 
        }))
        
        // 保存成功，跳转到dashboard
        navigate('/dashboard')
      } else {
        const error = await response.text()
        console.log('❌ 请求失败:', error)
        console.log('响应状态:', response.status)
        alert(`保存失败: ${error}`)
      }
    } catch (error) {
      console.error('网络错误:', error)
      alert('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full">
      <div className="max-w-2xl w-full lg:max-w-3xl xl:max-w-4xl space-y-8">
        {/* Logo和标题 */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-black">天乙神数</span>
          </Link>
          <h2 className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
            完善您的个人信息
          </h2>
          <p className="mt-2 text-gray-600 lg:text-lg">填写详细信息，获得精准命理分析</p>
        </div>

        {/* 进度指示器 */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-green-600">身份验证</span>
            </div>
            <div className="flex-1 mx-4 h-px bg-green-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-black">完善信息</span>
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
        
        {/* 用户信息表单 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息网格布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 昵称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昵称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.nickname}
                  onChange={(e) => setProfile(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                  placeholder="请输入您的昵称"
                  required
                />
              </div>

              {/* 性别 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性别 <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
            </div>

            {/* 出生日期和时间 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  出生日期和时间 <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowLunarModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  农历转换
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4">
                <select
                  value={profile.birthYear}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthYear: parseInt(e.target.value) }))}
                  className="px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
                
                <select
                  value={profile.birthMonth}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthMonth: parseInt(e.target.value) }))}
                  className="px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}月</option>
                  ))}
                </select>
                
                <select
                  value={profile.birthDay}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthDay: parseInt(e.target.value) }))}
                  className="px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}日</option>
                  ))}
                </select>
                
                <select
                  value={profile.birthHour}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthHour: parseInt(e.target.value) }))}
                  className="px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                >
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}时</option>
                  ))}
                </select>
                
                <select
                  value={profile.birthMinute}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthMinute: parseInt(e.target.value) }))}
                  className="px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lg:text-lg"
                >
                  {minutes.map(minute => (
                    <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}分</option>
                  ))}
                </select>
              </div>

              {/* 显示农历信息 */}
              {profile.lunarInfo && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    农历：{profile.lunarInfo.yearInChinese}年 {profile.lunarInfo.monthInChinese}月 {profile.lunarInfo.dayInChinese}
                    {profile.lunarInfo.isLeap && <span className="ml-1 text-red-600">(闰月)</span>}
                  </p>
                </div>
              )}
            </div>

            {/* 出生地区 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出生地区
              </label>
              <RegionSelector
                value={profile.regionInfo}
                onChange={(regionInfo) => {
                  setProfile(prev => ({ 
                    ...prev, 
                    regionInfo,
                    birthRegion: regionInfo.fullName || ''
                  }))
                }}
                placeholder="请选择出生地区"
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex space-x-4 pt-4">
              <Link
                to="/login"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 lg:py-4 lg:px-8 rounded-lg font-medium text-center hover:bg-gray-300 transition-colors lg:text-lg"
              >
                返回
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-3 px-6 lg:py-4 lg:px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 lg:text-lg"
              >
                {loading ? '保存中...' : '保存并继续'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 农历转换弹窗 */}
      {showLunarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-black mb-4">农历转阳历</h3>
            <p className="text-gray-600 mb-6">输入农历日期，自动转换为阳历日期</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={lunarInput.year}
                  onChange={(e) => setLunarInput(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
                
                <select
                  value={lunarInput.month}
                  onChange={(e) => setLunarInput(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}月</option>
                  ))}
                </select>
                
                <select
                  value={lunarInput.day}
                  onChange={(e) => setLunarInput(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}日</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isLeap"
                  checked={lunarInput.isLeap}
                  onChange={(e) => setLunarInput(prev => ({ ...prev, isLeap: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="isLeap" className="text-sm text-gray-700">闰月</label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLunarModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleLunarConvert}
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                转换
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserForm 