# 🌸 樱花树时光机 - 快速部署指南

## 🚀 最快速方案（15分钟完成）

### 第一步：设置 MongoDB（5分钟）

1. 打开 https://www.mongodb.com/cloud/atlas/register
2. 用邮箱注册（免费）
3. 创建免费集群（选择 Free 永久免费）
4. 创建数据库用户：
   - Database Access → Add New Database User
   - Username: `cherry`（或任意）
   - Password: 生成强密码并保存
5. 允许网络访问：
   - Network Access → Add IP Address
   - 选择：`Allow Access from Anywhere` (0.0.0.0/0)
6. 获取连接字符串：
   - 点击 Connect → Drivers
   - 复制连接字符串，格式如：
     ```
     mongodb+srv://cherry:你的密码@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - 修改最后的数据库名为 `cherry-blossom-memories`

### 第二步：部署后端到 Render（5分钟）

1. 打开 https://render.com/register
2. 用 GitHub 账号登录（如果没有请先注册 GitHub）
3. 点击 "New +" → "Web Service"
4. 点击 "Connect GitHub"（需要授权）
5. 选择您的仓库，如果没有先创建：
   - 在 GitHub 创建新仓库 `cherry-blossom-memories`
   - 在本地项目目录运行：
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/你的用户名/cherry-blossom-memories.git
     git push -u origin main
     ```
6. 配置 Render：
   - **Name**: `cherry-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
7. 环境变量（点击 "Advanced" → "Add Environment Variable"）：
   ```
   MONGODB_URI=mongodb+srv://cherry:你的密码@cluster0.xxxxx.mongodb.net/cherry-blossom-memories
   PORT=3001
   NODE_ENV=production
   ```
8. 点击 "Deploy Web Service"
9. 等待约3分钟，复制后端 URL（如：`https://cherry-backend.onrender.com`）

### 第三步：部署前端到 Vercel（5分钟）

1. 打开 https://vercel.com/signup
2. 用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 导入您的 GitHub 仓库（和后端同一个仓库）
5. 配置：
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 环境变量：
   - 名称：`VITE_API_URL`
   - 值：你的后端 URL（如：`https://cherry-backend.onrender.com`）
7. 点击 "Deploy"
8. 等待约1分钟，获得前端 URL（如：`https://cherry-blossom-memories.vercel.app`）

---

## 📱 完成！现在您可以：

1. **从手机访问**：打开手机浏览器，输入前端 URL
2. **输入密码**：`zhangyuanxin317`
3. **开始使用**：上传照片、音乐，查看回忆

---

## ⚙️ 部署后需要修改的

### 1. 修改前端 API 地址

部署后，如果前端无法连接后端：

1. 进入 Vercel 项目
2. Settings → Environment Variables
3. 修改 `VITE_API_URL` 为正确的后端地址
4. 重新部署

### 2. 检查后端状态

访问：`https://你的后端URL/health`

应该看到：
```json
{
  "success": true,
  "message": "樱花树时光机 API 运行中",
  "database": {
    "status": "connected"
  }
}
```

---

## 💰 费用说明

- **MongoDB Atlas**: 免费（500MB存储）
- **Render**: 免费（750小时/月，足够个人使用）
- **Vercel**: 免费（100GB带宽/月）

**总计：完全免费！**

---

## 🐛 常见问题

### Q: 后端部署失败怎么办？
A: 检查 `package.json` 中的依赖是否完整，确保没有本地文件路径的引用

### Q: 前端显示 "Network Error"？
A: 检查 Vercel 环境变量中的 `VITE_API_URL` 是否正确，需要包含 `https://`

### Q: 上传文件失败？
A: Render 免费版有超时限制，大文件上传可能失败。建议：
- 图片压缩到 5MB 以下
- 音频压缩到 10MB 以下

### Q: 数据库连接失败？
A: 检查 MongoDB Atlas 的网络访问设置，确保添加了 `0.0.0.0/0`

---

## 📞 需要帮助？

查看详细文档：`DEPLOYMENT.md`

---

**部署完成后，您就拥有了一个可以在任何设备（手机、电脑、平板）访问的私人回忆网站！** 🌸💕
