import express from 'express';
import Audio from '../models/Audio.js';

const router = express.Router();

/**
 * @route   GET /api/audio
 * @desc    获取所有音频
 */
router.get('/', async (req, res) => {
  try {
    const audios = await Audio.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: audios,
      total: audios.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取音频失败',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/audio/:id
 * @desc    获取单个音频
 */
router.get('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({
        success: false,
        message: '音频不存在'
      });
    }

    res.json({ success: true, data: audio });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取音频失败',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/audio
 * @desc    创建音频记录
 */
router.post('/', async (req, res) => {
  try {
    const { title, artist, url, duration, metadata } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: '标题和URL不能为空'
      });
    }

    const audio = await Audio.create({
      title,
      artist: artist || '未知艺术家',
      url,
      duration: duration || 0,
      metadata: metadata || {}
    });

    res.status(201).json({ success: true, data: audio });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建音频失败',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/audio/:id
 * @desc    更新音频
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, artist, duration } = req.body;

    const updateData = {};
    if (title !== undefined) {
      updateData.title = title;
    }
    if (artist !== undefined) {
      updateData.artist = artist;
    }
    if (duration !== undefined) {
      updateData.duration = duration;
    }

    const audio = await Audio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!audio) {
      return res.status(404).json({
        success: false,
        message: '音频不存在'
      });
    }

    res.json({ success: true, data: audio });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新音频失败',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/audio/:id
 * @desc    删除音频
 */
router.delete('/:id', async (req, res) => {
  try {
    const audio = await Audio.findByIdAndDelete(req.params.id);

    if (!audio) {
      return res.status(404).json({
        success: false,
        message: '音频不存在'
      });
    }

    res.json({
      success: true,
      message: '音频已删除',
      data: audio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除音频失败',
      error: error.message
    });
  }
});

export default router;
