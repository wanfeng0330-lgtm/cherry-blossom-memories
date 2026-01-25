import { useMemo } from 'react';
import { calculatePhotoPositions } from '../utils/photoPosition';

/**
 * 照片位置计算钩子
 * 根据照片列表计算每张照片在树上的位置
 */
export function usePhotoPosition(photos) {
  const positionMap = useMemo(() => {
    return calculatePhotoPositions(photos || []);
  }, [photos]);

  /**
   * 获取照片的位置信息
   * @param {string} photoId - 照片ID或URL
   * @returns {Object|undefined} 位置信息
   */
  const getPhotoPosition = (photoId) => {
    return positionMap.get(photoId);
  };

  /**
   * 获取指定月份的照片
   * @param {number} month - 月份 (1-12)
   * @param {number} year - 年份
   * @returns {Array} 照片数组
   */
  const getPhotosByMonth = (month, year = new Date().getFullYear()) => {
    if (!photos) return [];

    return photos.filter(photo => {
      const photoDate = new Date(photo.date);
      return photoDate.getMonth() + 1 === month &&
             photoDate.getFullYear() === year;
    });
  };

  /**
   * 获取所有月份及其照片数量
   * @returns {Array} 月份统计数组
   */
  const getMonthStats = () => {
    if (!photos) return [];

    const stats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
      years: {}
    }));

    photos.forEach(photo => {
      const date = new Date(photo.date);
      const month = date.getMonth();
      const year = date.getFullYear();

      stats[month].count++;

      if (!stats[month].years[year]) {
        stats[month].years[year] = 0;
      }
      stats[month].years[year]++;
    });

    return stats;
  };

  return {
    positionMap,
    getPhotoPosition,
    getPhotosByMonth,
    getMonthStats
  };
}
