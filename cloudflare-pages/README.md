# Cloudflare Pages 部署说明 (无Functions版本)

## 部署方式：直接上传

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages > Pages
3. 点击 "Upload assets"
4. 选择此 `cloudflare-pages` 文件夹
5. 点击 "Deploy"

## 自定义域名绑定

1. 部署完成后，进入Pages项目设置
2. 点击 "Custom domains" > "Set up a custom domain"
3. 输入你的域名（如：zyxzhy317.dpdns.org）
4. Cloudflare会自动配置DNS记录

## 注意事项

⚠️ **重要提示**：
- 此版本为纯静态版本，不包含后端API功能
- 需要单独部署后端服务到支持Node.js的平台（如Railway、Render等）
- 前端需要修改API地址为实际的后端URL

## 后端部署推荐平台

- **Railway**: railway.app（推荐，简单易用）
- **Render**: render.com
- **Vercel**: vercel.com（Serverless Functions）
- **自建服务器**: VPS + PM2

## 修改前端API地址

在部署前，需要确保前端代码中的API地址正确配置：
```javascript
// 修改为你的后端实际地址
const API_URL = 'https://your-backend-url.com';
```

## 部署后测试

1. 等待DNS生效（通常几分钟到24小时）
2. 访问：https://你的域名
3. 检查浏览器控制台是否有API请求错误

## 静态特性

- ✅ 完整SPA支持
- ✅ 所有路由重定向至index.html
- ✅ 静态资源缓存优化
- ✅ 响应头安全配置
- ❌ 无后端API代理功能
