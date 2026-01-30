# 部署到腾讯云 EdgeOne 指南

## 前置准备

1. 已有腾讯云账号
2. 已开通 EdgeOne 服务
3. 构建好的静态文件（frontend/dist 目录）

## 方式一：通过控制台上传（最简单）

### 步骤 1：创建 EdgeOne 站点

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 点击「站点列表」→「添加站点」
3. 选择「静态网站」类型
4. 填写站点信息：
   - 站点名称：`cherry-blossom-memories`
   - 加速区域：选择「中国大陆」或「全球」

### 步骤 2：上传文件

1. 进入站点详情
2. 找到「静态网站托管」→「文件管理」
3. 将 `frontend/dist` 目录下的所有文件上传：
   ```
   frontend/dist/
   ├── index.html
   └── assets/
       ├── index-xxx.css
       └── index-xxx.js
   ```

### 步骤 3：配置路由规则

在「规则配置」→「路由规则」中添加：

```json
[
  {
    "条件": "请求路径文件后缀为空",
    "动作": "重定向到 /index.html"
  }
]
```

### 步骤 4：绑定域名（可选）

1. 在站点中找到「域名管理」
2. 添加你的域名（如 `love.yourdomain.com`）
3. 按照提示配置 DNS 解析

---

## 方式二：使用 COS + EdgeOne（推荐用于生产环境）

### 步骤 1：创建 COS 存储桶

1. 访问 [对象存储控制台](https://console.cloud.tencent.com/cos)
2. 创建存储桶：
   - 名称：`cherry-blossom-memories`
   - 地域：选择靠近用户的地区
   - 访问权限：**公共读**

### 步骤 2：上传文件到 COS

**方法 A：通过控制台上传**
1. 进入存储桶 →「文件列表」
2. 上传 `frontend/dist` 下的所有文件

**方法 B：使用 COSCMD 命令行工具**

```bash
# 安装 COSCMD
pip install coscmd

# 配置（获取密钥：https://console.cloud.tencent.com/cam/capi）
coscmd config -a <SecretId> -s <SecretKey> -b cherry-blossom-memories -r ap-beijing

# 上传文件
cd frontend/dist
coscmd upload -r ./ / --sync
```

### 步骤 3：配置静态网站

1. 在存储桶中找到「基础配置」
2. 开启「静态网站托管」
3. 索引文档：`index.html`
4. 错误文档：`index.html`

### 步骤 4：接入 EdgeOne 加速

1. 在 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)添加站点
2. 源站类型选择「对象存储」
3. 选择刚创建的 COS 存储桶
4. 配置加速域名

---

## 方式三：使用 EdgeOne CLI（自动化部署）

```bash
# 安装 EdgeOne CLI（如果提供）
npm install -g @tencent-cloud/edgeone-cli

# 登录
edgeone login

# 部署
cd cherry-blossom-memories
edgeone deploy --config edgeone-config.json
```

---

## 构建命令

如果需要重新构建：

```bash
cd frontend
npm install
npm run build
```

构建产物在 `frontend/dist` 目录。

---

## 验证部署

部署完成后，访问你的 EdgeOne 域名，应该能看到：
- 🌸 樱花飘落的动画效果
- 💕 郑涵予 & 张远欣的名字
- 📷 照片以心形排列
- 🔐 密码保护功能（默认密码：5201314）

---

## 注意事项

1. **密码配置**：如需修改密码，编辑 `frontend/src/components/UI/PasswordProtection.jsx`
2. **照片管理**：照片数据在 `frontend/src/data/photos.js`
3. **HTTPS**：EdgeOne 自动提供 HTTPS 证书
4. **缓存**：静态资源已配置长期缓存（1年）

---

## 域名配置说明

如果使用自定义域名，需要在域名 DNS 处添加 CNAME 记录：

```
记录类型：CNAME
主机记录：@ 或 www
记录值：EdgeOne 提供的加速域名
```

---

## 成本参考

- **EdgeOne**：按流量计费，有免费额度
- **COS 存储**：按存储量和流量计费，有免费额度
- **总计**：小型网站每月约 ¥10-50（取决于访问量）

---

## 常见问题

**Q: 如何更新网站？**
A: 重新构建后，重新上传 `dist` 目录下的文件。

**Q: 如何修改密码？**
A: 编辑 `frontend/src/components/UI/PasswordProtection.jsx`，找到 `CORRECT_PASSWORD` 常量修改。

**Q: 照片显示不出来？**
A: 检查照片 URL 是否正确，确保 COS 存储桶设置了公共读权限。
