/**
 * 错误处理中间件
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Multer错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: '文件大小超过限制 (最大10MB)'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: '上传的文件数量超过限制'
    });
  }

  // Mongoose验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Mongoose重复键错误
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: '数据已存在'
    });
  }

  // 默认错误
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
}

/**
 * 404处理中间件
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
}
