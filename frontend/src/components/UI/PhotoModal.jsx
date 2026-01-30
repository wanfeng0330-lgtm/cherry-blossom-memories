import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * 照片详情弹窗组件（静态版本，仅查看）
 */
export default function PhotoModal({
  photo,
  isOpen,
  onClose
}) {
  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl mx-2 md:mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-end p-3 md:p-4 border-b border-cherry-light/30 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 rounded-full hover:bg-cherry-pink/20 transition-colors"
          >
            <X size={14} md:size={18} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-3 md:p-6 overflow-y-auto flex-1">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            {/* 照片 */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img
                src={photo.url}
                alt="照片"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 备注信息 */}
            <div className="w-full">
              <div className="bg-pink-50 rounded-xl p-4 md:p-6">
                <p className="text-sm md:text-base text-cherry-dark/80 text-center whitespace-pre-wrap">
                  {photo.caption || '暂无备注'}
                </p>
                <p className="text-xs md:text-sm text-cherry-dark/50 text-center mt-3">
                  {new Date(photo.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
