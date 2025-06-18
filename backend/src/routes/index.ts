import { Router, Request, Response } from 'express'
import testRoutes from './test'
import analysisRoutes from './analysis'
import authRoutes from './auth'
import adminRoutes from './admin'
import userRoutes from './user'
import regionRoutes from './region'
import cozeRoutes from './coze'

const router = Router()

// 测试路由
router.use('/test', testRoutes)

// 命理分析路由
router.use('/analysis', analysisRoutes)

// 认证路由
router.use('/auth', authRoutes)

// 管理员路由
router.use('/admin', adminRoutes)

// 用户路由
router.use('/user', userRoutes)

// 地区路由
router.use('/region', regionRoutes)

// Coze AI路由
router.use('/coze', cozeRoutes)

// 健康检查端点
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    // 在这里我们无法直接访问 process.uptime()，但这对健康检查来说不是核心信息
    // 我们可以返回一个固定的值或省略它。为了简单起见，我们返回一个简单状态。
    environment: process.env.NODE_ENV || 'development'
  });
})

// 根路径信息
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '天乙神数 API 服务',
    version: '1.0.0',
    status: 'ok',
  })
})

export default router 