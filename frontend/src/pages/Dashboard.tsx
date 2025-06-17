import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../utils/auth'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import {
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  HeartIcon,
  SparklesIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard: React.FC = () => {
  const [userNickname, setUserNickname] = useState('用户')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const chartRef = useRef(null)

  useEffect(() => {
    // ProtectedRoute已经处理了认证检查，这里只需要获取用户信息
    const user = AuthService.getUser()
    const userInfo = localStorage.getItem('userInfo')
    
    if (userInfo) {
      try {
        const info = JSON.parse(userInfo)
        setUserNickname(info.nickname || user?.phone || '用户')
        console.log('✅ 用户信息加载成功:', info)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        setUserNickname(user?.phone || '用户')
      }
    } else if (user) {
      setUserNickname(user.phone || '用户')
    }

    const fetchProfileAndGenerateReport = async () => {
      try {
        // ... existing code ...
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndGenerateReport()
  }, [])

  // 退出登录
  const handleLogout = () => {
    AuthService.clearAuth()
    navigate('/login')
  }

  const sidebarItems = [
    { name: '天乙神数', icon: SparklesIcon, href: '/dashboard', current: true },
    { name: '排盘分析', icon: ChartBarIcon, href: '/analysis' },
    { name: '旺运商城', icon: ShoppingBagIcon, href: '/shop' },
    { name: '我的', icon: UserIcon, href: '/profile' },
  ]

  const reportCards = [
    { title: '排盘分析', icon: ChartBarIcon, description: '八字排盘，命理分析', color: 'bg-blue-500' },
    { title: '性格报告', icon: UserIcon, description: '性格特征，行为模式', color: 'bg-green-500' },
    { title: '财富报告', icon: CurrencyDollarIcon, description: '财运分析，投资建议', color: 'bg-yellow-500' },
    { title: '事业报告', icon: BriefcaseIcon, description: '事业发展，职场运势', color: 'bg-purple-500' },
    { title: '婚恋报告', icon: HeartIcon, description: '感情运势，婚姻分析', color: 'bg-pink-500' },
    { title: '健康报告', icon: PlusIcon, description: '健康状况，养生建议', color: 'bg-red-500' },
    { title: '运势报告', icon: SparklesIcon, description: '流年运势，月运分析', color: 'bg-indigo-500' },
    { title: '旺运商城', icon: ShoppingBagIcon, description: '开运用品，风水摆件', color: 'bg-orange-500' },
  ]

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <main>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-3 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">分析概览</h2>
              <div style={{ height: '400px' }}>
                <Bar
                  data={{
                    labels: ['外向性', '严谨性', '开放性', '宜人性', '神经质'],
                    datasets: [
                      {
                        label: '得分',
                        data: [85, 72, 68, 90, 40],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: '五大人格维度得分' },
                    },
                  }}
                />
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">性格类型</h2>
              <div style={{ height: '200px' }}>
                <Pie
                  data={{
                    labels: ['社交型', '思考型', '艺术型'],
                    datasets: [
                      {
                        data: [45, 35, 20],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                        ],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50 flex overflow-hidden">
      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col flex-shrink-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-black">天乙神数</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 用户信息和退出按钮 */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userNickname}</p>
              <p className="text-xs text-gray-500">已登录</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* 主内容区域 - 占满剩余空间 */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* 顶部导航栏 */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <h1 className="ml-2 text-2xl font-bold text-gray-900">天乙神数 命理报告</h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">欢迎，{userNickname}</span>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容 - 可滚动区域 */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full h-full p-6 lg:p-8">
            {/* 描述信息 */}
            <div className="mb-8">
              <p className="text-gray-600 text-base leading-relaxed max-w-4xl">
                在天乙神数，报告后台可以查看你命理报告的各个报告，如性格报告，财富报告等。此外，你还可以针对不同的报告进行提问，直至你弄明白为止。如果AI回答无法完全解决你的困惑，欢迎找命理师进行1对1深度咨询。
              </p>
            </div>

            {/* 报告标题 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">你想查询和了解的报告是?</h2>
            </div>

            {/* 报告卡片网格 - 响应式布局 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {reportCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (card.title === '性格报告') {
                      navigate('/personality-report')
                    } else {
                      // 其他报告暂时显示提示
                      alert(`${card.title}功能正在开发中，敬请期待！`)
                    }
                  }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>

            {/* 免责声明 */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-bold">免责声明:</span> 以上命理报告仅供参考，对于报告中产生的任何预测，只代表本站观点，不对准确度负责。
              </p>
            </div>

            {/* 底部空间 */}
            <div className="h-8"></div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard