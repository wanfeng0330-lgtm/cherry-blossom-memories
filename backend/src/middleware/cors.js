import cors from 'cors';

/**
 * CORS配置
 */
export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      // Vercel 部署的前端域名
      /\.vercel\.app$/,
      // Netlify 部署的前端域名
      /\.netlify\.app$/,
      // 其他常见部署平台
      /\.pages\.dev$/,
      /\.web\.app$/
    ];

    // 允许没有origin的请求（如移动应用、Postman等）
    if (!origin) {
      return callback(null, true);
    }

    // 检查是否在允许列表中或匹配正则表达式
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('不允许的跨域请求'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default cors(corsOptions);
