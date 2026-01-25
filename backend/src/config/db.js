import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

/**
 * 连接MongoDB数据库
 */
export async function connectDB() {
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
}

/**
 * 断开数据库连接
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
}
