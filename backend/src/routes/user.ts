import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { JwtPayload } from 'jsonwebtoken';

const router = Router();

// 用户信息的数据结构
interface UserProfile {
  id: string;
  nickname: string;
  gender: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  birthRegion: string;
  lunarInfo?: any;
  createdAt: Date;
  updatedAt: Date;
}

// 使用 Map 在内存中存储用户信息 (key: userId)
const userProfiles: Map<string, UserProfile> = new Map();

/**
 * @route   POST /api/user/profile
 * @desc    创建或更新用户信息
 * @access  Private (需要JWT)
 */
router.post('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { nickname, gender, birthYear, birthMonth, birthDay, birthHour, birthMinute, birthRegion, lunarInfo } = req.body;
    
    // 从经过验证的令牌中获取用户ID
    const userId = (req.user as JwtPayload)?.id;

    if (!userId) {
      return res.status(401).json({ error: '无效的令牌，无法识别用户' });
    }

    // 基本的输入验证
    if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
      return res.status(400).json({ error: '昵称是必填项' });
    }

    const now = new Date();
    const existingProfile = userProfiles.get(userId);

    const profile: UserProfile = {
      id: userId,
      nickname: nickname.trim(),
      gender,
      birthYear: parseInt(birthYear, 10),
      birthMonth: parseInt(birthMonth, 10),
      birthDay: parseInt(birthDay, 10),
      birthHour: parseInt(birthHour, 10),
      birthMinute: parseInt(birthMinute, 10),
      birthRegion: birthRegion || '',
      lunarInfo,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };

    userProfiles.set(userId, profile);

    console.log(`用户 ${userId} 的信息已成功保存/更新。`);
    return res.status(200).json({ message: '用户信息保存成功', profile });

  } catch (error) {
    console.error('保存用户信息时出错:', error);
    return res.status(500).json({ error: '服务器内部错误，无法保存信息' });
  }
});

/**
 * @route   GET /api/user/profile
 * @desc    获取当前用户的个人信息
 * @access  Private (需要JWT)
 */
router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as JwtPayload)?.id;

    if (!userId) {
      return res.status(401).json({ error: '无效的令牌，无法识别用户' });
    }

    const profile = userProfiles.get(userId);

    if (!profile) {
      // 在这种情况下，前端应该引导用户去填写信息
      return res.status(404).json({ error: '未找到用户信息' });
    }

    return res.status(200).json({ profile });

  } catch (error) {
    console.error('获取用户信息时出错:', error);
    return res.status(500).json({ error: '服务器内部错误，无法获取信息' });
  }
});

export default router;