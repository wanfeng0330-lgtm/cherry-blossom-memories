import multer from 'multer';

/**
 * 配置Multer用于文件上传
 * 使用内存存储，方便后续上传到七牛云
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('只支持图片格式 (JPEG, PNG, GIF, WebP)'));
    }
  }
});

export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 10);

export default upload;
