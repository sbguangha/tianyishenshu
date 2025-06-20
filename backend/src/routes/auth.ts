import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { validateInput } from 'middleware/validation'
import { validateExchangeCode, markCodeAsUsed } from './admin'
import { JWT_CONFIG } from 'config/jwtConfig'
import User from 'models/User'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import tencentcloud from 'tencentcloud-sdk-nodejs'

const router = express.Router()

// --- 腾讯云SMS客户端初始化 ---
const TcsClient = tencentcloud.sms.v20210111.Client

const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID!,
    secretKey: process.env.TENCENT_SECRET_KEY!,
  },
  region: "ap-guangzhou", // 默认区域，如果您的应用在其他区域，请修改
  profile: {
    httpProfile: {
      endpoint: "sms.tencentcloudapi.com",
    },
  },
}

// 仅在提供了密钥时初始化客户端
const smsClient = 
  process.env.TENCENT_SECRET_ID &&
  process.env.TENCENT_SECRET_KEY &&
  process.env.TENCENT_SMS_SDK_APP_ID &&
  process.env.TENCENT_SMS_SIGN_NAME &&
  process.env.TENCENT_SMS_TEMPLATE_ID
  ? new TcsClient(clientConfig) 
  : null

// --- 发送短信验证码 ---
router.post(
  '/send-sms-code',
  body('phone').isMobilePhone('zh-CN').withMessage('无效的手机号码'),
  async (req: Request, res: Response) => {
    if (!smsClient) {
      return res.status(500).json({ message: '短信服务未正确配置' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { phone } = req.body
    const code = Math.floor(100000 + Math.random() * 900000).toString() // 生成6位验证码
    const codeExpires = new Date(Date.now() + 5 * 60 * 1000) // 5分钟后过期

    try {
      const params = {
        SmsSdkAppId: process.env.TENCENT_SMS_SDK_APP_ID!,
        SignName: process.env.TENCENT_SMS_SIGN_NAME!,
        TemplateId: process.env.TENCENT_SMS_TEMPLATE_ID!,
        PhoneNumberSet: [`+86${phone}`],
        TemplateParamSet: [code],
      }

      const sendResult = await smsClient.SendSms(params)
      
      if (sendResult.SendStatusSet && sendResult.SendStatusSet[0].Code === 'Ok') {
        let user = await User.findOne({ phone })
        if (!user) {
          user = new User({ phone })
        }
        user.smsCode = code
        user.smsCodeExpires = codeExpires
        await user.save()

        res.status(200).json({ message: '验证码已发送' })
      } else {
        const errorMessage = sendResult.SendStatusSet ? sendResult.SendStatusSet[0].Message : '未知错误'
        console.error("腾讯云短信发送失败:", sendResult.SendStatusSet ? sendResult.SendStatusSet[0] : '无响应')
        res.status(500).json({ message: '短信发送失败', error: errorMessage })
      }
    } catch (error) {
      console.error('发送验证码时出错:', error)
      res.status(500).json({ message: '服务器内部错误' })
    }
  }
)

// --- 短信验证码登录 ---
router.post(
  '/login-with-sms',
  [
    body('phone').isMobilePhone('zh-CN').withMessage('无效的手机号码'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('验证码必须是6位'),
  ],
  async (req: Request, res: Response) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT密钥未配置' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { phone, code } = req.body

    try {
      const user = await User.findOne({ phone, smsCode: code, smsCodeExpires: { $gt: new Date() } })

      if (!user) {
        return res.status(400).json({ message: '验证码错误或已过期' })
      }

      console.log(`[Login] User found: ${user.phone}. Roles: ${user.roles.join(', ')}`);
      const superAdminPhone = process.env.SUPER_ADMIN_PHONE;
      console.log(`[Login] Checking against SUPER_ADMIN_PHONE: ${superAdminPhone}`);

      if (phone === superAdminPhone) {
        console.log(`[Login] Matched SUPER_ADMIN_PHONE. Granting admin role.`);
        if (!user.roles.includes('admin')) {
          user.roles.push('admin');
        }
      }
      
      user.lastLoginAt = new Date()
      user.smsCode = undefined // 清除已使用的验证码
      user.smsCodeExpires = undefined
      await user.save()

      // 创建JWT
      const userPayload = { id: user.id, phone: user.phone, roles: user.roles }
      const token = jwt.sign(
        userPayload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      res.status(200).json({
        message: "登录成功",
        token,
        user: userPayload
      })

    } catch (error) {
      console.error('短信登录时出错:', error)
      res.status(500).json({ message: '服务器内部错误' })
    }
  }
)

// --- 用户名密码注册 ---
router.post(
  '/register',
  [
    body('phone').isMobilePhone('zh-CN').withMessage('无效的手机号码'),
    body('password').isLength({ min: 6 }).withMessage('密码至少需要6位'),
  ],
  async (req: Request, res: Response) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT密钥未配置' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { phone, password } = req.body

    try {
      let user = await User.findOne({ phone })
      if (user) {
        return res.status(400).json({ message: '该手机号已被注册' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      user = new User({
        phone,
        password: hashedPassword,
      })

      if (phone === process.env.SUPER_ADMIN_PHONE) {
        user.roles.push('admin')
      }

      await user.save()
      
      const userPayload = { id: user.id, phone: user.phone, roles: user.roles }
      const token = jwt.sign(
        userPayload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      res.status(201).json({ message: '注册成功', token, user: userPayload })

    } catch (error) {
      console.error('注册时出错:', error)
      res.status(500).json({ message: '服务器内部错误' })
    }
  }
)

// --- 用户名密码登录 ---
router.post(
  '/login',
  [
    body('phone').isMobilePhone('zh-CN').withMessage('无效的手机号码'),
    body('password').not().isEmpty().withMessage('密码不能为空'),
  ],
  async (req: Request, res: Response) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT密钥未配置' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { phone, password } = req.body

    try {
      const user = await User.findOne({ phone })
      if (!user || !user.password) {
        return res.status(401).json({ message: '手机号或密码错误' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: '手机号或密码错误' })
      }

      user.lastLoginAt = new Date()
      await user.save()

      const userPayload = { id: user.id, phone: user.phone, roles: user.roles }
      const token = jwt.sign(
        userPayload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      res.status(200).json({ message: '登录成功', token, user: userPayload })

    } catch (error) {
      console.error('登录时出错:', error)
      res.status(500).json({ message: '服务器内部错误' })
    }
  }
)

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