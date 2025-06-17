import { Link } from 'react-router-dom'

const Learn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">学习中心</h1>
          <p className="text-xl text-gray-700 mb-8">
            深入了解命理学知识
          </p>
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <p className="text-gray-600 mb-8">学习页面正在开发中...</p>
            <Link 
              to="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Learn 