import { useState } from 'react'
import { Calendar, Clock, User, MapPin } from 'lucide-react'

interface BirthInfo {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  gender: 'male' | 'female'
}

interface AnalysisResult {
  bazi: string
  personality: string
  career: string
  health: string
  relationship: string
}

const Analysis = () => {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: 'male'
  })

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: keyof BirthInfo, value: string) => {
    setBirthInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAnalysis = async () => {
    if (!birthInfo.name || !birthInfo.birthDate || !birthInfo.birthTime) {
      alert('请填写完整的出生信息')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(birthInfo),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult(result)
      } else {
        alert('分析请求失败，请稍后重试')
      }
    } catch (error) {
      console.error('分析错误:', error)
      alert('服务器连接失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          命理分析
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          请填写准确的出生信息，我们将为您提供详细的命理分析
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入表单 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            出生信息
          </h2>

          <div className="space-y-4">
            {/* 姓名 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 mr-2" />
                姓名
              </label>
              <input
                type="text"
                value={birthInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="请输入您的姓名"
              />
            </div>

            {/* 出生日期 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                出生日期
              </label>
              <input
                type="date"
                value={birthInfo.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* 出生时间 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                出生时间
              </label>
              <input
                type="time"
                value={birthInfo.birthTime}
                onChange={(e) => handleInputChange('birthTime', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* 出生地点 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                出生地点
              </label>
              <input
                type="text"
                value={birthInfo.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="例：北京市"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                性别
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={birthInfo.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  男
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={birthInfo.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  女
                </label>
              </div>
            </div>

            {/* 分析按钮 */}
            <button
              onClick={handleAnalysis}
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '分析中...' : '开始分析'}
            </button>
          </div>
        </div>

        {/* 右侧：分析结果 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            分析结果
          </h2>

          {!analysisResult && !loading && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              请先填写出生信息并点击"开始分析"
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">正在分析中...</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  八字信息
                </h3>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {analysisResult.bazi}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  性格特点
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {analysisResult.personality}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  事业运势
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {analysisResult.career}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  健康状况
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {analysisResult.health}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  感情运势
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {analysisResult.relationship}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analysis 