# 七牛云快速开始 - 5分钟配置免费存储

## 🎯 为什么选择七牛云？

✅ **永久免费额度**：1GB存储 + 1GB流量（照片上传够用！）
✅ **国内访问快**：CDN遍布全国
✅ **稳定可靠**：十年技术积累
✅ **易于配置**：只需要4个配置项

## ⚡ 快速配置（3步）

### 第一步：注册七牛云

1. 访问：https://www.qiniu.com/ （免费注册）
2. 完成实名认证（需要身份证）

### 第二步：创建存储空间

1. 登录控制台：https://portal.qiniu.com/
2. 点击"对象存储" → "新建存储空间"
3. 填写配置：
   ```
   存储空间名称：cherry-blossom-photos（必须唯一）
   存储区域：华东（推荐）
   访问控制：公开空间
   ```
4. 点击"创建"

### 第三步：获取配置信息

**获取密钥：**
1. 点击右上角头像 → "密钥管理"
2. 复制：
   - AK (AccessKey)
   - SK (SecretKey)

**获取域名：**
1. 进入"对象存储" → 选择刚创建的空间
2. 查看默认域名（如：xxx.clouddn.com）

**复制配置到后端：**
```bash
cd backend
cp .qiniu.env.example .env
```

编辑 `.env` 文件，填写：
```env
QINIU_ACCESS_KEY=你的AK
QINIU_SECRET_KEY=你的SK
QINIU_BUCKET=cherry-blossom-photos
QINIU_DOMAIN=https://xxx.clouddn.com
QINIU_ZONE=z0
```

### 第四步：启动测试

```bash
# Windows
setup-qiniu.bat

# Mac/Linux
chmod +x setup-qiniu.sh
./setup-qiniu.sh
```

然后启动后端：
```bash
npm start
```

## 📊 免费额度详情

| 项目 | 免费额度 | 足够用吗？ |
|------|---------|----------|
| 存储 | 1GB | ✅ 够（约500张照片） |
| 流量 | 1GB | ✅ 够（约5000次浏览） |
| HTTP请求 | 10万次 | ✅ 够（约3000天） |

## 🔌 使用示例

### 后端已集成七牛云

后端API接口已内置七牛云支持：

**上传照片：**
```bash
curl -X POST http://localhost:3001/api/upload/photo \
  -H "Content-Type: image/jpeg" \
  --data-binary @photo.jpg
```

**上传Base64：**
```bash
curl -X POST http://localhost:3001/api/upload/base64 \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'
```

### 前端集成示例

```javascript
// 方式1：直接上传文件
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload/photo', {
    method: 'POST',
    body: formData
  });

  const result = await res.json();
  console.log('上传成功:', result.data.url);
}

// 方式2：上传Base64
async function uploadBase64(base64) {
  const res = await fetch('/api/upload/base64', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64,
      filename: `photo-${Date.now()}.jpg`
    })
  });

  const result = await res.json();
  console.log('上传成功:', result.data.url);
}
```

## 📸 图片处理支持

七牛云支持强大的图片处理：

**缩略图：**
```
原图：https://xxx.clouddn.com/photos/xxx.jpg
缩略：https://xxx.clouddn.com/photos/xxx.jpg?imageView2/2/w/200/h/200
```

**压缩：**
```
https://xxx.clouddn.com/photos/xxx.jpg?imageView2/2/w/800/quality/75
```

**格式转换：**
```
https://xxx.clouddn.com/photos/xxx.jpg?format/png
```

## 💰 超出额度怎么办？

如果超出免费额度，费用非常低：

| 项目 | 价格估算 |
|------|---------|
| 存储空间 | ¥0.29/GB/天（约¥9/月） |
| 流量 | ¥0.26/GB（约¥26/100GB） |
| 请求 | ¥0.01/万次（约¥10/月） |

对于个人使用，基本不需要付费。

## ⚠️ 常见问题

### Q1: 为什么选择七牛云而不是CloudBase云存储？

**A:** 七牛云免费额度更大（1GB vs 5GB但需要开通），且专注于对象存储，更稳定。

### Q2: 照片能永久保存吗？

**A:** 可以，只要不删除，照片会一直保存。如果持续免费使用，建议：
- 定期备份重要照片到本地
- 定期清理不需要的照片
- 考虑使用对象存储的生命周期规则

### Q3: 域名需要备案吗？

**A:** 使用默认域名（xxx.clouddn.com）不需要备案。使用自定义域名需要备案。

### Q4: 上传速度慢怎么办？

**A:**
- 选择存储空间时，选择离你最近的区域
- 七牛云自带CDN，会自动加速
- 上传前压缩图片，减小文件大小

### Q5: 如何查看存储使用情况？

**A:** 登录七牛云控制台 → 对象存储 → 选择空间 → 概览

## 📚 更多文档

- **七牛云详细文档**：`backend/QINIU_SETUP.md`
- **官方文档**：https://developer.qiniu.com/
- **价格说明**：https://developer.qiniu.com/qcdn/price/price

## 🎯 下一步

1. 配置七牛云（完成本指南前三步）
2. 部署后端到任意平台（Render/CloudBase/VPS）
3. 部署前端到 Cloudflare Pages
4. 更新前端API地址，开始上传照片！

---

🌸 配置七牛云，照片存储稳定可靠，个人使用完全免费！
