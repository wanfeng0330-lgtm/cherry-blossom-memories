import qiniu from 'qiniu';
import fs from 'fs';

/**
 * 七牛云配置
 */
export const qiniuConfig = {
  accessKey: process.env.QINIU_ACCESS_KEY || '',
  secretKey: process.env.QINIU_SECRET_KEY || '',
  bucket: process.env.QINIU_BUCKET || '',
  domain: process.env.QINIU_DOMAIN || '',
  zone: process.env.QINIU_ZONE || 'z0' // 区域: z0华东, z1华北, z2华南, na0北美, as0东南亚
};

/**
 * 根据区域获取Zone配置
 */
function getZoneConfig(zoneCode) {
  const zoneMap = {
    'z0': qiniu.zone.Zone_z0,  // 华东
    'z1': qiniu.zone.Zone_z1,  // 华北
    'z2': qiniu.zone.Zone_z2,  // 华南
    'na0': qiniu.zone.Zone_na0, // 北美
    'as0': qiniu.zone.Zone_as0, // 东南亚
    'cn-east-2': qiniu.zone.Zone_cn_east_2 // 华东-2
  };
  return zoneMap[zoneCode] || qiniu.zone.Zone_z0;
}

/**
 * 生成七牛云上传Token
 * @param {string} key - 文件key（可选，用于指定文件名）
 * @param {number} expires - 过期时间（秒），默认3600（1小时）
 */
export function generateUploadToken(key = '', expires = 3600) {
  const mac = new qiniu.auth.digest.Mac(
    qiniuConfig.accessKey,
    qiniuConfig.secretKey
  );

  const putPolicyOptions = {
    scope: key ? `${qiniuConfig.bucket}:${key}` : qiniuConfig.bucket,
    expires: expires,
    returnBody: '{"key":"$(key)","hash":"$(etag)","size":$(fsize),"mimeType":"$(mimeType)","width":$(imageInfo.width),"height":$(imageInfo.height)}'
  };

  const putPolicy = new qiniu.rs.PutPolicy(putPolicyOptions);
  const uploadToken = putPolicy.uploadToken(mac);
  return uploadToken;
}

/**
 * 生成七牛云公开访问URL
 * @param {string} key - 文件key
 */
export function generatePublicUrl(key) {
  const domain = qiniuConfig.domain.replace(/\/$/, '');
  return `${domain}/${key}`;
}

/**
 * 生成唯一的文件key
 * @param {string} originalFilename - 原始文件名
 * @param {string} prefix - 前缀（默认photos）
 */
export function generateFileKey(originalFilename, prefix = 'photos') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = originalFilename.split('.').pop();
  return `${prefix}/${timestamp}-${random}.${ext}`;
}

/**
 * 验证配置是否完整
 * @returns {boolean}
 */
export function isValidConfig() {
  return !!(
    qiniuConfig.accessKey &&
    qiniuConfig.secretKey &&
    qiniuConfig.bucket &&
    qiniuConfig.domain
  );
}

/**
 * 获取配置状态
 */
export function getConfigStatus() {
  return {
    hasAccessKey: !!qiniuConfig.accessKey,
    hasSecretKey: !!qiniuConfig.secretKey,
    hasBucket: !!qiniuConfig.bucket,
    hasDomain: !!qiniuConfig.domain,
    isValid: isValidConfig()
  };
}
