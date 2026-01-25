import qiniu from 'qiniu';
import { qiniuConfig, generateUploadToken, generateFileKey, generatePublicUrl } from '../config/qiniu.js';

/**
 * 七牛云服务类
 */
class QiniuService {
  constructor() {
    this.mac = new qiniu.auth.digest.Mac(
      qiniuConfig.accessKey,
      qiniuConfig.secretKey
    );

    this.config = new qiniu.conf.Config();
    this.config.zone = qiniu.zone.Zone_z0; // 华东区域

    this.formUploader = new qiniu.form_up.FormUploader(this.config);
    this.putExtra = new qiniu.form_up.PutExtra();
  }

  /**
   * 上传文件到七牛云
   * @param {Buffer} buffer - 文件内容
   * @param {string} originalFilename - 原始文件名
   * @param {string} mimeType - MIME类型
   * @returns {Promise<Object>} 上传结果
   */
  async uploadFile(buffer, originalFilename, mimeType) {
    try {
      const key = generateFileKey(originalFilename);
      const uploadToken = generateUploadToken();

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
              url: generatePublicUrl(respBody.key)
            });
          } else {
            reject(new Error(`Upload failed: ${respInfo.statusCode}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Qiniu upload error: ${error.message}`);
    }
  }

  /**
   * 删除文件
   * @param {string} key - 文件key
   * @returns {Promise<boolean>}
   */
  async deleteFile(key) {
    try {
      const bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
      return new Promise((resolve, reject) => {
        bucketManager.delete(qiniuConfig.bucket, key, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
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
   * 获取上传Token
   * @returns {string} 上传Token
   */
  getUploadToken() {
    return generateUploadToken();
  }
}

export default new QiniuService();
