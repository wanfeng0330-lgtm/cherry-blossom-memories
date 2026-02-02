# Vercel部署说明

## 部署步骤

1. 登录Vercel.com
2. 点击"Add New Project"
3. 将此文件夹上传到Vercel项目目录
4. 或通过Git连接到GitHub仓库，选择`vercel-deploy`文件夹作为部署根目录

## 配置说明

- 构建命令：无需构建（已预构建）
- 输出目录：`.`
- 框架预设：Other

## 注意事项

- 此版本包含最新构建的前端文件
- 所有静态资源已包含在assets目录中
- 已移除对不存在的sakura.svg引用

## 部署后

- 后端API需要单独部署（如Render、Railway、Vercel Serverless等）
- 需要更新API地址为实际部署后的URL
