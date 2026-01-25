import express from 'express';
import dotenv from 'dotenv';
import cors from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import photosRouter from './routes/photos.js';
import uploadRouter from './routes/upload.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== 中间件 ====================
app.use(cors);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==================== 路由 ====================

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '樱花树时光机 API 运行中',
    timestamp: new Date().toISOString(),
    mode: 'in-memory (demo mode)'
  });
});

// API路由
app.use('/api/photos', photosRouter);
app.use('/api/upload', uploadRouter);

// ==================== 错误处理 ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ==================== 启动服务器 ====================

function startServer() {
  app.listen(PORT, () => {
    console.log(`
🌸 樱花树时光机 - 后端服务
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Server: http://localhost:${PORT}
📊 Health: http://localhost:${PORT}/health
💾 Mode: In-Memory (Demo Mode)
🌸 Ready to receive requests!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
  });

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\\n正在关闭服务器...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\\n正在关闭服务器...');
    process.exit(0);
  });
}

startServer();

export default app;
