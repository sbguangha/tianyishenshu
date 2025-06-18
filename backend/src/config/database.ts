import mongoose from 'mongoose'
import dns from 'dns'

export const connectDatabase = async (): Promise<void> => {
  // 如果已经连接或正在连接，则直接返回，避免重复连接
  if (mongoose.connection.readyState >= 1) {
    return
  }

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
    
    // 增加日志，便于调试
    console.log('⏳ 尝试连接到 MongoDB...')
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // 增加超时以适应Serverless环境的冷启动
      connectTimeoutMS: 20000,
      bufferCommands: false, // 如果未连接，让操作快速失败
    })
        
    console.log('✅ MongoDB 连接成功')
        
    mongoose.connection.on('error', (error) => console.error('❌ MongoDB 连接错误:', error))
    mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB 连接已断开'))
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    // 在Serverless环境中，我们应该抛出错误来中止当前调用
    throw error
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('✅ MongoDB连接已关闭')
  }
} 