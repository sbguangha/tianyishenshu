import { Router, Request, Response } from 'express'

const router = Router()

// 测试API连接
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '前后端通信成功！',
    timestamp: new Date().toISOString(),
    server: {
      status: 'running',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }
  })
})

// 健康检查
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  })
})

export default router 