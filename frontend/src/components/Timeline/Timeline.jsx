import { useState } from 'react';
import { MONTHS } from '../../utils/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 时间轴组件 - 横向月份滚动条
 */
export default function Timeline({
  selectedMonth,
  onMonthChange,
  monthStats = [],
  selectedYear,
  onYearChange
}) {
  const [yearInputMode, setYearInputMode] = useState(false);
  const [tempYear, setTempYear] = useState(selectedYear);

  // 2023年只显示10月开始的月份
  const getVisibleMonths = () => {
    if (selectedYear === 2023) {
      return MONTHS.slice(9);
    }
    return MONTHS;
  };

  const visibleMonths = getVisibleMonths();

  // 年份增减
  const handleYearChange = (delta) => {
    const newYear = selectedYear + delta;
    if (newYear >= 2023 && newYear <= 2030) {
      if (onYearChange) {
        onYearChange(newYear);
      } else {
        onMonthChange(selectedMonth, newYear);
      }
    }
  };

  // 快速跳转年份
  const handleYearInput = (e) => {
    e.preventDefault();
    const year = parseInt(tempYear);
    if (year >= 2023 && year <= 2030) {
      if (onYearChange) {
        onYearChange(year);
      } else {
        onMonthChange(selectedMonth, year);
      }
      setYearInputMode(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-white/95 via-white/90 to-transparent backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 标题和统计 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <h3 className="text-cherry-dark font-bold text-lg">
              {selectedYear}年 {visibleMonths[selectedYear === 2023 ? selectedMonth - 10 : selectedMonth - 1] >= 0 ? visibleMonths[selectedYear === 2023 ? selectedMonth - 10 : selectedMonth - 1] : MONTHS[selectedMonth - 1]}
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-1 shadow-md">
            <span className="text-cherry-bright">💕</span>
            <span className="text-sm font-medium text-cherry-dark">
              {monthStats[selectedMonth - 1]?.count || 0} 张回忆
            </span>
          </div>
        </div>

        {/* 月份滚动条 */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-cherry-pink scrollbar-track-cherry-light">
          {visibleMonths.map((month, index) => {
            const monthNum = selectedYear === 2023 ? index + 10 : index + 1;
            const statsIndex = monthNum - 1;
            const count = monthStats[statsIndex]?.count || 0;
            const isActive = selectedMonth === monthNum;

            return (
              <button
                key={monthNum}
                onClick={() => onMonthChange(monthNum)}
                className={`
                  group flex-shrink-0 px-5 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200 scale-105'
                    : 'bg-white/80 hover:bg-white hover:scale-105 shadow-md'
                  }
                `}
              >
                {!isActive && count > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-100 opacity-50" />
                )}

                <div className="relative text-center">
                  <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-cherry-dark'}`}>
                    {month}
                  </div>
                  {count > 0 && (
                    <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${isActive ? 'text-white/90' : 'text-pink-400'}`}>
                      <span>💕</span>
                      <span>{count}张</span>
                    </div>
                  )}
                  {count === 0 && (
                    <div className={`text-xs mt-1 ${isActive ? 'text-white/60' : 'text-pink-300'}`}>
                      -
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 年份控制 */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {/* 减少年份按钮 */}
          <button
            onClick={() => handleYearChange(-1)}
            disabled={selectedYear <= 2023}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${selectedYear <= 2023
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-white hover:bg-pink-50 hover:scale-110 text-cherry-dark shadow-md cursor-pointer'
              }
            `}
          >
            <ChevronLeft size={18} />
          </button>

          {/* 年份显示/输入 */}
          {yearInputMode ? (
            <form onSubmit={handleYearInput} className="flex items-center gap-2">
              <input
                type="number"
                value={tempYear}
                onChange={(e) => setTempYear(e.target.value)}
                min={2023}
                max={2030}
                className="w-20 px-2 py-1 rounded-full border-2 border-cherry-pink text-center font-bold text-cherry-dark focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-cherry-pink text-white rounded-full text-sm hover:bg-cherry-bright"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setYearInputMode(false);
                  setTempYear(selectedYear);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-300"
              >
                ✕
              </button>
            </form>
          ) : (
            <div
              onClick={() => {
                setTempYear(selectedYear);
                setYearInputMode(true);
              }}
              className="cursor-pointer px-4 py-1 rounded-full hover:bg-white/80 transition-all"
            >
              <span className="text-lg font-bold text-cherry-dark">{selectedYear}</span>
              <span className="text-xs text-cherry-pink ml-1">▾</span>
            </div>
          )}

          {/* 增加年份按钮 */}
          <button
            onClick={() => handleYearChange(1)}
            disabled={selectedYear >= 2030}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${selectedYear >= 2030
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-white hover:bg-pink-50 hover:scale-110 text-cherry-dark shadow-md cursor-pointer'
              }
            `}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* 快速年份选择 */}
        {!yearInputMode && (
          <div className="flex justify-center gap-2 mt-2 flex-wrap">
            {[2023, 2024, 2025, 2026].map(year => (
              <button
                key={year}
                onClick={() => {
                  if (onYearChange) {
                    onYearChange(year);
                  } else {
                    onMonthChange(selectedMonth, year);
                  }
                }}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium transition-all relative overflow-hidden
                  ${selectedYear === year
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md scale-105'
                    : 'bg-white/80 hover:bg-white hover:scale-105 shadow'
                  }
                `}
              >
                {selectedYear === year && (
                  <div className="absolute inset-0 bg-white/20" />
                )}
                <span className="relative flex items-center gap-1">
                  {selectedYear === year && <span>🌸</span>}
                  {year}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
    </div>
  );
}
