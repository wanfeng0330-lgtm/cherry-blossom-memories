import { X } from 'lucide-react';

/**
 * 照片列表视图组件 - 竖向滚动列表
 */
export default function PhotoListView({
  isOpen,
  photos,
  selectedYear,
  selectedMonth,
  onClose,
  onPhotoClick
}) {
  if (!isOpen) return null;
  // 过滤当前月份的照片
  const currentMonthPhotos = photos.filter(p => {
    const date = new Date(p.date);
    return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (currentMonthPhotos.length === 0) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center" onClick={e => e.stopPropagation()}>
          <p className="text-pink-500">这个月份还没有照片哦~</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-2xl md:rounded-3xl w-full max-w-2xl mx-2 md:mx-4 max-h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-pink-100 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-pink-500">
            {selectedYear}年{selectedMonth}月 ({currentMonthPhotos.length}张)
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 rounded-full hover:bg-pink-100 transition-colors"
          >
            <X size={18} md:size={20} className="text-pink-500" />
          </button>
        </div>

        {/* 照片列表 */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {currentMonthPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-105"
                onClick={() => onPhotoClick(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || '照片'}
                  className="w-full h-full object-cover"
                />
                {/* 序号 */}
                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
