import express from 'express';

const router = express.Router();

// In-memory "uploaded" files storage
const uploadedFiles = [];

/**
 * @route   POST /api/upload
 * @desc    上传图片 (Demo mode - converts to base64)
 */
router.post('/', express.raw({ type: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], limit: '10mb' }), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    // Get content type
    const contentType = req.get('content-type') || 'image/jpeg';

    // Convert buffer to base64
    const base64 = req.body.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64}`;

    const result = {
      url: dataUrl,
      key: `upload-${Date.now()}`,
      size: req.body.length,
      mimeType: contentType
    };

    uploadedFiles.push(result);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '上传失败: ' + error.message
    });
  }
});

/**
 * @route   POST /api/upload/audio
 * @desc    上传音频文件 (Demo mode - converts to base64)
 */
router.post('/audio', express.raw({ type: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'], limit: '20mb' }), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    // Get content type
    const contentType = req.get('content-type') || 'audio/mpeg';

    // Convert buffer to base64
    const base64 = req.body.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64}`;

    // Determine format from content type
    const formatMap = {
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'audio/m4a': 'm4a'
    };

    const result = {
      url: dataUrl,
      key: `audio-${Date.now()}`,
      size: req.body.length,
      mimeType: contentType,
      format: formatMap[contentType] || 'mp3'
    };

    uploadedFiles.push(result);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '音频上传失败: ' + error.message
    });
  }
});

/**
 * @route   POST /api/upload/url
 * @desc    接受外部URL (备用方案)
 */
router.post('/url', express.json(), (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'URL不能为空'
    });
  }

  const result = {
    url,
    key: `url-${Date.now()}`,
    size: 0,
    mimeType: 'image/jpeg'
  };

  uploadedFiles.push(result);

  res.json({ success: true, data: result });
});

/**
 * @route   GET /api/upload/token
 * @desc    获取上传Token (Demo mode)
 */
router.get('/token', (req, res) => {
  res.json({
    success: true,
    data: {
      token: 'demo-token',
      bucket: 'demo-bucket',
      domain: 'https://demo.example.com'
    }
  });
});

export default router;
