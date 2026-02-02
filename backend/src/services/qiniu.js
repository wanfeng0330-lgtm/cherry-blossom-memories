import qiniu from 'qiniu';
import { qiniuConfig, generateUploadToken, generatePublicUrl, getZoneConfig, generateFileKey } from '../config/qiniu.js';

/**
 * 七牛云服务类
 */
class QiniuService {
  constructor() {
    this.mac = null;
    this.config = null;
    this.formUploader = null;
    this.putExtra = null;
    this.bucketManager = null;
    this.initialized = false;
  }

  /**
   * 初始化七牛云服务
   */
  init() {
    if (this.initialized) return;

    try {
      this.mac = new qiniu.auth.digest.Mac(
        qiniuConfig.accessKey,
        qiniuConfig.secretKey
      );

      this.config = new qiniu.conf.Config();
      this.config.zone = getZoneConfig(qiniuConfig.zone);

      this.formUploader = new qiniu.form_up.FormUploader(this.config);
      this.putExtra = new qiniu.form_up.PutExtra();

      this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);

      this.initialized = true;
      console.log('✅ Qiniu service initialized');
    } catch (error) {
      console.error('❌ Qiniu service init failed:', error.message);
      throw error;
    }
  }

  /**
   * 上传文件到七牛云
   * @param {Buffer} buffer - 文件内容
   * @param {string} originalFilename - 原始文件名
   * @param {string} mimeType - MIME类型
   * @returns {Promise<Object>} 上传结果
   */
  async uploadFile(buffer, originalFilename, mimeType, prefix = 'photos') {
    try {
      if (!this.initialized) this.init();

      const key = generateFileKey(originalFilename, prefix);
      const uploadToken = generateUploadToken();

      // 设置文件类型
      this.putExtra.mimeType = mimeType;

      return new Promise((resolve, reject) => {
        this.formUploader.put(uploadToken, key, buffer, this.putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            return;
          }

          if (respInfo.statusCode === 200) {
            resolve({
              key: respBody.key,
              hash: respBody.hash,
              size: respBody.size,
              mimeType: respBody.mimeType,
              width: respBody.width || null,
              height: respBody.height || null,
              url: generatePublicUrl(respBody.key)
            });
          } else {
            reject(new Error(`Upload failed: ${respInfo.statusCode} - ${JSON.stringify(respBody)}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Qiniu upload error: ${error.message}`);
    }
  }

  /**
   * 上传Base64图片到七牛云
   * @param {string} base64Data - Base64数据（包含data:image/xxx;base64,前缀）
   * @param {string} filename - 文件名
   * @returns {Promise<Object>} 上传结果
   */
  async uploadBase64(base64Data, filename) {
    try {
      // 提取MIME类型和纯base64数据
      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 data format');
      }

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');

      return await this.uploadFile(buffer, filename, mimeType);
    } catch (error) {
      throw new Error(`Base64 upload error: ${error.message}`);
    }
  }

  /**
   * 删除文件
   * @param {string} key - 文件key
   * @returns {Promise<boolean>}
   */
  async deleteFile(key) {
    try {
      if (!this.initialized) this.init();

      return new Promise((resolve, reject) => {
        this.bucketManager.delete(qiniuConfig.bucket, key, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200 || respInfo.statusCode === 612) {
            // 612表示文件不存在，也视为成功
            resolve(true);
          } else {
            reject(new Error(`Delete failed: ${respInfo.statusCode}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Qiniu delete error: ${error.message}`);
    }
  }

  /**
   * 批量删除文件
   * @param {Array<string>} keys - 文件key数组
   * @returns {Promise<Array>} 删除结果数组
   */
  async batchDelete(keys) {
    try {
      if (!this.initialized) this.init();

      return new Promise((resolve, reject) => {
        this.bucketManager.batch(qiniuConfig.bucket, keys, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(new Error(`Batch delete failed: ${respInfo.statusCode}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Qiniu batch delete error: ${error.message}`);
    }
  }

  /**
   * 获取上传Token
   * @returns {string} 上传Token
   */
  getUploadToken() {
    if (!this.initialized) this.init();
    return generateUploadToken();
  }

  /**
   * 获取文件信息
   * @param {string} key - 文件key
   * @returns {Promise<Object>} 文件信息
   */
  async getFileInfo(key) {
    try {
      if (!this.initialized) this.init();

      return new Promise((resolve, reject) => {
        this.bucketManager.stat(qiniuConfig.bucket, key, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(new Error(`Get file info failed: ${respInfo.statusCode}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Qiniu get file info error: ${error.message}`);
    }
  }

  /**
   * 生成图片缩略图URL
   * @param {string} key - 文件key
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {string} 缩略图URL
   */
  generateThumbnailUrl(key, width = 200, height = 200) {
    const publicUrl = generatePublicUrl(key);
    return `${publicUrl}?imageView2/2/w/${width}/h/${height}`;
  }

  /**
   * 生成图片处理URL（高级处理）
   * @param {string} key - 文件key
   * @param {Object} options - 处理选项
   * @returns {string} 处理后的URL
   */
  generateProcessUrl(key, options = {}) {
    const {
      imageView2 = '2/w/400/h/400',
      quality = 85,
      format = 'jpg',
      interlace = 1
    } = options;

    const publicUrl = generatePublicUrl(key);
    const specs = [
      `imageView2/${imageView2}`,
      `quality/${quality}`,
      `format/${format}`,
      `interlace/${interlace}`
    ];

    return `${publicUrl}?${specs.join('/')}`;
  }
}

// 导出单例
export default new QiniuService();
