import { useState, useCallback } from 'react';
import { X, Upload, Calendar, MessageSquare } from 'lucide-react';
import { FILE_UPLOAD } from '../../utils/constants';

/**
 * 照片上传组件
 */
export default function PhotoUpload({ isOpen, onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(file => {
      if (!FILE_UPLOAD.allowedTypes.includes(file.type)) {
        alert(`不支持的文件类型: ${file.type}`);
        return false;
      }
      if (file.size > FILE_UPLOAD.maxSize) {
        alert(`文件太大: ${file.name} (最大10MB)`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);

    // 生成预览
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        await onUpload(file, date, caption);
      }

      // 重置表单
      setFiles([]);
      setPreviews([]);
      setCaption('');
      onClose();
    } catch (error) {
      alert('上传失败: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-2">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-2xl mx-2 md:mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-cherry-pink to-cherry-bright p-4 md:p-6 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg md:text-2xl font-semibold text-white">上传美好回忆</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={20} md:size={24} />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {/* 拖拽区域 */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              drag-zone border-2 border-dashed rounded-xl md:rounded-2xl p-4 md:p-8
              ${isDragging ? 'border-cherry-bright bg-cherry-pink/10' : 'border-cherry-pink'}
              transition-all duration-300
            `}
          >
            <div className="text-center">
              <Upload className="mx-auto mb-2 md:mb-4 text-cherry-pink" size={32} md:size={48} />
              <p className="text-sm md:text-lg text-cherry-dark mb-1 md:mb-2">
                拖拽照片到这里，或点击选择
              </p>
              <p className="text-xs md:text-sm text-cherry-dark/60">
                支持 JPG, PNG, GIF, WebP 格式，最大 10MB
              </p>
              <input
                type="file"
                multiple
                accept={FILE_UPLOAD.allowedTypes.join(',')}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="inline-block mt-2 md:mt-4 btn-cherry cursor-pointer text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              >
                选择照片
              </label>
            </div>
          </div>

          {/* 预览 */}
          {previews.length > 0 && (
            <div className="mt-3 md:mt-4 grid grid-cols-4 gap-2 md:gap-3 max-h-32 md:max-h-48 overflow-y-auto">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`预览 ${index + 1}`}
                    className="w-full h-16 md:h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 md:p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} md:size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 日期选择 */}
          <div className="mt-4 md:mt-6">
            <label className="flex items-center gap-2 text-cherry-dark font-medium mb-2 text-sm md:text-base">
              <Calendar size={14} md:size={18} />
              拍摄日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-cherry-light focus:border-cherry-pink focus:outline-none transition-colors text-sm md:text-base"
            />
          </div>

          {/* 备注输入 */}
          <div className="mt-3 md:mt-4">
            <label className="flex items-center gap-2 text-cherry-dark font-medium mb-2 text-sm md:text-base">
              <MessageSquare size={14} md:size={18} />
              添加备注 / 情话
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="写下这一刻的心情..."
              rows={2}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-cherry-light focus:border-cherry-pink focus:outline-none transition-colors resize-none text-sm md:text-base"
            />
          </div>

          {/* 操作按钮 */}
          <div className="mt-4 md:mt-6 flex gap-2 md:gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl border-2 border-cherry-pink text-cherry-pink font-medium hover:bg-cherry-pink/10 transition-colors disabled:opacity-50 text-sm md:text-base"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              className="flex-1 btn-cherry disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base py-2 md:py-3"
            >
              {isUploading ? '上传中...' : '上传照片'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
