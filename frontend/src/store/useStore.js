import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { photosData, audiosData } from '../data/photos';

/**
 * 樱花树时光机 - 全局状态管理（纯静态版本）
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // ==================== 状态 ====================
      photos: photosData,
      selectedMonth: 10,  // 从2023年10月开始
      selectedYear: 2023,
      isLoading: false,
      error: null,

      // UI状态
      isPhotoModalOpen: false,
      selectedPhoto: null,

      // 音频状态
      audios: audiosData,
      isPlaying: false,
      currentTrackIndex: 0,

      // ==================== 照片操作 ====================
      fetchPhotos: async () => {
        // 静态版本直接返回本地数据
        set({ photos: photosData });
      },

      fetchPhotosByMonth: async (month, year) => {
        // 静态版本直接过滤本地数据
        set({ photos: photosData, selectedMonth: month, selectedYear: year });
      },

      // ==================== 音频操作 ====================
      fetchAudios: async () => {
        // 静态版本直接返回本地数据
        set({ audios: audiosData });
      },

      // ==================== 月份选择 ====================
      setSelectedMonth: (month) => {
        set({ selectedMonth: month });
      },

      setSelectedYear: (year) => {
        set({ selectedYear: year });
      },

      // ==================== UI控制 ====================
      openPhotoModal: (photo) => set({ isPhotoModalOpen: true, selectedPhoto: photo }),
      closePhotoModal: () => set({ isPhotoModalOpen: false, selectedPhoto: null }),

      // ==================== 音乐控制 ====================
      toggleMusic: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),

      // ==================== 辅助方法 ====================
      getPhotosByMonth: (month, year) => {
        const state = get();
        return state.photos.filter((photo) => {
          const photoDate = new Date(photo.date);
          return (
            photoDate.getMonth() + 1 === month &&
            photoDate.getFullYear() === year
          );
        });
      },

      getMonthStats: () => {
        const state = get();
        const stats = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          count: 0
        }));

        state.photos.forEach((photo) => {
          const month = new Date(photo.date).getMonth();
          stats[month].count++;
        });

        return stats;
      }
    }),
    {
      name: 'cherry-blossom-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedMonth: state.selectedMonth,
        selectedYear: state.selectedYear,
        isPlaying: state.isPlaying,
        currentTrackIndex: state.currentTrackIndex
      })
    }
  )
);
