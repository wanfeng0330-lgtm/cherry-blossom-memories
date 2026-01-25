import * as THREE from 'three';
import { PHOTO_POSITIONS } from './constants';

/**
 * 计算照片在樱花树上的位置
 * @param {number} month - 月份 (1-12)
 * @param {number} photoIndex - 照片在当月中的索引
 * @param {number} totalInMonth - 当月照片总数
 * @param {number} year - 年份
 * @returns {Object} 位置和旋转信息
 */
export function calculatePhotoPosition(month, photoIndex, totalInMonth, year = new Date().getFullYear()) {
  const { minRadius, maxRadius, minHeight, maxHeight, anglePerMonth } = PHOTO_POSITIONS;

  // 计算该月份的基础角度
  const baseAngle = (month - 1) * anglePerMonth;

  // 在扇区内散布照片
  const spread = 25; // 扇区内的散布范围
  const offset = totalInMonth > 1
    ? (photoIndex / (totalInMonth - 1)) * spread - spread / 2
    : 0;

  const finalAngle = baseAngle + offset;

  // 转换为弧度
  const radians = (finalAngle * Math.PI) / 180;

  // 计算位置（球形分布）
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  const height = minHeight + Math.random() * (maxHeight - minHeight);

  return {
    position: new THREE.Vector3(
      Math.cos(radians) * radius,
      height,
      Math.sin(radians) * radius
    ),
    rotation: {
      x: 0,
      y: -radians,
      z: 0
    },
    // 面向树外侧
    lookAt: new THREE.Vector3(
      Math.cos(radians) * (radius + 1),
      height,
      Math.sin(radians) * (radius + 1)
    ),
    branchIndex: Math.floor(photoIndex / 3) % 8,
    month,
    year
  };
}

/**
 * 批量计算多张照片的位置
 * @param {Array} photos - 照片数组，每个包含 date 属性
 * @returns {Map} 照片ID到位置的映射
 */
export function calculatePhotoPositions(photos) {
  const positionMap = new Map();

  // 按月份分组
  const photosByMonth = {};
  photos.forEach((photo, index) => {
    const date = new Date(photo.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (!photosByMonth[key]) {
      photosByMonth[key] = [];
    }
    photosByMonth[key].push({ photo, index });
  });

  // 为每张照片计算位置
  Object.entries(photosByMonth).forEach(([key, monthPhotos]) => {
    const [year, month] = key.split('-').map(Number);
    const totalInMonth = monthPhotos.length;

    monthPhotos.forEach(({ photo, index: originalIndex }) => {
      const photoIndex = monthPhotos.findIndex(p => p.photo._id === photo._id);
      const position = calculatePhotoPosition(month, photoIndex, totalInMonth, year);
      positionMap.set(photo._id || photo.url, position);
    });
  });

  return positionMap;
}

/**
 * 计算月份选择时相机/树的目标旋转角度
 * @param {number} month - 选中的月份 (1-12)
 * @returns {number} 目标Y轴旋转角度（弧度）
 */
export function calculateRotationForMonth(month) {
  const anglePerMonth = 360 / 12;
  const baseAngle = (month - 1) * anglePerMonth;
  const centerOffset = anglePerMonth / 2; // 居中显示
  return ((baseAngle + centerOffset) * Math.PI) / 180;
}

/**
 * 获取月份的扇区范围
 * @param {number} month - 月份 (1-12)
 * @returns {Object} 包含 startAngle 和 endAngle 的对象（度数）
 */
export function getMonthAngleRange(month) {
  const anglePerMonth = 360 / 12;
  return {
    startAngle: (month - 1) * anglePerMonth,
    endAngle: month * anglePerMonth,
    centerAngle: (month - 0.5) * anglePerMonth
  };
}

/**
 * 检查一个角度是否属于某个月份的扇区
 * @param {number} angle - 角度（度数）
 * @param {number} month - 月份 (1-12)
 * @returns {boolean}
 */
export function isAngleInMonth(angle, month) {
  const normalizedAngle = ((angle % 360) + 360) % 360;
  const { startAngle, endAngle } = getMonthAngleRange(month);
  return normalizedAngle >= startAngle && normalizedAngle < endAngle;
}
