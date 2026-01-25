import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { photoAPI, uploadAPI } from '../utils/api';

/**
 * 樱花树时光机 - 全局状态管理
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // ==================== 状态 ====================
      photos: [],
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      isLoading: false,
      error: null,
      uploadProgress: 0,

      // UI状态
      isUploadModalOpen: false,
      isPhotoModalOpen: false,
      selectedPhoto: null,
      isPlaying: false,
      currentTrack: null,

      // ==================== 照片操作 ====================
      fetchPhotos: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await photoAPI.getAll();
          set({ photos: data.data || data, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchPhotosByMonth: async (month, year) => {
        set({ isLoading: true, error: null });
        try {
          const data = await photoAPI.getByMonth(month, year);
          set({ photos: data.data || data, isLoading: false, selectedMonth: month, selectedYear: year });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      uploadPhoto: async (file, date, caption) => {
        set({ isLoading: true, uploadProgress: 0, error: null });
        try {
          // 上传图片
          const uploadResult = await uploadAPI.uploadImage(file, (progress) => {
            set({ uploadProgress: progress });
          });

          // 创建照片记录
          const photoData = {
            url: uploadResult.data?.url || uploadResult.url,
            thumbnail: uploadResult.data?.url || uploadResult.url,
            date: new Date(date).toISOString(),
            caption
          };

          const newPhoto = await photoAPI.create(photoData);

          // 重新获取所有照片以确保数据同步
          const allPhotos = await photoAPI.getAll();
          const photoDate = new Date(date);

          // 更新本地状态，并切换到上传照片的月份
          set({
            photos: allPhotos.data || allPhotos,
            selectedMonth: photoDate.getMonth() + 1,
            selectedYear: photoDate.getFullYear(),
            isLoading: false,
            uploadProgress: 100
          });

          return newPhoto.data || newPhoto;
        } catch (error) {
          set({ error: error.message, isLoading: false, uploadProgress: 0 });
          throw error;
        }
      },

      updatePhoto: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPhoto = await photoAPI.update(id, updates);
          set((state) => ({
            photos: state.photos.map((p) =>
              p._id === id ? (updatedPhoto.data || updatedPhoto) : p
            ),
            isLoading: false
          }));
          return updatedPhoto.data || updatedPhoto;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deletePhoto: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await photoAPI.delete(id);
          set((state) => ({
            photos: state.photos.filter((p) => p._id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // ==================== 月份选择 ====================
      setSelectedMonth: (month) => {
        set({ selectedMonth: month });
      },

      setSelectedYear: (year) => {
        set({ selectedYear: year });
      },

      // ==================== UI控制 ====================
      openUploadModal: () => set({ isUploadModalOpen: true }),
      closeUploadModal: () => set({ isUploadModalOpen: false }),

      openPhotoModal: (photo) => set({ isPhotoModalOpen: true, selectedPhoto: photo }),
      closePhotoModal: () => set({ isPhotoModalOpen: false, selectedPhoto: null }),

      // ==================== 音乐控制 ====================
      toggleMusic: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTrack: (track) => set({ currentTrack: track }),

      // ==================== 错误处理 ====================
      clearError: () => set({ error: null }),

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
        currentTrack: state.currentTrack
      })
    }
  )
);
