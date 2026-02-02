const tcb = require('tcb-admin-node');
const fs = require('fs');
const path = require('path');

// 初始化CloudBase
const app = tcb.init({
  envId: process.env.ENV_ID || 'your-env-id',
  secretId: process.env.SECRET_ID || 'your-secret-id',
  secretKey: process.env.SECRET_KEY || 'your-secret-key'
});

const db = app.database();
const storage = app.upload();

/**
 * 上传文件到CloudBase存储
 * @param {Buffer} fileBuffer - 文件buffer
 * @param {string} fileName - 文件名
 * @param {string} cloudPath - 云端路径
 * @returns {Promise<Object>} 上传结果
 */
async function uploadFile(fileBuffer, fileName, cloudPath = '/photos') {
  try {
    // 生成唯一文件名
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    const fullPath = `${cloudPath}/${uniqueName}`;

    // 上传到CloudBase存储
    const result = await storage.upload({
      cloudPath: fullPath,
      fileContent: fileBuffer
    });

    // 获取下载URL
    const fileUrl = await app.getTempFileURL({
      fileList: [fullPath]
    });

    return {
      success: true,
      data: {
        url: fileUrl.fileList[0].tempFileURL,
        key: fullPath,
        fileName: uniqueName,
        size: fileBuffer.length
      }
    };
  } catch (error) {
    console.error('CloudBase上传失败:', error);
    return {
      success: false,
      message: '上传失败: ' + error.message
    };
  }
}

/**
 * 删除CloudBase存储的文件
 * @param {string} cloudPath - 云端路径
 * @returns {Promise<Object>} 删除结果
 */
async function deleteFile(cloudPath) {
  try {
    await storage.deleteFile({ fileList: [cloudPath] });
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error) {
    console.error('CloudBase删除失败:', error);
    return {
      success: false,
      message: '删除失败: ' + error.message
    };
  }
}

/**
 * 获取文件临时URL
 * @param {string} cloudPath - 云端路径
 * @param {number} maxAge - 有效期（秒）
 * @returns {Promise<string>} 临时URL
 */
async function getFileUrl(cloudPath, maxAge = 3600) {
  try {
    const result = await app.getTempFileURL({
      fileList: [
        {
          fileID: cloudPath,
          maxAge
        }
      ]
    });
    return result.fileList[0].tempFileURL;
  } catch (error) {
    console.error('获取文件URL失败:', error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
  db,
  app
};
