# 环境变量配置指导

## 情况1：网络可以访问Atlas（推荐）

请手动创建或修改 `backend/.env` 文件：

```
# 服务器配置
PORT=3001
NODE_ENV=development

# MongoDB Atlas数据库配置
MONGODB_URI=mongodb+srv://tianyishenshu:2eXpxM8W3LXFbrX@cluster0.bvzohtw.mongodb.net/tianyishenshu?retryWrites=true&w=majority&appName=Cluster0

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://localhost:5173

# 其他配置
API_PREFIX=/api
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 情况2：网络无法访问Atlas（临时方案）

创建 `backend/.env` 文件用于本地开发：

```
# 服务器配置
PORT=3001
NODE_ENV=development

# 本地开发 - 使用模拟数据
MONGODB_URI=
DISABLE_DATABASE=true

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://localhost:5173

# 其他配置
API_PREFIX=/api
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 网络问题解决后的测试步骤

1. 更新 `.env` 文件为情况1的配置
2. 运行测试：`node test-atlas-connection.js`
3. 如果成功，启动项目：`npm run dev`

## 生产部署配置

部署到服务器时，使用Atlas连接字符串：
```
MONGODB_URI=mongodb+srv://tianyishenshu:2eXpxM8W3LXFbrX@cluster0.bvzohtw.mongodb.net/tianyishenshu?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
``` 