import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app'; // 导入我们配置好的Express应用
import { connectDatabase } from '../src/config/database'; // 导入我们优化后的数据库连接函数

// Vercel会为每个请求调用这个导出的handler函数
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 确保在处理请求之前数据库已连接
    // 我们的connectDatabase函数现在有缓存机制，所以这不会在每个请求上都重新连接
    await connectDatabase();

    // 将请求传递给我们的Express应用来处理
    // Vercel 的请求/响应对象与Express兼容
    return app(req, res);
    
  } catch (error) {
    // 如果数据库连接失败，connectDatabase会抛出错误
    // 我们在这里捕获它，并返回一个服务器错误响应
    console.error('API 路由中的严重错误 (数据库连接失败等):', error);
    
    // 向客户端发送一个通用的错误信息
    res.status(500).json({
      error: '服务器内部错误，无法处理您的请求。',
      code: 'INTERNAL_SERVER_ERROR',
      // 在非生产环境下可以提供更多细节
      details: process.env.NODE_ENV !== 'production' && error instanceof Error 
        ? error.message 
        : undefined,
    });
  }
} 