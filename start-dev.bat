@echo off
echo =======================================
echo     天乙神数 - 启动开发环境
echo =======================================
echo.

echo 检查依赖包...
if not exist "node_modules" (
    echo 安装根目录依赖...
    npm install
)

if not exist "frontend\node_modules" (
    echo 安装前端依赖...
    cd frontend
    npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo 安装后端依赖...
    cd backend
    npm install
    cd ..
)

echo.
echo 创建环境配置文件...
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo 已创建 backend\.env 文件
)

echo.
echo =======================================
echo        启动开发服务器
echo =======================================
echo.
echo 后端服务器: http://localhost:3001
echo 前端应用: http://localhost:5173
echo.
echo 按 Ctrl+C 停止所有服务
echo.

start "后端服务器" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "前端服务器" cmd /k "cd frontend && npm run dev"

echo 开发服务器启动中...
echo 请等待几秒钟后访问: http://localhost:5173
pause 