/**
 * 照片位置计算工具
 * 用于确定照片在樱花树上的位置
 */

/**
 * 计算照片在树上的位置
 * @param {number} month - 月份 (1-12)
 * @param {number} photoIndex - 照片索引
 * @param {number} totalPhotos - 总照片数
 * @returns {Object} 位置信息
 */
export function calculatePhotoPosition(month, photoIndex, totalPhotos) {
  const anglePerMonth = 360 / 12;
  const baseAngle = (month - 1) * anglePerMonth;

  // 在扇区内散布照片
  const spread = 25;
  const offset = totalPhotos > 1
    ? (photoIndex / (totalPhotos - 1)) * spread - spread / 2
    : 0;

  const finalAngle = baseAngle + offset;

  // 计算位置
  const radius = 3 + Math.random() * 1.5;
  const height = 1.5 + Math.random() * 3;

  return {
    branch: Math.floor(photoIndex / 3) % 8,
    angle: finalAngle,
    height: height,
    radius: radius
  };
}

/**
 * 批量计算照片位置
 * @param {Array} photos - 照片数组
 * @returns {Map} 照片ID到位置的映射
 */
export function calculatePhotoPositions(photos) {
  const positionMap = new Map();

  // 按月份分组
  const photosByMonth = {};
  photos.forEach((photo) => {
    const date = new Date(photo.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (!photosByMonth[key]) {
      photosByMonth[key] = [];
    }
    photosByMonth[key].push(photo);
  });

  // 为每张照片计算位置
  Object.entries(photosByMonth).forEach(([key, monthPhotos]) => {
    monthPhotos.forEach((photo, index) => {
      const position = calculatePhotoPosition(
        photo.month,
        index,
        monthPhotos.length
      );
      positionMap.set(photo._id.toString(), position);
    });
  });

  return positionMap;
}
