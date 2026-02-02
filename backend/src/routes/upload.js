import express from 'express';
import qiniuService from '../services/qiniu.js';
import { isValidConfig, getConfigStatus } from '../config/qiniu.js';

const router = express.Router();

/**
 * @route   GET /api/upload/token
 * @desc    获取七牛云上传Token
 */
router.get('/token', (req, res) => {
  if (!isValidConfig()) {
    return res.status(500).json({
      success: false,
      message: '七牛云未配置',
      config: getConfigStatus()
    });
  }

  try {
    const token = qiniuService.getUploadToken();
    res.json({
      success: true,
      data: {
        token,
        bucket: process.env.QINIU_BUCKET,
        domain: process.env.QINIU_DOMAIN,
        uploadUrl: `https://upload-z0.qiniup.com` // 华东区域上传地址
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取Token失败: ' + error.message
    });
  }
});

/**
 * @route   POST /api/upload/photo
 * @desc    上传照片到七牛云
 */
router.post('/photo', express.raw({ type: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], limit: '10mb' }), async (req, res) => {
  try {
    if (!isValidConfig()) {
      return res.status(500).json({
        success: false,
        message: '七牛云未配置',
        fallback: true,
        data: await uploadAsBase64(req.body, req.get('content-type'))
      });
    }

    if (!req.body || req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const contentType = req.get('content-type') || 'image/jpeg';
    const fileName = `photo-${Date.now()}.${contentType.split('/')[1]}`;

    const result = await qiniuService.uploadFile(req.body, fileName, contentType, 'photos');

    res.json({
      success: true,
      data: {
        url: result.url,
        key: result.key,
        size: result.size,
        mimeType: result.mimeType,
        width: result.width,
        height: result.height,
        hash: result.hash,
        provider: 'qiniu'
      }
    });
  } catch (error) {
    console.error('七牛云上传失败:', error);

    // 失败时回退到base64
    try {
      const fallbackResult = await uploadAsBase64(req.body, req.get('content-type'));
      res.json({
        success: true,
        data: { ...fallbackResult, provider: 'base64-fallback' }
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: '上传失败: ' + error.message
      });
    }
  }
});

/**
 * @route   POST /api/upload/base64
 * @desc    上传Base64图片到七牛云
 */
router.post('/base64', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { image, filename = `photo-${Date.now()}.jpg` } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: '缺少图片数据'
      });
    }

    if (!isValidConfig()) {
      return res.status(500).json({
        success: false,
        message: '七牛云未配置',
        fallback: true,
        data: { url: image, key: `base64-${Date.now()}`, provider: 'base64-direct' }
      });
    }

    const result = await qiniuService.uploadBase64(image, filename);

    res.json({
      success: true,
      data: {
        url: result.url,
        key: result.key,
        size: result.size,
        mimeType: result.mimeType,
        width: result.width,
        height: result.height,
        hash: result.hash,
        provider: 'qiniu'
      }
    });
  } catch (error) {
    console.error('Base64上传失败:', error);

    // 失败时回退
    res.status(500).json({
      success: false,
      message: '上传失败: ' + error.message
    });
  }
});

/**
 * @route   POST /api/upload/audio
 * @desc    上传音频文件到七牛云
 */
router.post('/audio', express.raw({ type: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'], limit: '20mb' }), async (req, res) => {
  try {
    if (!isValidConfig()) {
      return res.status(500).json({
        success: false,
        message: '七牛云未配置',
        fallback: true,
        data: await uploadAudioAsBase64(req.body, req.get('content-type'))
      });
    }

    if (!req.body || req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const contentType = req.get('content-type') || 'audio/mpeg';
    const formatMap = {
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'audio/m4a': 'm4a'
    };
    const format = formatMap[contentType] || 'mp3';
    const fileName = `audio-${Date.now()}.${format}`;

    const result = await qiniuService.uploadFile(req.body, fileName, contentType, 'audio');

    res.json({
      success: true,
      data: {
        url: result.url,
        key: result.key,
        size: result.size,
        mimeType: contentType,
        format,
        hash: result.hash,
        provider: 'qiniu'
      }
    });
  } catch (error) {
    console.error('音频上传失败:', error);

    // 失败时回退到base64
    try {
      const fallbackResult = await uploadAudioAsBase64(req.body, req.get('content-type'));
      res.json({
        success: true,
        data: { ...fallbackResult, provider: 'base64-fallback' }
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: '音频上传失败: ' + error.message
      });
    }
  }
});

/**
 * @route   DELETE /api/upload/:key
 * @desc    从七牛云删除文件
 */
router.delete('/:key', async (req, res) => {
  try {
    if (!isValidConfig()) {
      return res.status(500).json({
        success: false,
        message: '七牛云未配置'
      });
    }

    const { key } = req.params;
    await qiniuService.deleteFile(key);

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除失败: ' + error.message
    });
  }
});

/**
 * @route   GET /api/upload/config
 * @desc    获取七牛云配置状态
 */
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: getConfigStatus(),
    provider: 'qiniu'
  });
});

// ============ 辅助函数 ============

/**
 * 上传为Base64（回退方案）
 */
function uploadAsBase64(buffer, contentType = 'image/jpeg') {
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${contentType};base64,${base64}`;

  return {
    url: dataUrl,
    key: `upload-${Date.now()}`,
    size: buffer.length,
    mimeType: contentType
  };
}

/**
 * 上传音频为Base64（回退方案）
 */
function uploadAudioAsBase64(buffer, contentType = 'audio/mpeg') {
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${contentType};base64,${base64}`;

  const formatMap = {
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/m4a': 'm4a'
  };

  return {
    url: dataUrl,
    key: `audio-${Date.now()}`,
    size: buffer.length,
    mimeType: contentType,
    format: formatMap[contentType] || 'mp3'
  };
}

export default router;
