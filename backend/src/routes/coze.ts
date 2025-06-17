import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { ChatHistory } from '../models/ChatHistory'

const router = Router()

// 应用认证中间件到所有路由
router.use(authMiddleware)

// 生成性格报告
router.post('/personality-report', async (req: Request, res: Response) => {
  try {
    const { userInfo } = req.body
    
    // 这里应该调用真实的Coze API
    // 目前返回模拟数据
    const mockReport = `# 性格分析报告

## 基本信息
姓名：${userInfo?.nickname || '用户'}
性别：${userInfo?.gender || '未知'}
出生日期：${userInfo?.birthYear || ''}年${userInfo?.birthMonth || ''}月${userInfo?.birthDay || ''}日

## 性格特征分析

### 核心性格类型：探索者型
您是一个充满好奇心和创造力的人，喜欢探索新事物，对未知充满兴趣。您具有以下特征：

**优势特质：**
• 创新思维：善于从不同角度思考问题
• 适应能力强：能够快速适应新环境和变化
• 学习能力出色：对新知识有强烈的求知欲
• 独立自主：喜欢按照自己的方式做事

**成长空间：**
• 专注力：有时容易被新事物分散注意力
• 坚持性：对于长期项目可能缺乏持续动力
• 细节处理：更关注大局，可能忽略细节

## 人际关系模式

您在人际交往中表现出以下特点：
- 善于与不同类型的人建立联系
- 喜欢分享新想法和见解
- 重视思想交流胜过情感表达
- 需要一定的独处时间来思考和充电

## 职业发展建议

基于您的性格特征，以下职业方向可能适合您：
1. 创意设计类：UI/UX设计师、产品经理
2. 技术研发类：软件工程师、数据分析师
3. 咨询顾问类：管理咨询、战略规划
4. 教育培训类：培训师、课程设计师

## 个人成长建议

**短期目标（1-3个月）：**
- 培养专注力，每天进行20分钟的专注练习
- 建立日常规划习惯，提高执行力

**中期目标（3-12个月）：**
- 选择一个长期项目坚持完成
- 加强细节管理能力

**长期目标（1-3年）：**
- 在某个专业领域建立深度专长
- 平衡探索新事物与深耕现有领域的关系

这份报告基于您提供的基本信息进行分析，如需更详细的个性化建议，欢迎与我进一步交流。`

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    return res.json({
      success: true,
      report: mockReport,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('生成性格报告失败:', error)
    return res.status(500).json({
      success: false,
      error: '生成报告时出现错误，请稍后重试'
    })
  }
})

// 性格报告聊天
router.post('/personality-chat', async (req: Request, res: Response) => {
  try {
    const { message, context, chatId } = req.body
    const userId = (req as any).user.id
    
    // 这里应该调用真实的Coze API进行对话
    // 目前返回模拟响应
    const responses = [
      `感谢您的问题："${message}"。根据您的性格分析，我建议您可以尝试从自己的优势特质出发，比如您的创新思维能力，来解决这个问题。`,
      `这是一个很好的问题。基于您的性格特征，我认为您在这方面有很大的潜力。建议您可以多关注细节处理方面的提升。`,
      `从您的性格报告来看，您在适应能力方面表现出色。针对您提到的"${message}"，我建议您可以利用这个优势。`,
      `我理解您的困惑。让我从性格分析的角度为您解答：作为探索者型性格，您天生具有学习能力强的特点，这对解决您的问题很有帮助。`
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 如果提供了chatId，保存消息到数据库
    if (chatId) {
      try {
        const chatHistory = await ChatHistory.findOne({ _id: chatId, userId })
        if (chatHistory) {
          // 添加用户消息
          chatHistory.messages.push({
            id: Date.now().toString(),
            type: 'user',
            content: message,
            timestamp: new Date()
          })
          
          // 添加AI回复
          chatHistory.messages.push({
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: randomResponse,
            timestamp: new Date()
          })
          
          await chatHistory.save()
        }
      } catch (dbError) {
        console.error('保存聊天记录失败:', dbError)
      }
    }

    return res.json({
      success: true,
      response: randomResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('聊天请求失败:', error)
    return res.status(500).json({
      success: false,
      error: '聊天服务暂时不可用，请稍后重试'
    })
  }
})

// 获取聊天历史列表
router.get('/chat-history', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    
    const histories = await ChatHistory.find({ userId })
      .sort({ isPinned: -1, updatedAt: -1 })
      .select('_id title isPinned createdAt updatedAt')
      .limit(50)

    return res.json({
      success: true,
      histories: histories.map(h => ({
        id: h._id,
        title: h.title,
        isPinned: h.isPinned,
        timestamp: h.updatedAt
      })),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('获取聊天历史失败:', error)
    return res.status(500).json({
      success: false,
      error: '获取聊天历史失败'
    })
  }
})

// 创建新对话
router.post('/chat-history', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { title = '新对话' } = req.body

    const newChat = new ChatHistory({
      userId,
      title,
      messages: [],
      isPinned: false
    })

    await newChat.save()

    return res.json({
      success: true,
      chat: {
        id: newChat._id,
        title: newChat.title,
        isPinned: newChat.isPinned,
        timestamp: newChat.createdAt
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('创建对话失败:', error)
    return res.status(500).json({
      success: false,
      error: '创建对话失败'
    })
  }
})

// 获取特定对话的消息
router.get('/chat-history/:chatId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { chatId } = req.params

    const chatHistory = await ChatHistory.findOne({ _id: chatId, userId })
    
    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        error: '对话不存在'
      })
    }

    return res.json({
      success: true,
      chat: {
        id: chatHistory._id,
        title: chatHistory.title,
        messages: chatHistory.messages,
        isPinned: chatHistory.isPinned,
        timestamp: chatHistory.updatedAt
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('获取对话详情失败:', error)
    return res.status(500).json({
      success: false,
      error: '获取对话详情失败'
    })
  }
})

// 重命名对话
router.put('/chat-history/:chatId/rename', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { chatId } = req.params
    const { title } = req.body

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: '标题不能为空'
      })
    }

    const chatHistory = await ChatHistory.findOneAndUpdate(
      { _id: chatId, userId },
      { title: title.trim() },
      { new: true }
    )

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        error: '对话不存在'
      })
    }

    return res.json({
      success: true,
      chat: {
        id: chatHistory._id,
        title: chatHistory.title,
        isPinned: chatHistory.isPinned,
        timestamp: chatHistory.updatedAt
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('重命名对话失败:', error)
    return res.status(500).json({
      success: false,
      error: '重命名对话失败'
    })
  }
})

// 置顶/取消置顶对话
router.put('/chat-history/:chatId/pin', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { chatId } = req.params
    const { isPinned } = req.body

    const chatHistory = await ChatHistory.findOneAndUpdate(
      { _id: chatId, userId },
      { isPinned: Boolean(isPinned) },
      { new: true }
    )

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        error: '对话不存在'
      })
    }

    return res.json({
      success: true,
      chat: {
        id: chatHistory._id,
        title: chatHistory.title,
        isPinned: chatHistory.isPinned,
        timestamp: chatHistory.updatedAt
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('置顶对话失败:', error)
    return res.status(500).json({
      success: false,
      error: '置顶对话失败'
    })
  }
})

// 删除对话
router.delete('/chat-history/:chatId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { chatId } = req.params

    const result = await ChatHistory.findOneAndDelete({ _id: chatId, userId })

    if (!result) {
      return res.status(404).json({
        success: false,
        error: '对话不存在'
      })
    }

    return res.json({
      success: true,
      message: '对话已删除',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('删除对话失败:', error)
    return res.status(500).json({
      success: false,
      error: '删除对话失败'
    })
  }
})

export default router
