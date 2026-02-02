const cloud = require('wx-server-sdk');
const fs = require('fs');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { action, fileData, fileName, cloudPath } = event;

  const wxContext = cloud.getWXContext();

  switch (action) {
    case 'uploadPhoto':
      return await uploadPhoto(fileData, fileName);
    case 'deleteFile':
      return await deleteFile(cloudPath);
    default:
      return {
        success: false,
        message: '未知操作'
      };
  }
};

async function uploadPhoto(fileData, fileName) {
  try {
    // 将base64转换为buffer
    const buffer = Buffer.from(fileData, 'base64');

    // 上传到云存储
    const result = await cloud.uploadFile({
      cloudPath: `photos/${Date.now()}_${fileName}`,
      fileContent: buffer
    });

    // 获取文件临时URL
    const urlResult = await cloud.getTempFileURL({
      fileList: [result.fileID]
    });

    return {
      success: true,
      data: {
        fileID: result.fileID,
        url: urlResult.fileList[0].tempFileURL,
        key: result.fileID
      }
    };
  } catch (error) {
    return {
      success: false,
      message: '上传失败: ' + error.message
    };
  }
}

async function deleteFile(cloudPath) {
  try {
    await cloud.deleteFile({
      fileList: [cloudPath]
    });

    return {
      success: true,
      message: '删除成功'
    };
  } catch (error) {
    return {
      success: false,
      message: '删除失败: ' + error.message
    };
  }
}
