#!/bin/bash
# CloudBase 部署脚本

echo "=== 樱花树时光机 - CloudBase 部署 ==="
echo ""

# 检查是否安装了Cloudbase CLI
if ! command -v tcb &> /dev/null; then
    echo "❌ Cloudbase CLI 未安装"
    echo "请先安装: npm install -g @cloudbase/cli"
    exit 1
fi

echo "✅ Cloudbase CLI 已安装"
echo ""

# 检查是否已登录
echo "检查登录状态..."
if ! tcb login list &> /dev/null; then
    echo "⚠️  未登录，请先登录:"
    echo "  tcb login"
    exit 1
fi

echo "✅ 已登录"
echo ""

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，正在创建..."
    cp .env.example .env
    echo "❗ 请编辑 .env 文件，填写您的 CloudBase 配置信息"
    exit 1
fi

echo "✅ 环境变量配置文件存在"
echo ""

# 部署到CloudBase
echo "开始部署到 CloudBase..."
echo ""

tcb functions:deploy --functions ./functions --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "访问地址:"
    echo "  - 登录腾讯云 CloudBase 控制台查看云函数访问地址"
    echo ""
    echo "下一步:"
    echo "  1. 在CloudBase控制台配置云存储"
    echo "  2. 配置云数据库（MongoDB）"
    echo "  3. 更新前端API地址"
else
    echo ""
    echo "❌ 部署失败"
    exit 1
fi
