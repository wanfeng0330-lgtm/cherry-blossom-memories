# 樱花树时光机 - 部署指南

本指南将帮助您将樱花树时光机部署到公网，以便从手机和任何设备访问。

## 📱 部署方式选择

由于这是一个全栈应用（前端+后端），我们需要分别部署：

### 方案 A：免费部署（推荐新手）

**前端：** Vercel
**后端：** Render（免费tier）
**数据库：** MongoDB Atlas（免费500MB）

### 方案 B：国内访问优化（国内速度快）

**前端：** Gitee Pages
**后端：** 腾讯云/阿里云轻量应用服务器

---

## 🚀 方案 A：免费部署步骤

### 步骤 1：设置 MongoDB 数据库

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. 注册账号（免费）
3. 创建新集群（选择 Free 永久免费）
4. 在 Database Access 中创建数据库用户
5. 在 Network Access 中添加 IP `0.0.0.0/0`（允许所有IP访问）
6. 点击 Connect → 获取连接字符串，格式如：
   ```
   mongodb+srv://username:password@cluster.mongodb.net/cherry-blossom-memories
   ```

### 步骤 2：部署后端到 Render

1. 访问 [Render](https://render.com/register)
2. 使用 GitHub 账号登录
3. 点击 "New +" → "Web Service"
4. 连接您的 GitHub 仓库（需要先推送到 GitHub）
5. 配置：
   - **Name**: `cherry-blossom-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
6. 环境变量（Environment Variables）：
   ```
   MONGODB_URI=您的MongoDB连接字符串
   PORT=3001
   NODE_ENV=production
   ```
7. 点击 "Deploy Web Service"
8. 等待部署完成，获取后端 URL（如：`https://cherry-blossom-backend.onrender.com`）

### 步骤 3：部署前端到 Vercel

**方式 1：通过 Vercel 网页界面（推荐，无需命令行）**

1. 访问 [Vercel](https://vercel.com/signup)
2. 使用 GitHub 账号登录
3. 点击 "Add New..." → "Project"
4. 导入您的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 环境变量：
   ```
   VITE_API_URL=https://您的后端地址（如：https://cherry-blossom-backend.onrender.com）
   ```
7. 点击 "Deploy"
8. 等待部署完成，获得前端 URL（如：`https://cherry-blossom-memories.vercel.app`）

**方式 2：通过拖拽部署（最简单）**

1. 在 frontend 目录运行：
   ```bash
   npm run build
   ```
2. 将生成的 `dist` 文件夹压缩为 zip
3. 访问 [Netlify Drop](https://app.netlify.com/drop)
4. 将 zip 文件拖拽到页面
5. 部署完成后获得 URL

---

## 🇨🇳 方案 B：国内部署（Gitee + 轻量服务器）

### 步骤 1：准备代码

将代码推送到 Gitee：
```bash
# 在 Gitee 创建新仓库后
git remote add gitee https://gitee.com/您的用户名/cherry-blossom-memories.git
git push gitee main
```

### 步骤 2：部署前端到 Gitee Pages

1. 访问 Gitee 仓库
2. 点击 "服务" → "Gitee Pages"
3. 选择分支：`main` / `frontend/dist`（需要先本地构建）
4. 启动服务

### 步骤 3：购买轻量服务器（可选）

- 腾讯云轻量应用服务器：约 50元/年
- 阿里云轻量应用服务器：约 60元/年

---

## 📝 部署前检查清单

### 后端检查

- [ ] MongoDB 连接字符串正确
- [ ] 端口设置正确（Render 会自动设置 PORT 环境变量）
- [ ] `package.json` 中的 start 脚本正确
- [ ] 所有依赖都已在 `package.json` 中

### 前端检查

- [ ] API 地址正确设置为生产环境地址
- [ ] `.env.production` 文件已配置
- [ ] 构建命令 `npm run build` 可成功执行
- [ ] 所有 API 调用都使用相对路径或环境变量

---

## 🔧 常见问题

### 问题 1：后端部署后 API 调用失败

检查：
- CORS 配置是否允许前端域名
- MongoDB 连接是否成功
- 环境变量是否正确设置

### 问题 2：前端无法访问后端

解决：
- 确保前端环境变量 `VITE_API_URL` 指向正确的后端地址
- 检查后端是否已成功部署并运行

### 问题 3：上传文件失败

可能原因：
- 文件太大（当前限制 20MB）
- 后端存储空间不足
- 网络超时

---

## 🎯 快速开始（推荐方案）

如果您想快速部署，建议使用以下组合：

1. **MongoDB Atlas** - 免费500MB
2. **Render** - 后端免费托管
3. **Vercel** - 前端免费托管 + 全球CDN

这个组合完全免费，且从国内访问速度可接受。

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. 后端日志（Render Dashboard）
2. 前端控制台错误（浏览器 F12）
3. MongoDB 连接状态（MongoDB Atlas Dashboard）

---

## ⚠️ 重要提示

**密码安全**：当前密码 "zhangyuanxin317" 硬编码在前端代码中，任何人查看源代码都能看到。如果需要真正的安全性，建议：
- 在后端实现密码验证
- 使用会话管理
- 添加 HTTPS（部署平台自动提供）

---

部署完成后，您就可以从手机浏览器访问您的网站了！🌸
