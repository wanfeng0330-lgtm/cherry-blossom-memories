import express from 'express';

const router = express.Router();

// In-memory storage for demo purposes
let photosData = [];

let nextId = 1;

/**
 * @route   GET /api/photos
 * @desc    获取所有照片
 */
router.get('/', (req, res) => {
  const { year, month } = req.query;

  let filtered = [...photosData];

  if (year) {
    filtered = filtered.filter(p => p.year === parseInt(year));
  }
  if (month) {
    filtered = filtered.filter(p => p.month === parseInt(month));
  }

  res.json({
    success: true,
    data: filtered.sort((a, b) => new Date(a.date) - new Date(b.date)),
    total: filtered.length
  });
});

/**
 * @route   GET /api/photos/:id
 * @desc    获取单张照片
 */
router.get('/:id', (req, res) => {
  const photo = photosData.find(p => p._id === req.params.id);

  if (!photo) {
    return res.status(404).json({
      success: false,
      message: '照片不存在'
    });
  }

  res.json({ success: true, data: photo });
});

/**
 * @route   GET /api/photos/month/:month
 * @desc    按月份获取照片
 */
router.get('/month/:month', (req, res) => {
  const { month } = req.params;
  const { year } = req.query;

  let filtered = photosData.filter(p => p.month === parseInt(month));

  if (year) {
    filtered = filtered.filter(p => p.year === parseInt(year));
  }

  res.json({
    success: true,
    data: filtered.sort((a, b) => new Date(a.date) - new Date(b.date)),
    count: filtered.length
  });
});

/**
 * @route   POST /api/photos
 * @desc    创建照片记录
 */
router.post('/', (req, res) => {
  const { url, thumbnail, date, caption, position } = req.body;

  if (!url || !date) {
    return res.status(400).json({
      success: false,
      message: 'URL和日期不能为空'
    });
  }

  const photoDate = new Date(date);
  const newPhoto = {
    _id: String(nextId++),
    url,
    thumbnail: thumbnail || url,
    date: photoDate.toISOString(),
    year: photoDate.getFullYear(),
    month: photoDate.getMonth() + 1,
    caption: caption || '',
    position: position || {}
  };

  photosData.push(newPhoto);

  res.status(201).json({ success: true, data: newPhoto });
});

/**
 * @route   PUT /api/photos/:id
 * @desc    更新照片
 */
router.put('/:id', (req, res) => {
  const index = photosData.findIndex(p => p._id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: '照片不存在'
    });
  }

  const { caption, date, position } = req.body;

  if (caption !== undefined) {
    photosData[index].caption = caption;
  }
  if (date !== undefined) {
    const newDate = new Date(date);
    photosData[index].date = newDate.toISOString();
    photosData[index].year = newDate.getFullYear();
    photosData[index].month = newDate.getMonth() + 1;
  }
  if (position !== undefined) {
    photosData[index].position = position;
  }

  res.json({ success: true, data: photosData[index] });
});

/**
 * @route   DELETE /api/photos/:id
 * @desc    删除照片
 */
router.delete('/:id', (req, res) => {
  const index = photosData.findIndex(p => p._id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: '照片不存在'
    });
  }

  const deleted = photosData.splice(index, 1)[0];

  res.json({
    success: true,
    message: '照片已删除',
    data: deleted
  });
});

export default router;
