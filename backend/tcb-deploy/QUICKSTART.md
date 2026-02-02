# CloudBase 快速开始

## 5分钟快速部署到腾讯云CloudBase

### 第一步：准备工作（2分钟）

1. 注册并登录腾讯云：https://cloud.tencent.com/
2. 开通CloudBase（免费）：https://console.cloud.tencent.com/tcb
3. 安装CLI工具：
```bash
npm install -g @cloudbase/cli
```

4. 登录：
```bash
tcb login
```

### 第二步：配置环境变量（1分钟）

1. 复制配置文件：
```bash
cd backend/tcb-deploy
cp .env.example .env
```

2. 编辑 `.env` 文件，填写以下信息：
- `ENV_ID`: 在CloudBase控制台创建环境后复制
- `SECRET_ID` 和 `SECRET_KEY`: 在API密钥管理中获取
- `MONGODB_URI`: 数据库连接字符串

### 第三步：创建CloudBase环境（1分钟）

在CloudBase控制台点击"新建环境"，选择：
- 环境名称：`cherry-blossom-memories`
- 基础版（免费套餐）
- 地域：选择离你最近的

创建后复制环境ID，填写到 `.env` 的 `ENV_ID`

### 第四步：部署（1分钟）

运行部署脚本：

**Windows:**
```cmd
deploy.bat
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

或直接使用命令：
```bash
cd backend/tcb-deploy
tcb functions:deploy --force
```

### 第五步：配置访问

1. 在CloudBase控制台进入"云函数"
2. 点击"访问配置"，复制访问地址，格式如下：
```
https://your-env-id.service.tcloudbase.com
```

3. 更新前端API地址（`single-file-deploy/index.html`）：
```javascript
const API_BASE_URL = 'https://your-env-id.service.tcloudbase.com/api';
```

4. 重新部署前端到Cloudflare Pages

## 完成！🎉

现在访问你的前端页面就可以上传照片了！

## 额外配置

### 开启云存储
1. 在控制台进入"存储" → "云存储"
2. 创建存储桶（如：`photos`）
3. 设置权限为"公有读私有写"

### 添加数据库
- 方式1：使用MongoDB Atlas免费版（推荐）
- 方式2：使用CloudBase云数据库（需要付费）

## 费用说明

### 免费额度（每月）
- 云函数：100万次调用
- 云存储：5GB
- 流量：5GB

### 超出部分
按量付费，参考：https://cloud.tencent.com/product/tcb/pricing

## 需要帮助？

查看完整文档：[README.md](./README.md)
