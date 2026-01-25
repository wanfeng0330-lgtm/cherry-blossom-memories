import { useState, useEffect } from 'react';
import { X, Calendar, MessageSquare, Trash2, Edit2 } from 'lucide-react';

/**
 * 照片详情弹窗组件
 */
export default function PhotoModal({
  photo,
  isOpen,
  onClose,
  onDelete,
  onUpdate // 改名为更通用的update函数
}) {
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (photo) {
      setCaption(photo.caption || '');
      // 将日期转换为input date格式 (YYYY-MM-DD)
      const photoDate = new Date(photo.date);
      setDate(photoDate.toISOString().split('T')[0]);
    }
  }, [photo]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 同时更新备注和日期
      await onUpdate(photo._id, { caption, date: new Date(date).toISOString() });
      onClose();
    } catch (error) {
      alert('保存失败: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('确定要删除这张照片吗？')) {
      await onDelete(photo._id);
      onClose();
    }
  };

  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-cherry-light/30">
          <div className="flex items-center gap-2 text-cherry-dark/70">
            <Calendar size={18} />
            {isEditingDate ? (
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-2 py-1 rounded-lg border-2 border-cherry-pink focus:outline-none text-sm"
              />
            ) : (
              <span
                className="text-sm cursor-pointer hover:text-cherry-bright flex items-center gap-1"
                onClick={() => setIsEditingDate(true)}
              >
                {new Date(date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                <Edit2 size={12} />
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-red-100 transition-colors text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cherry-pink/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 照片 */}
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img
                src={photo.url || photo.thumbnail}
                alt="照片"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 信息 */}
            <div className="flex flex-col">
              {/* 日期编辑提示 */}
              {isEditingDate && (
                <div className="mb-4 p-3 bg-cherry-pink/20 rounded-xl border border-cherry-pink/40">
                  <p className="text-sm text-cherry-dark">
                    📅 修改日期后，照片会移动到新的月份
                  </p>
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-cherry-bright" />
                  <h3 className="text-lg font-semibold text-cherry-dark">
                    备注信息
                  </h3>
                </div>

                {caption ? (
                  <p className="text-cherry-dark/80 leading-relaxed whitespace-pre-wrap">
                    {caption}
                  </p>
                ) : (
                  <p className="text-cherry-dark/50 italic">
                    暂无备注
                  </p>
                )}
              </div>

              {/* 编辑备注 */}
              <div className="mt-4">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="写下这一刻的心情、情话或回忆..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-cherry-light focus:border-cherry-pink focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* 保存按钮 */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="mt-4 w-full btn-cherry disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? '保存中...' : '保存更改'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
