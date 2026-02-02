const cloud = require('wx-server-sdk');
const express = require('express');
const serverless = require('serverless-http');

// 初始化CloudBase
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 创建Express应用
const app = express();

// 中间件
app.use(cloud.express());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 导入路由
import photosRouter from '../routes/photos.js';
import uploadRouter from '../routes/upload.js';
import audioRouter from '../routes/audio.js';

// 使用路由
app.use('/api/photos', photosRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/audio', audioRouter);

// 健康检查
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '樱花树时光机 API 运行中',
    timestamp: new Date().toISOString(),
    env: cloud.getEnvId()
  });
});

// 导出云函数
exports.main = serverless(app);
