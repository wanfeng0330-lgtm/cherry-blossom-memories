@echo off
chcp 65001 >nul
echo === 樱花树时光机 - 七牛云配置助手 ===
echo.
echo 🌸 欢迎使用七牛云免费存储！
echo 💰 免费额度：1GB存储 + 1GB流量 + 10万次请求
echo.

REM 检查是否有.env文件
if exist .env (
    echo ✅ 找到 .env 文件
) else (
    echo ❓ 未找到 .env 文件，正在创建...
    copy .qiniu.env.example .env
    echo.
    echo ❗ 请编辑 .env 文件，填写七牛云配置信息：
    echo    - QINIU_ACCESS_KEY (AK)
    echo    - QINIU_SECRET_KEY (SK)
    echo    - QINIU_BUCKET (存储空间名称)
    echo    - QINIU_DOMAIN (域名)
    echo.
    echo 📝 配置后重新运行此脚本
    pause
    exit /b 0
)

REM 检查配置是否完整
node -e "require('dotenv').config(); const { QINIU_ACCESS_KEY, QINIU_SECRET_KEY, QINIU_BUCKET, QINIU_DOMAIN } = process.env; if (!QINIU_ACCESS_KEY || !QINIU_SECRET_KEY || !QINIU_BUCKET || !QINIU_DOMAIN) { process.exit(1); }"

if %errorlevel% neq 0 (
    echo ❌ 七牛云配置不完整，请检查 .env 文件
    echo.
    echo 配置说明：
    echo 1. 访问 https://portal.qiniu.com/ 注册并登录
    echo 2. 创建存储空间（对象存储 → 新建存储空间）
    echo 3. 获取密钥（个人中心 → 密钥管理）
    echo 4. 在域名管理中查看域名
    echo.
    pause
    exit /b 1
)

echo ✅ 七牛云配置完整
echo.

REM 安装依赖
echo 🔧 检查依赖...
if not exist node_modules (
    echo 📦 安装依赖中...
    call npm install
)

echo ✅ 依赖已安装
echo.

REM 提示
echo 🎉 七牛云文件已配置！
echo.
echo 下一步：
echo   1. 启动后端服务：npm start
echo   2. 测试上传接口：POST /api/upload/photo
echo   3. 查看详细文档：QINIU_SETUP.md
echo.
pause
