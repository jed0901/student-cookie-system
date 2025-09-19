import React, { useState } from 'react';
import { PlusIcon, MinusIcon, CloseIcon } from './icons';

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onApply: (change: number, reason: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onApply,
  onSelectAll,
  onDeselectAll,
}) => {
  const [change, setChange] = useState<number>(1);
  const [reason, setReason] = useState('');

  const handleApply = (amount: number) => {
    onApply(amount, reason);
    setReason(''); // Reset reason after applying
  };

  const allSelected = selectedCount === totalCount;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)] z-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
              {selectedCount}명 선택됨
            </p>
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {allSelected ? '전체 선택 해제' : '전체 선택'}
            </button>
          </div>

          <div className="flex-grow flex flex-wrap items-center justify-center gap-3">
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="일괄 적용 사유"
              className="flex-grow min-w-[150px] px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              min="0"
              value={change}
              onChange={(e) => setChange(parseInt(e.target.value, 10) || 0)}
              className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
                <button onClick={() => handleApply(Math.abs(change))} className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors">
                  <PlusIcon className="w-5 h-5"/>
                  <span>추가</span>
                </button>
                <button onClick={() => handleApply(-Math.abs(change))} className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors">
                  <MinusIcon className="w-5 h-5"/>
                  <span>차감</span>
                </button>
            </div>
          </div>

          <button
            onClick={onDeselectAll}
            title="선택 취소"
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;
