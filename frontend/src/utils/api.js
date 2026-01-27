import axios from 'axios';
import { API_ENDPOINTS } from './constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

/**
 * 照片相关API
 */
export const photoAPI = {
  // 获取所有照片
  getAll: () => api.get(API_ENDPOINTS.photos),

  // 获取单张照片
  getById: (id) => api.get(`${API_ENDPOINTS.photos}/${id}`),

  // 按月份获取照片
  getByMonth: (month, year) =>
    api.get(`${API_ENDPOINTS.photos}/month/${month}`, { params: { year } }),

  // 创建照片记录
  create: (data) => api.post(API_ENDPOINTS.photos, data),

  // 更新照片
  update: (id, data) => api.put(`${API_ENDPOINTS.photos}/${id}`, data),

  // 删除照片
  delete: (id) => api.delete(`${API_ENDPOINTS.photos}/${id}`)
};

/**
 * 音频相关API
 */
export const audioAPI = {
  // 获取所有音频
  getAll: () => api.get('/api/audio'),

  // 获取单个音频
  getById: (id) => api.get(`/api/audio/${id}`),

  // 创建音频记录
  create: (data) => api.post('/api/audio', data),

  // 更新音频
  update: (id, data) => api.put(`/api/audio/${id}`, data),

  // 删除音频
  delete: (id) => api.delete(`/api/audio/${id}`)
};

/**
 * 文件上传API
 */
export const uploadAPI = {
  // 上传图片 - 转换为base64后直接发送原始数据
  uploadImage: async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (onProgress && e.lengthComputable) {
          const percentCompleted = Math.round((e.loaded / e.total) * 100);
          onProgress(percentCompleted);
        }
      };

      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);

          // 直接发送文件数据，后端会转换为base64
          const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': file.type
            },
            body: uint8Array
          });

          const result = await response.json();

          if (result.success) {
            resolve(result);
          } else {
            reject(new Error(result.message || '上传失败'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsArrayBuffer(file);
    });
  },

  // 上传音频文件
  uploadAudio: async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (onProgress && e.lengthComputable) {
          const percentCompleted = Math.round((e.loaded / e.total) * 100);
          onProgress(percentCompleted);
        }
      };

      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);

          // 发送文件数据
          const response = await fetch(`${API_URL}/api/upload/audio`, {
            method: 'POST',
            headers: {
              'Content-Type': file.type
            },
            body: uint8Array
          });

          const result = await response.json();

          if (result.success) {
            resolve(result);
          } else {
            reject(new Error(result.message || '上传失败'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsArrayBuffer(file);
    });
  },

  // 批量上传
  uploadMultiple: async (files, onProgress) => {
    const promises = files.map((file, index) =>
      uploadAPI.uploadImage(file, (progress) => {
        if (onProgress) {
          const totalProgress = ((index * 100 + progress) / files.length);
          onProgress(totalProgress);
        }
      })
    );

    return Promise.all(promises);
  }
};

/**
 * 获取上传Token
 */
export const getUploadToken = () => api.get('/api/upload/token');

export default api;
