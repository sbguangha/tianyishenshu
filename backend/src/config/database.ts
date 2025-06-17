import mongoose from 'mongoose'
import dns from 'dns'

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      console.warn('⚠️ MONGODB_URI 未在 .env 文件中设置. 应用将在无数据库模式下运行.')
      return
    }

    // 仅在连接Atlas时设置DNS
    if (mongoUri.includes('mongodb.net')) {
      dns.setServers(['8.8.8.8', '1.1.1.1'])
    }
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000, // 增加超时以适应网络延迟
      connectTimeoutMS: 10000,
    })
        
    console.log('✅ MongoDB 连接成功')
        
    mongoose.connection.on('error', (error) => console.error('❌ MongoDB 连接错误:', error))
    mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB 连接已断开'))
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    if (process.env.NODE_ENV === 'production') {
      // 在生产环境中，如果数据库连接失败，则退出进程
      process.exit(1)
    }
    // 在开发环境中，允许在无数据库模式下继续运行
    console.warn('⚠️ 应用将在无数据库模式下运行。')
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('✅ MongoDB连接已关闭')
  }
} 