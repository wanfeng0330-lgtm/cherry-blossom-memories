import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { photoAPI, uploadAPI, audioAPI } from '../utils/api';

/**
 * 樱花树时光机 - 全局状态管理
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // ==================== 状态 ====================
      photos: [],
      selectedMonth: 10,  // 从2023年10月开始
      selectedYear: 2023,
      isLoading: false,
      error: null,
      uploadProgress: 0,

      // UI状态
      isUploadModalOpen: false,
      isPhotoModalOpen: false,
      selectedPhoto: null,
      isAudioUploadModalOpen: false,

      // 音频状态
      audios: [],
      isPlaying: false,
      currentTrackIndex: 0,

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

      // ==================== 音频操作 ====================
      fetchAudios: async () => {
        set({ error: null });
        try {
          const data = await audioAPI.getAll();
          set({ audios: data.data || data });
        } catch (error) {
          set({ error: error.message });
        }
      },

      uploadAudio: async (file, title, artist) => {
        set({ isLoading: true, uploadProgress: 0, error: null });
        try {
          // 上传音频文件
          const uploadResult = await uploadAPI.uploadAudio(file, (progress) => {
            set({ uploadProgress: progress });
          });

          // 创建音频记录
          const audioData = {
            title,
            artist: artist || '未知艺术家',
            url: uploadResult.data.url,
            duration: 0,
            metadata: {
              size: uploadResult.data.size,
              mimeType: uploadResult.data.mimeType,
              format: uploadResult.data.format
            }
          };

          const newAudio = await audioAPI.create(audioData);

          // 重新获取所有音频
          await get().fetchAudios();

          set({ isLoading: false, uploadProgress: 100 });

          return newAudio.data || newAudio;
        } catch (error) {
          set({ error: error.message, isLoading: false, uploadProgress: 0 });
          throw error;
        }
      },

      deleteAudio: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await audioAPI.delete(id);
          set((state) => ({
            audios: state.audios.filter((a) => a._id !== id),
            currentTrackIndex: 0,
            isPlaying: false,
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

      openAudioUploadModal: () => set({ isAudioUploadModalOpen: true }),
      closeAudioUploadModal: () => set({ isAudioUploadModalOpen: false }),

      // ==================== 音乐控制 ====================
      toggleMusic: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),

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
        currentTrackIndex: state.currentTrackIndex
      })
    }
  )
);
