# 🌸 樱花树时光机

郑涵予 & 张远欣 的浪漫时光回忆网站

## 🚀 部署到 Railway

### 第一步：推送到 GitHub

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 创建 GitHub 仓库后，执行：
git remote add origin https://github.com/你的用户名/cherry-blossom-memories.git
git branch -M main
git push -u origin main
```

### 第二步：在 Railway 部署

1. 访问 https://railway.app/
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库
4. Railway 会自动检测并部署

### 第三步：配置环境变量（如需要）

在 Railway 项目设置中添加：

```
PORT=3001
NODE_ENV=production
```

### 第四步：获取部署地址

部署完成后，Railway 会提供一个 `.railway.app` 的域名

例如：`https://cherry-blossom-memories.up.railway.app`

---

## 📸 本地运行

```bash
# 安装依赖
npm run install:all

# 启动后端
npm run dev:backend

# 启动前端（新终端）
npm run dev:frontend
```

访问：http://localhost:3000
