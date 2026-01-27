import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import cors from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import photosRouter from './routes/photos.js';
import uploadRouter from './routes/upload.js';
import audioRouter from './routes/audio.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== 数据库连接 ====================
let mongoServer;

const connectDB = async () => {
  try {
    const useMemoryDB = process.env.USE_MEMORY_DB === 'true';

    if (useMemoryDB) {
      // 使用内存数据库（开发环境）
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('📦 Connected to in-memory MongoDB');
    } else {
      // 使用真实数据库
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cherry-blossom-memories';
      await mongoose.connect(mongoUri);
      console.log('📦 Connected to MongoDB');
    }

    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// ==================== 中间件 ====================
app.use(cors);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==================== 路由 ====================

// 健康检查
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    success: true,
    message: '樱花树时光机 API 运行中',
    timestamp: new Date().toISOString(),
    mode: process.env.USE_MEMORY_DB === 'true' ? 'in-memory (demo mode)' : 'mongodb',
    database: {
      status: dbStatusText[dbStatus],
      name: mongoose.connection.name || 'N/A'
    }
  });
});

// API路由
app.use('/api/photos', photosRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/audio', audioRouter);

// ==================== 错误处理 ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ==================== 启动服务器 ====================

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    const mode = process.env.USE_MEMORY_DB === 'true' ? 'In-Memory (Demo Mode)' : 'MongoDB';
    console.log(`
🌸 樱花树时光机 - 后端服务
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Server: http://localhost:${PORT}
📊 Health: http://localhost:${PORT}/health
💾 Mode: ${mode}
🌸 Ready to receive requests!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
  });

  // 优雅关闭
  process.on('SIGINT', async () => {
    console.log('\\n正在关闭服务器...');
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\\n正在关闭服务器...');
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(0);
  });
}

startServer();

export default app;
