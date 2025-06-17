import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

// 管理员密码（实际项目中应该放在环境变量中）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tianyi2024'

// 内存存储兑换码（实际项目中应该用数据库）
interface ExchangeCode {
  id: string
  code: string
  status: 'pending' | 'used' | 'expired'
  createdAt: string
  usedAt?: string
  usedBy?: string
  createdBy: string
}

const exchangeCodes: ExchangeCode[] = [
  // 预设一些测试兑换码
  {
    id: '1',
    code: '2406AB8F9E2D4C7K',
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  },
  {
    id: '2', 
    code: '2406CD1A3B5E7F9M',
    status: 'used',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 昨天
    usedAt: new Date().toISOString(),
    usedBy: '13800138000',
    createdBy: 'admin'
  },
  {
    id: '3',
    code: '2406EF2B4C6D8G1N',
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  },
  {
    id: '4',
    code: '2406GH3C5D7E9H2P',
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  }
]

// 生成16位兑换码
function generateExchangeCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // 后两位年份
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const date = now.getDate().toString().padStart(2, '0')
  
  // 格式：年月日 + 10位随机字符 = 16位
  const prefix = year + month + date // 6位日期
  let randomPart = ''
  
  // 生成10位随机字符
  for (let i = 0; i < 10; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return prefix + randomPart
}

// 验证管理员密码
router.post('/auth', async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body
    
    if (!password) {
      res.status(400).json({ error: '请输入密码' })
      return
    }
    
    if (password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: '密码错误' })
      return
    }
    
    // 生成简单的管理员token
    const adminToken = `admin_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    res.json({
      success: true,
      message: '管理员验证成功',
      token: adminToken
    })
  } catch (error) {
    console.error('管理员验证错误:', error)
    res.status(500).json({ error: '验证失败' })
  }
})

// 生成新的兑换码
router.post('/generate-code', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    // 验证管理员token
    if (!token || !token.startsWith('admin_token_')) {
      res.status(401).json({ error: '未授权访问' })
      return
    }
    
    const newCode = generateExchangeCode()
    const codeData: ExchangeCode = {
      id: (exchangeCodes.length + 1).toString(),
      code: newCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }
    
    exchangeCodes.unshift(codeData) // 添加到数组开头
    
    console.log(`管理员生成了新兑换码: ${newCode}`)
    
    res.json({
      success: true,
      message: '兑换码生成成功',
      code: codeData
    })
  } catch (error) {
    console.error('生成兑换码错误:', error)
    res.status(500).json({ error: '生成兑换码失败' })
  }
})

// 获取兑换码列表
router.get('/codes', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    // 验证管理员token
    if (!token || !token.startsWith('admin_token_')) {
      res.status(401).json({ error: '未授权访问' })
      return
    }
    
    const { status, page = 1, limit = 20 } = req.query
    let filteredCodes = exchangeCodes
    
    // 状态筛选
    if (status && status !== 'all') {
      filteredCodes = exchangeCodes.filter(code => code.status === status)
    }
    
    // 分页
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedCodes = filteredCodes.slice(startIndex, endIndex)
    
    // 统计信息
    const stats = {
      total: exchangeCodes.length,
      pending: exchangeCodes.filter(c => c.status === 'pending').length,
      used: exchangeCodes.filter(c => c.status === 'used').length,
      expired: exchangeCodes.filter(c => c.status === 'expired').length
    }
    
    res.json({
      success: true,
      codes: paginatedCodes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredCodes.length,
        totalPages: Math.ceil(filteredCodes.length / Number(limit))
      },
      stats
    })
  } catch (error) {
    console.error('获取兑换码列表错误:', error)
    res.status(500).json({ error: '获取列表失败' })
  }
})

// 删除兑换码（仅限未使用的）
router.delete('/codes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    // 验证管理员token
    if (!token || !token.startsWith('admin_token_')) {
      res.status(401).json({ error: '未授权访问' })
      return
    }
    
    const { id } = req.params
    const codeIndex = exchangeCodes.findIndex(c => c.id === id)
    
    if (codeIndex === -1) {
      res.status(404).json({ error: '兑换码不存在' })
      return
    }
    
    const code = exchangeCodes[codeIndex]
    if (code.status === 'used') {
      res.status(400).json({ error: '已使用的兑换码不能删除' })
      return
    }
    
    exchangeCodes.splice(codeIndex, 1)
    
    res.json({
      success: true,
      message: '兑换码删除成功'
    })
  } catch (error) {
    console.error('删除兑换码错误:', error)
    res.status(500).json({ error: '删除失败' })
  }
})

// 验证兑换码（供用户登录时使用）
export function validateExchangeCode(code: string): { valid: boolean; codeData?: ExchangeCode } {
  const codeData = exchangeCodes.find(c => c.code === code && c.status === 'pending')
  return {
    valid: !!codeData,
    codeData
  }
}

// 标记兑换码为已使用
export function markCodeAsUsed(code: string, phone: string): boolean {
  const codeData = exchangeCodes.find(c => c.code === code && c.status === 'pending')
  if (codeData) {
    codeData.status = 'used'
    codeData.usedAt = new Date().toISOString()
    codeData.usedBy = phone
    return true
  }
  return false
}

export default router 