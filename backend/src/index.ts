import app from './app'
import { connectDatabase } from './config/database'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

const PORT = process.env.PORT || 3001

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDatabase()
    
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`)
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`)
      console.log(`📱 API地址: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`)
      console.log(`🔍 健康检查: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('❌ 服务器启动失败:', error)
    process.exit(1)
  }
}

// 处理未捕获的异常
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', promise, '原因:', reason)
  // 在生产环境中，您可能希望有一个更优雅的重启策略
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
  // 在生产环境中，您可能希望有一个更优雅的重启策略
  process.exit(1)
})

startServer() 