# 腾讯云 CloudBase 部署指南

## 前置准备

1. 注册腾讯云账号: https://cloud.tencent.com/
2. 开通 CloudBase 服务: https://console.cloud.tencent.com/tcb
3. 安装 Cloudbase CLI
```bash
npm install -g @cloudbase/cli
```

4. 登录 CloudBase
```bash
tcb login
```

## 配置步骤

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并填写以下信息：

```env
TENANT_ID=your_tenant_id          # 腾讯云租户ID
SECRET_ID=your_secret_id          # 访问凭证ID
SECRET_KEY=your_secret_key        # 访问凭证密钥
ENV_ID=your_env_id                # 环境ID
REGION=ap-guangzhou               # 地域（ap-beijing/ap-shanghai/ap-guangzhou等）
```

### 2. 创建云存储空间

在 CloudBase 控制台：
1. 进入"存储" -> "云存储"
2. 创建存储空间：
   - 存储名称：`photos`（用于照片）
   - 存储名称：`audio`（用于音频）
3. 设置访问权限：设置为"私有读写"或"公有读私有写"

### 3. 配置云数据库

推荐使用云数据库或自建MongoDB：

#### 使用 CloudBase 数据库
1. 在控制台创建数据库：`cherry_blossom_memories`
2. 创建集合（Collection）：
   - `photos` - 照片数据
   - `audio` - 音频数据

#### 使用自建 MongoDB
1. 在 `.env` 中配置连接字符串：
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cherry_blossom_memories
```

### 4. 部署云函数

#### 方式一：使用脚本部署（推荐）

**Linux/Mac:**
```bash
cd backend/tcb-deploy
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
cd backend\tcb-deploy
deploy.bat
```

#### 方式二：手动部署

```bash
npm install -g @cloudbase/cli
cd backend/tcb-deploy
tcb functions:deploy --functions ./functions
```

## 部署后配置

### 1. 获取云函数访问地址

1. 登录 CloudBase 控制台
2. 进入"云函数" -> 选择函数 -> "访问配置"
3. 复制 HTTP 访问路径

示例：
```
https://your-env-id.service.tcloudbase.com/main-server
```

### 2. 更新前端配置

修改 `single-file-deploy/index.html` 中的API地址：

```javascript
const API_BASE_URL = 'https://your-env-id.service.tcloudbase.com/api';
```

或在前端构建时修改 `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://your-env-id.service.tcloudbase.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

## 功能说明

### 云函数列表

| 函数名 | 路径 | 功能 |
|--------|------|------|
| main-server | /main-server | 主服务器，处理所有API请求 |
| upload-photo | /upload-photo | 专门处理照片上传 |

### API 接口

**上传照片:**
```http
POST /api/upload
Content-Type: multipart/form-data

file: <binary file>
```

**获取照片列表:**
```http
GET /api/photos
```

**删除照片:**
```http
DELETE /api/photos/:id
```

## 成本估算

CloudBase 免费额度（每月）：
- 云函数调用次数：100万次
- 云函数运行时间：40万GBs
- 云存储容量：5GB
- 云数据库读：5万次
- 云数据库写：3万次

超出额度后按量计费，参考官方价格。

## 常见问题

### 1. 部署失败
- 检查是否正确安装 Cloudbase CLI
- 确认已登录（`tcb login`）
- 检查环境变量配置是否正确

### 2. 云函数执行超时
- 在函数配置中增加超时时间
- 优化函数代码，减少执行时间

### 3. 文件上传失败
- 检查云存储是否正确配置
- 确认文件大小不超过限制（云存储限制20MB）
- 检查存储权限设置

### 4. 数据库连接失败
- 确认 MongoDB 连接字符串正确
- 如果使用云数据库，检查 IP 白名单设置

## 监控与日志

在 CloudBase 控制台可以查看：
- 云函数调用日志
- 云函数执行监控
- 云存储使用情况
- 数据库读写统计

## 安全建议

1. **不要将 `.env` 文件提交到 Git**
2. 使用环境变量管理敏感信息
3. 启用数据库访问控制
4. 定期更新访问密钥

## 技术支持

- CloudBase 文档: https://docs.cloudbase.net/
- 腾讯云工单: https://console.cloud.tencent.com/workorder

---

🌸 樱花树时光机 - 祝您使用愉快！
