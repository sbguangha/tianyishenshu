import express from 'express'
import jwt from 'jsonwebtoken'
import { validateInput } from 'middleware/validation'
import { Request, Response } from 'express'
import { validateExchangeCode, markCodeAsUsed } from './admin'
import { JWT_CONFIG } from 'config/jwtConfig'
import User from 'models/User'

const router = express.Router()

// 发送短信验证码
router.post('/send-sms', validateInput, async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body

    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ error: '手机号格式不正确' })
      return
    }

    // TODO: 集成腾讯云短信服务
    // 目前返回模拟成功响应
    console.log(`模拟发送验证码到手机: ${phone}`)
    
    // 模拟生成6位验证码
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`生成的验证码: ${verifyCode}`)

    // TODO: 将验证码存储到Redis或数据库中，设置5分钟过期时间
    
    res.json({ 
      success: true, 
      message: '验证码已发送',
      // 开发环境下返回验证码，生产环境下不返回
      ...(process.env.NODE_ENV === 'development' && { code: verifyCode })
    })
  } catch (error) {
    console.error('发送短信验证码错误:', error)
    res.status(500).json({ error: '发送验证码失败' })
  }
})

// 验证兑换码
router.post('/validate-exchange-code', validateInput, async (req: Request, res: Response): Promise<void> => {
  try {
    const { exchangeCode } = req.body

    // 兑换码格式验证 - 16位数字字母组合
    const codeRegex = /^[A-Za-z0-9]{16}$/
    if (!codeRegex.test(exchangeCode)) {
      res.status(400).json({ error: '兑换码格式不正确' })
      return
    }

    // 使用admin模块的验证函数
    const validation = validateExchangeCode(exchangeCode.toUpperCase())
    
    if (!validation.valid) {
      res.status(400).json({ error: '兑换码无效或已使用' })
      return
    }

    res.json({ 
      success: true, 
      message: '兑换码验证成功',
      valid: true
    })
  } catch (error) {
    console.error('验证兑换码错误:', error)
    res.status(500).json({ error: '验证兑换码失败' })
  }
})

// 登录验证
router.post('/verify-login', validateInput, async (req: Request, res: Response) => {
  try {
    const { phone, code, exchangeCode, rememberMe } = req.body

    // --- 万能验证码和超级用户逻辑 ---
    if (
      process.env.NODE_ENV === 'development' &&
      phone === process.env.SUPER_USER_PHONE &&
      code === process.env.SUPER_USER_CODE
    ) {
      console.log(`超级用户 ${phone} 正在登录...`);
      let user = await User.findOne({ phone: phone });
      
      if (!user) {
        console.log(`超级用户 ${phone} 不存在，将自动创建...`);
        user = new User({
          phone: phone,
          isSuperUser: true, // 可以给超级用户一个特殊标记
          needsUserInfo: true,
          roles: ['admin'] // 可以赋予管理员角色
        });
        await user.save();
        console.log(`超级用户 ${phone} 创建成功`);
      }

      const userPayload = { id: user.id, phone: user.phone, roles: user.roles };
      const token = jwt.sign(userPayload, JWT_CONFIG.secret, { expiresIn: rememberMe ? '30d' : '1d' });
      
      res.json({
        success: true,
        message: '超级用户登录成功',
        token: token,
        user: user.toObject(),
      });
      return;
    }
    // --- 超级用户逻辑结束 ---


    // --- 正常用户登录逻辑 ---
    const phoneRegex = /^1[3-9]\\d{9}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ error: '手机号格式不正确' });
      return;
    }

    if (!code || code.length !== 6) {
      res.status(400).json({ error: '验证码格式不正确' });
      return;
    }
    
    // TODO: 验证手机验证码 (目前是模拟)
    const isCodeValid = code === '123456'; // 简化模拟逻辑
    if (!isCodeValid) {
        res.status(400).json({ error: '验证码错误' });
        return;
    }

    // 兑换码验证
    const codeRegex = /^[A-Za-z0-9]{16}$/;
    if (!exchangeCode || !codeRegex.test(exchangeCode)) {
      res.status(400).json({ error: '兑换码格式不正确' });
      return;
    }

    const validation = validateExchangeCode(exchangeCode.toUpperCase());
    if (!validation.valid) {
      res.status(400).json({ error: '兑换码无效或已使用' });
      return;
    }
    
    // 查找或创建用户
    let user = await User.findOne({ phone: phone });
    if (!user) {
        user = new User({ phone: phone, needsUserInfo: true });
    }
    
    // 标记兑换码为已使用并关联用户
    const marked = markCodeAsUsed(exchangeCode.toUpperCase(), phone);
    if (!marked) {
        res.status(400).json({ error: '兑换码处理失败' });
        return;
    }
    
    if (!user.exchangeCodes.includes(exchangeCode.toUpperCase())) {
      user.exchangeCodes.push(exchangeCode.toUpperCase());
    }
    await user.save();
    console.log(`用户 ${phone} 使用兑换码 ${exchangeCode.toUpperCase()} 登录/注册成功`);


    // 生成JWT令牌
    const userPayload = { id: user.id, phone: user.phone, roles: user.roles };
    const token = jwt.sign(userPayload, JWT_CONFIG.secret, { expiresIn: rememberMe ? '30d' : '1d' });
    
    res.json({
      success: true,
      message: '登录成功',
      token: token,
      user: user.toObject(),
    });

  } catch (error) {
    console.error('登录验证错误:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 检查登录状态
router.get('/check-login', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      res.status(401).json({ error: '未登录' })
      return
    }

    // TODO: 验证JWT令牌
    // 目前模拟验证
    if (!token.startsWith('mock_token_')) {
      res.status(401).json({ error: '令牌无效' })
      return
    }

    // 模拟返回用户信息
    res.json({
      success: true,
      user: {
        id: 'user_123',
        phone: '13800138000',
        needsUserInfo: true
      }
    })
  } catch (error) {
    console.error('检查登录状态错误:', error)
    res.status(500).json({ error: '检查登录状态失败' })
  }
})

export default router 