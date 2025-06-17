import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  statusCode?: number
  code?: string
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500
  let message = err.message || '服务器内部错误'
  let code = err.code || 'INTERNAL_SERVER_ERROR'

  // MongoDB错误处理
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = '数据验证失败'
    code = 'VALIDATION_ERROR'
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = '无效的数据格式'
    code = 'CAST_ERROR'
  }

  if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 409
    message = '数据已存在'
    code = 'DUPLICATE_ERROR'
  }

  // JWT错误处理
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = '无效的访问令牌'
    code = 'INVALID_TOKEN'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = '访问令牌已过期'
    code = 'TOKEN_EXPIRED'
  }

  // 记录错误日志
  console.error('API错误:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  })

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
} 