import { useState } from 'react';
import { Music, Upload, Loader2 } from 'lucide-react';

export default function AudioUpload({ isOpen, onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate audio format
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('请选择有效的音频文件 (MP3, WAV, OGG, M4A)');
        return;
      }
      // Validate size (20MB)
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('音频文件大小不能超过20MB');
        return;
      }
      setFile(selectedFile);
      setError('');

      // Auto-fill title if empty
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      if (!file) {
        throw new Error('请选择音频文件');
      }

      // Step 1: Upload audio file
      setUploadProgress(20);
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const uploadResponse = await fetch('http://localhost:3001/api/upload/audio', {
        method: 'POST',
        headers: {
          'Content-Type': file.type
        },
        body: uint8Array
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(uploadResult.message || '上传失败');
      }

      setUploadProgress(60);

      // Step 2: Create audio record
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

      const createResponse = await fetch('http://localhost:3001/api/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(audioData)
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok || !createResult.success) {
        throw new Error(createResult.message || '保存失败');
      }

      setUploadProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(createResult.data);
      }

      // Reset form
      setTitle('');
      setArtist('');
      setFile(null);

      setTimeout(() => {
        onClose();
      }, 500);

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-400 to-pink-400">
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white/50"
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  fontSize: '12px',
                  animation: 'float 3s ease-in-out infinite'
                }}
              >
                🎵
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          ✕
        </button>

        <div className="relative pt-20 px-8 pb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-3">
              <Music size={32} className="text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              上传音乐
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              为你们的回忆添加背景音乐
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                音频文件
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="audio-file-input"
                  disabled={uploading}
                />
                <label
                  htmlFor="audio-file-input"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    file
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {file ? (
                    <span className="text-sm text-purple-600 truncate">
                      🎵 {file.name}
                    </span>
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        点击选择音频文件
                      </span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                支持 MP3, WAV, OGG, M4A 格式，最大20MB
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                歌曲标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="输入歌曲标题"
                required
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                艺术家（可选）
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="例如：周杰伦"
                disabled={uploading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <Loader2 size={16} className="animate-spin" />
                  <span>上传中... {uploadProgress}%</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '上传中...' : '上传音乐'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
