# MongoDB Atlas 设置指南

## 1. 注册MongoDB Atlas账号
- 访问：https://www.mongodb.com/atlas
- 点击 "Try Free"
- 使用邮箱注册账号

## 2. 创建免费集群
- 选择 "Shared" (免费版)
- 选择云服务商：AWS
- 选择区域：推荐选择距离较近的区域
- 集群名称：可以使用默认的 "Cluster0"
- 点击 "Create Cluster"

## 3. 配置数据库访问
- 创建数据库用户：
  - Username: tianyishenshu
  - Password: 设置一个强密码（请记住）
- 添加IP地址到白名单：
  - 点击 "Add IP Address"
  - 选择 "Add My Current IP Address"
  - 或添加 0.0.0.0/0 (允许所有IP，仅用于开发)

## 4. 获取连接字符串
- 点击 "Connect"
- 选择 "Connect your application"
- 选择 Driver: Node.js
- 复制连接字符串，格式如：
  mongodb+srv://tianyishenshu:<password>@cluster0.xxxxx.mongodb.net/tianyishenshu

## 5. 更新环境变量
在 backend/.env 文件中更新：
MONGODB_URI=mongodb+srv://tianyishenshu:<password>@cluster0.xxxxx.mongodb.net/tianyishenshu 