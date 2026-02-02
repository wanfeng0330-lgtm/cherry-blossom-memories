# 只包含HTML、CSS、JS的纯静态版本

## 文件列表
- `index.html` - 主页面
- `style.css` - 样式文件
- `app.js` - JavaScript文件

## 部署方式

直接上传这三个文件到任何静态托管服务：

### Cloudflare Pages
1. 登录 https://dash.cloudflare.com/
2. Workers & Pages → Create application → Upload assets
3. 上传此文件夹

### Vercel
- 拖拽此文件夹到 https://vercel.com/new

### Netlify
- 拖拽此文件夹到 https://app.netlify.com/drop

### 其他平台
- GitHub Pages
- 腾讯云COS
- 阿里云OSS
- 任何Web服务器

## 注意事项
⚠️ 此为前端静态文件，需要单独部署后端API
