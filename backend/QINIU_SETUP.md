# 七牛云存储 - 照片上传存储方案

## 📌 七牛云免费额度

### 新用户（前3个月）
- ⭐ 存储空间：**10GB**
- ⭐ 流量：**10GB**
- ⭐ HTTP请求：**100万次**
- ⭐ CDN流量：**10GB**（部分地区）

### 标准免费额度（长期）
- ⭐ 存储空间：**1GB**
- ⭐ 流量：**1GB**
- ⭐ HTTP请求：**10万次**

> 💡 **提示**：个人使用照片上传，标准免费额度已足够！

## 🚀 快速开始

### 第一步：注册七牛云

1. 访问七牛云官网：https://www.qiniu.com/
2. 点击"免费注册"
3. 完成实名认证（需要身份证）

### 第二步：创建存储空间

1. 登录控制台：https://portal.qiniu.com/
2. 进入"对象存储" → "+新建存储空间"
3. 配置存储空间：
   ```
   存储空间名称：cherry-blossom-photos（自定义，全球唯一）
   存储区域：华东（推荐）或选择离你最近的
   访问控制：公开空间
   ```

4. 创建成功后，记录以下信息：
   - 存储空间名称（Bucket Name）
   - 域名（在域名管理中查看）

### 第三步：获取密钥

1. 进入"个人中心" → "密钥管理"
2. 复制以下信息：
   - AK (AccessKey)
   - SK (SecretKey)

### 第四步：配置环境变量

**方式1：本地开发**

在 `backend` 目录下创建 `.env` 文件：

```env
QINIU_ACCESS_KEY=你的AK
QINIU_SECRET_KEY=你的SK
QINIU_BUCKET=你的存储空间名称
QINIU_DOMAIN=https://你的域名
QINIU_ZONE=z0
```

**方式2：部署到云函数（CloudBase/Render）**

在环境变量中添加：
- `QINIU_ACCESS_KEY`
- `QINIU_SECRET_KEY`
- `QINIU_BUCKET`
- `QINIU_DOMAIN`
- `QINIU_ZONE`

### 第五步：测试

启动后端服务：
```bash
cd backend
npm install
npm start
```

测试上传接口：
```bash
curl -X POST http://localhost:3001/api/upload/photo \
  -H "Content-Type: image/jpeg" \
  --data-binary @your-image.jpg
```

## 📊 七牛云区域说明

| 区域代码 | 区域名称 | 上传地址 |
|---------|---------|---------|
| z0 | 华东 | upload-z0.qiniup.com |
| z1 | 华北 | upload-z1.qiniup.com |
| z2 | 华南 | upload-z2.qiniup.com |
| na0 | 北美 | upload-na0.qiniup.com |
| as0 | 东南亚 | upload-as0.qiniup.com |

**推荐使用华东（z0）**，访问速度平衡且稳定性好。

## 🔌 API 接口说明

### 1. 获取上传Token

```http
GET /api/upload/token
```

**响应：**
```json
{
  "success": true,
  "data": {
    "token": "xxxxxx",
    "bucket": "cherry-blossom-photos",
    "domain": "https://xxx.clouddn.com",
    "uploadUrl": "https://upload-z0.qiniup.com"
  }
}
```

### 2. 上传照片

```http
POST /api/upload/photo
Content-Type: image/jpeg

<binary file>
```

**响应：**
```json
{
  "success": true,
  "data": {
    "url": "https://xxx.clouddn.com/photos/xxx.jpg",
    "key": "photos/xxx.jpg",
    "size": 102400,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "hash": "xxxxx",
    "provider": "qiniu"
  }
}
```

### 3. 上传Base64图片

```http
POST /api/upload/base64
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,xxxxx",
  "filename": "photo.jpg"
}
```

### 4. 删除文件

```http
DELETE /api/upload/photos/xxx.jpg
```

### 5. 获取配置状态

```http
GET /api/upload/config
```

## 🎯 前端集成

### 使用fetch上传

```javascript
async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://your-api-url/api/upload/photo', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  if (result.success) {
    console.log('上传成功:', result.data.url);
    return result.data.url;
  } else {
    console.error('上传失败:', result.message);
  }
}
```

### 使用Base64上传

```javascript
async function uploadPhotoBase64(base64Data) {
  const response = await fetch('http://your-api-url/api/upload/base64', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: base64Data,
      filename: `photo-${Date.now()}.jpg`
    })
  });

  const result = await response.json();
  return result.data.url;
}
```

## 💰 成本估算

### 照片存储成本

假设每月上传500张照片，平均每张2MB：

- **存储空间**：500 × 2MB = 1GB/月
- **下载流量**：100次浏览 × 500张 × 2MB = 100GB/月

### 费用标准（超出免费额度后）

| 项目 | 价格 |
|------|------|
| 存储 | ¥0.29/GB/天 |
| 外网下行流量 | ¥0.26/GB |
| HTTP请求 | ¥0.01元/万次 |

### 实际估算

中等使用强度：
- 存储：1GB - **免费1GB覆盖**
- 流量：10GB - **免费10GB覆盖**
- 请求：5万次 - **免费10万次**

**结论：个人使用完全可以免费！** 🎉

## 🔧 图片处理

七牛云支持强大的图片处理功能：

### 缩略图

```
原URL: https://xxx.clouddn.com/photos/xxx.jpg
缩略图: https://xxx.clouddn.com/photos/xxx.jpg?imageView2/2/w/200/h/200
```

### 质量压缩

```
https://xxx.clouddn.com/photos/xxx.jpg?imageView2/2/w/800/quality/75
```

### 格式转换

```
https://xxx.clouddn.com/photos/xxx.jpg?imageView2/2/format/png
```

### 圆角和水印

七牛云还支持圆角、水印等高级功能，参考官方文档。

## ⚠️ 注意事项

### 安全性

1. **不要在前端暴露密钥**：AK/SK只能配置在后端
2. **使用上传Token**：前端通过API获取Token，不要直接使用AK/SK
3. **文件类型校验**：后端校验文件类型，防止恶意上传

### 性能优化

1. **启用CDN**：七牛云自带CDN，自动加速
2. **图片压缩**：上传前或上传后压缩图片
3. **使用缩略图**：列表页显示缩略图，详情页显示原图

### 最佳实践

1. **合理命名文件**：建议使用时间戳+随机数，避免冲突
2. **按类型分类**：照片、音频分开存储目录
3. **定期清理**：定期删除不需要的文件，节省存储

## 🆘 故障排查

### 问题1：上传失败，提示Token无效

**解决方案：**
- 检查AK/SK是否正确
- 确认存储空间名称无误
- 检查Token是否过期（默认1小时）

### 问题2：上传成功但文件无法访问

**解决方案：**
- 检查存储空间访问权限（应为"公开"）
- 检查域名配置是否正确
- 确认域名已备案（使用自定义域名需要）
- 检查域名是否已绑定到存储空间

### 问题3：无法删除文件

**解决方案：**
- 确认文件key正确
- 检查AK权限是否包含删除权限
- 查看七牛云日志

### 问题4：超出免费额度

**解决方案：**
- 定期清理不用的文件
- 启用图片压缩减少流量
- 考虑升级套餐（¥10/月起）

## 📚 更多资源

- 七牛云官网：https://www.qiniu.com/
- 开发者文档：https://developer.qiniu.com/
- SDK文档：https://developer.qiniu.com/sdk#official-sdk
- 存储价格：https://developer.qiniu.com/qcdn/price/price

---

🌸 使用七牛云存储照片，稳定可靠，个人使用完全免费！
