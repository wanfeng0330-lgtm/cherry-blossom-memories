# Cloudflare Pages 部署说明

## 部署方式一：直接上传

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 项目
3. 点击 "Upload assets"
4. 选择此 `cloudflare-pages` 文件夹
5. 点击 "Deploy"

## 部署方式二：通过Git仓库

1. 将此文件夹推送到GitHub/GitLab仓库
2. 在Cloudflare Pages中连接仓库
3. 配置：
   - 构建命令：留空或 `echo 'No build'`
   - 输出目录：`cloudflare-pages`

## 环境变量配置

在Cloudflare Pages设置中添加以下环境变量：

```
BACKEND_URL=https://your-backend-api-url.com
```

## 注意事项

1. **后端API部署**：此版本仅包含前端，需要单独部署后端服务
2. **API配置**：请将 `BACKEND_URL` 替换为实际的后端API地址
3. **静态资源**：所有资源已预构建，无需额外构建步骤

## Functions 配置

- `_functions` 目录包含API代理函数
- 可根据需要修改或扩展

## 推荐的后端部署平台

- Cloudflare Workers + D1
- Railway
- Render
- Vercel Serverless
