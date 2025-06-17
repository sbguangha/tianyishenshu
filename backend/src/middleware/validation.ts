import { Request, Response, NextFunction } from 'express'

// 通用输入验证中间件
export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  // 基础参数检查
  if (!req.body) {
    res.status(400).json({
      success: false,
      error: '请求体不能为空',
      code: 'EMPTY_BODY'
    })
    return
  }

  next()
}

export const validateAnalysisInput = (req: Request, res: Response, next: NextFunction): void => {
  const { name, birthDate, birthTime, birthPlace, gender } = req.body

  // 验证必填字段
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: '请输入有效的姓名',
      code: 'INVALID_NAME'
    })
    return
  }

  if (!birthDate || typeof birthDate !== 'string') {
    res.status(400).json({
      success: false,
      error: '请输入有效的出生日期',
      code: 'INVALID_BIRTH_DATE'
    })
    return
  }

  if (!birthTime || typeof birthTime !== 'string') {
    res.status(400).json({
      success: false,
      error: '请输入有效的出生时间',
      code: 'INVALID_BIRTH_TIME'
    })
    return
  }

  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(birthDate)) {
    res.status(400).json({
      success: false,
      error: '出生日期格式不正确，请使用YYYY-MM-DD格式',
      code: 'INVALID_DATE_FORMAT'
    })
    return
  }

  // 验证时间格式
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(birthTime)) {
    res.status(400).json({
      success: false,
      error: '出生时间格式不正确，请使用HH:MM格式',
      code: 'INVALID_TIME_FORMAT'
    })
    return
  }

  // 验证性别
  if (gender && !['male', 'female'].includes(gender)) {
    res.status(400).json({
      success: false,
      error: '性别必须是male或female',
      code: 'INVALID_GENDER'
    })
    return
  }

  // 验证日期合理性
  const date = new Date(birthDate)
  const now = new Date()
  const minDate = new Date('1900-01-01')

  if (date > now) {
    res.status(400).json({
      success: false,
      error: '出生日期不能超过当前日期',
      code: 'FUTURE_DATE'
    })
    return
  }

  if (date < minDate) {
    res.status(400).json({
      success: false,
      error: '出生日期不能早于1900年',
      code: 'TOO_EARLY_DATE'
    })
    return
  }

  // 验证姓名长度
  if (name.length > 50) {
    res.status(400).json({
      success: false,
      error: '姓名长度不能超过50个字符',
      code: 'NAME_TOO_LONG'
    })
    return
  }

  // 验证出生地点长度
  if (birthPlace && birthPlace.length > 100) {
    res.status(400).json({
      success: false,
      error: '出生地点长度不能超过100个字符',
      code: 'PLACE_TOO_LONG'
    })
    return
  }

  next()
} 