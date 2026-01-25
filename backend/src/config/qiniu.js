import qiniu from 'qiniu';

/**
 * 七牛云配置
 */
export const qiniuConfig = {
  accessKey: process.env.QINIU_ACCESS_KEY || '',
  secretKey: process.env.QINIU_SECRET_KEY || '',
  bucket: process.env.QINIU_BUCKET || '',
  domain: process.env.QINIU_DOMAIN || ''
};

/**
 * 生成七牛云上传Token
 */
export function generateUploadToken() {
  const mac = new qiniu.auth.digest.Mac(
    qiniuConfig.accessKey,
    qiniuConfig.secretKey
  );

  const putPolicy = new qiniu.rs.PutPolicy({
    scope: qiniuConfig.bucket,
    expires: 3600, // 1小时有效期
    returnBody: '{"key":"$(key)","hash":"$(etag)","size":$(fsize),"mimeType":"$(mimeType)"}'
  });

  const uploadToken = putPolicy.uploadToken(mac);
  return uploadToken;
}

/**
 * 生成七牛云公开访问URL
 */
export function generatePublicUrl(key) {
  const domain = qiniuConfig.domain.replace(/\/$/, '');
  return `${domain}/${key}`;
}

/**
 * 生成唯一的文件key
 */
export function generateFileKey(originalFilename) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = originalFilename.split('.').pop();
  return `photos/${timestamp}-${random}.${ext}`;
}
