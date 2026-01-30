import { useState } from 'react';
import { MONTHS } from '../../utils/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 固定起始日期：2023年10月
const START_YEAR = 2023;
const START_MONTH = 10;

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

  // 获取可见月份 - 从2023年10月开始
  const getVisibleMonths = () => {
    if (selectedYear === START_YEAR) {
      // 2023年只显示从10月开始的月份
      return MONTHS.slice(START_MONTH - 1);
    }
    // 其他年份显示全部月份
    return MONTHS;
  };

  const visibleMonths = getVisibleMonths();

  // 年份增减
  const handleYearChange = (delta) => {
    const newYear = selectedYear + delta;
    if (newYear >= START_YEAR) {
      onYearChange(newYear);
      // 如果切换到起始年份，月份设为10月
      if (newYear === START_YEAR) {
        onMonthChange(START_MONTH, newYear);
      } else {
        onMonthChange(selectedMonth, newYear);
      }
    }
  };

  // 选择月份
  const handleMonthSelect = (monthNum) => {
    onMonthChange(monthNum, selectedYear);
  };

  // 年份输入确认
  const handleYearSubmit = (e) => {
    e.preventDefault();
    const year = parseInt(tempYear);
    if (year >= START_YEAR && year <= START_YEAR + 100) {
      onYearChange(year);
      if (year === START_YEAR) {
        onMonthChange(START_MONTH, year);
      }
    }
    setYearInputMode(false);
  };

  // 获取当前选中月份的显示名称
  const getSelectedMonthName = () => {
    if (selectedYear === START_YEAR && selectedMonth < START_MONTH) {
      return MONTHS[START_MONTH - 1];
    }
    return MONTHS[selectedMonth - 1];
  };

  return (
    <div className="z-50 bg-gradient-to-t from-white/95 via-white/90 to-transparent backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-3 py-4 md:px-4 md:py-6">
        {/* 标题和统计 */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl">🌸</span>
            <h3 className="text-cherry-dark font-bold text-sm md:text-lg">
              {selectedYear}年 {getSelectedMonthName()}
            </h3>
          </div>
          <div className="flex items-center gap-1 md:gap-2 bg-white/80 rounded-full px-2 md:px-4 py-1 shadow-md">
            <span className="text-cherry-bright text-sm md:text-base">💕</span>
            <span className="text-xs md:text-sm font-medium text-cherry-dark">
              {monthStats[selectedMonth - 1]?.count || 0} 张
            </span>
          </div>
        </div>

        {/* 年份选择 */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-2 md:mb-4">
          <button
            onClick={() => handleYearChange(-1)}
            disabled={selectedYear <= START_YEAR}
            className="p-1 md:p-2 rounded-full hover:bg-pink-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} md:size={20} className="text-cherry-dark" />
          </button>

          {yearInputMode ? (
            <form onSubmit={handleYearSubmit} className="flex items-center gap-2">
              <input
                type="number"
                value={tempYear}
                onChange={(e) => setTempYear(e.target.value)}
                className="w-16 md:w-20 px-2 md:px-3 py-1 border-2 border-pink-200 rounded-full text-center focus:border-pink-400 focus:outline-none text-sm md:text-base"
                min={START_YEAR}
                autoFocus
              />
              <button
                type="submit"
                className="px-2 md:px-3 py-1 bg-pink-400 text-white rounded-full text-xs md:text-sm hover:bg-pink-500"
              >
                确定
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTempYear(selectedYear);
                setYearInputMode(true);
              }}
              className="px-4 md:px-6 py-1.5 md:py-2 bg-white/80 rounded-full shadow-md font-medium text-cherry-dark hover:bg-pink-50 transition-colors text-sm md:text-base"
            >
              {selectedYear}
            </button>
          )}

          <button
            onClick={() => handleYearChange(1)}
            className="p-1 md:p-2 rounded-full hover:bg-pink-100 transition-colors"
          >
            <ChevronRight size={16} md:size={20} className="text-cherry-dark" />
          </button>
        </div>

        {/* 月份滚动条 */}
        <div className="flex gap-2 md:gap-2 overflow-x-auto pb-2 md:pb-3 scrollbar-thin scrollbar-thumb-cherry-pink scrollbar-track-cherry-light">
          {visibleMonths.map((month, index) => {
            const monthNum = selectedYear === START_YEAR ? index + START_MONTH : index + 1;
            const statsIndex = monthNum - 1;
            const count = monthStats[statsIndex]?.count || 0;
            const isSelected = selectedMonth === monthNum;

            return (
              <button
                key={month}
                onClick={() => handleMonthSelect(monthNum)}
                className={`
                  relative flex-shrink-0 px-4 md:px-4 py-3 md:py-2 rounded-xl md:rounded-xl transition-all duration-300
                  ${isSelected
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105 md:scale-110'
                    : 'bg-white/80 text-cherry-dark hover:bg-pink-100 shadow-md'
                  }
                `}
              >
                {/* 选中时的光晕 */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-rose-100 opacity-50 rounded-xl md:rounded-xl animate-pulse" />
                )}

                <span className="relative z-10 text-sm md:text-sm font-medium">{month}</span>

                {/* 照片数量 */}
                {count > 0 && (
                  <span className={`
                    absolute -top-1 -right-1 md:-top-1 md:-right-1 w-5 h-5 md:w-5 md:h-5 rounded-full text-xs md:text-xs flex items-center justify-center font-bold
                    ${isSelected ? 'bg-white text-pink-500' : 'bg-pink-400 text-white'}
                  `}>
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 快速年份跳转 */}
        <div className="flex justify-center gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => START_YEAR + i).map((year) => (
            <button
              key={year}
              onClick={() => {
                onYearChange(year);
                if (year === START_YEAR) {
                  onMonthChange(START_MONTH, year);
                }
              }}
              className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs transition-colors ${
                selectedYear === year
                  ? 'bg-pink-400 text-white'
                  : 'bg-white/60 text-cherry-dark hover:bg-pink-100'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
    </div>
  );
}
