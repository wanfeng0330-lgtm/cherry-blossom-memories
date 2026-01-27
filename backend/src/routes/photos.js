import express from 'express';
import Photo from '../models/Photo.js';

const router = express.Router();

/**
 * @route   GET /api/photos
 * @desc    获取所有照片
 */
router.get('/', async (req, res) => {
  try {
    const { year, month } = req.query;

    const query = {};
    if (year) {
      query.year = parseInt(year);
    }
    if (month) {
      query.month = parseInt(month);
    }

    const photos = await Photo.find(query).sort({ date: 1 });

    res.json({
      success: true,
      data: photos,
      total: photos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取照片失败',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/photos/:id
 * @desc    获取单张照片
 */
router.get('/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: '照片不存在'
      });
    }

    res.json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取照片失败',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/photos/month/:month
 * @desc    按月份获取照片
 */
router.get('/month/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const { year } = req.query;

    const query = { month: parseInt(month) };
    if (year) {
      query.year = parseInt(year);
    }

    const photos = await Photo.find(query).sort({ date: 1 });

    res.json({
      success: true,
      data: photos,
      count: photos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取照片失败',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/photos
 * @desc    创建照片记录
 */
router.post('/', async (req, res) => {
  try {
    const { url, thumbnail, date, caption, position, metadata } = req.body;

    if (!url || !date) {
      return res.status(400).json({
        success: false,
        message: 'URL和日期不能为空'
      });
    }

    const photo = new Photo({
      url,
      thumbnail: thumbnail || url,
      date,
      caption: caption || '',
      position: position || {},
      metadata: metadata || {}
    });

    await photo.save();

    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建照片失败',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/photos/:id
 * @desc    更新照片
 */
router.put('/:id', async (req, res) => {
  try {
    const { caption, date, position } = req.body;

    const updateData = {};
    if (caption !== undefined) {
      updateData.caption = caption;
    }
    if (date !== undefined) {
      updateData.date = date;
    }
    if (position !== undefined) {
      updateData.position = position;
    }

    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: '照片不存在'
      });
    }

    res.json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新照片失败',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/photos/:id
 * @desc    删除照片
 */
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: '照片不存在'
      });
    }

    res.json({
      success: true,
      message: '照片已删除',
      data: photo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除照片失败',
      error: error.message
    });
  }
});

export default router;
