#!/bin/bash
# 快速配置七牛云的脚本

echo "=== 樱花树时光机 - 七牛云配置助手 ==="
echo ""
echo "🌸 欢迎使用七牛云免费存储！"
echo "💰 免费额度：1GB存储 + 1GB流量 + 10万次请求"
echo ""

# 检查是否有.env文件
if [ -f .env ]; then
    echo "✅ 找到 .env 文件"
else
    echo "❓ 未找到 .env 文件，正在创建..."
    cp .qiniu.env.example .env
    echo ""
    echo "❗ 请编辑 .env 文件，填写七牛云配置信息："
    echo "   - QINIU_ACCESS_KEY (AK)"
    echo "   - QINIU_SECRET_KEY (SK)"
    echo "   - QINIU_BUCKET (存储空间名称)"
    echo "   - QINIU_DOMAIN (域名)"
    echo ""
    echo "📝 配置后重新运行此脚本"
    exit 0
fi

# 检查配置是否完整
source .env

if [ -z "$QINIU_ACCESS_KEY" ] || [ -z "$QINIU_SECRET_KEY" ] || [ -z "$QINIU_BUCKET" ] || [ -z "$QINIU_DOMAIN" ]; then
    echo "❌ 七牛云配置不完整，请检查 .env 文件"
    echo ""
    echo "配置说明："
    echo "1. 访问 https://portal.qiniu.com/ 注册并登录"
    echo "2. 创建存储空间（对象存储 → 新建存储空间）"
    echo "3. 获取密钥（个人中心 → 密钥管理）"
    echo "4. 在域名管理中查看域名"
    echo ""
    read -p "按 Enter 退出..."
    exit 1
fi

echo "✅ 七牛云配置完整"
echo ""
echo "配置信息："
echo "  - 存储空间: $QINIU_BUCKET"
echo "  - 域名: $QINIU_DOMAIN"
echo "  - 区域: $QINIU_ZONE"
echo ""

# 安装依赖
echo "🔧 检查依赖..."
if [ ! -d node_modules ]; then
    echo "📦 安装依赖中..."
    npm install
fi

echo "✅ 依赖已安装"
echo ""

# 测试连接
echo "🧪 测试七牛云连接..."
node -e "
import('./src/services/qiniu.js').then(module => {
    const service = module.default;
    service.init();
    console.log('✅ 七牛云连接成功！');
    console.log('✅ 可以开始上传照片了！');
}).catch(err => {
    console.error('❌ 连接失败:', err.message);
    process.exit(1);
});
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 七牛云配置成功！"
    echo ""
    echo "下一步："
    echo "  1. 启动后端服务：npm start"
    echo "  2. 测试上传接口：POST /api/upload/photo"
    echo "  3. 查看详细文档：QINIU_SETUP.md"
else
    echo ""
    echo "❌ 配置验证失败，请检查配置信息"
    read -p "按 Enter 退出..."
    exit 1
fi
