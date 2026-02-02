#!/bin/bash

echo "========================================"
echo "  樱花树时光机 - EdgeOne 部署打包脚本"
echo "========================================"
echo ""

echo "[1/3] 清理旧构建..."
rm -rf frontend/dist

echo "[2/3] 构建项目..."
cd frontend
npm install
npm run build
cd ..

echo "[3/3] 打包部署文件..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZIPFILE="edgeone-deploy-${TIMESTAMP}.zip"

cd frontend/dist
zip -r ../../${ZIPFILE} .
cd ../..

echo ""
echo "========================================"
echo "  打包完成！"
echo "========================================"
echo ""
echo "部署包: ${ZIPFILE}"
echo ""
echo "下一步："
echo "1. 登录 EdgeOne 控制台: https://console.cloud.tencent.com/edgeone"
echo "2. 创建或选择站点"
echo "3. 上传 ${ZIPFILE}"
echo ""
echo "或参考 DEPLOY_EDGEONE.md 获取详细说明"
echo ""
