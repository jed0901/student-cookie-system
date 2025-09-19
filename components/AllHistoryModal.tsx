import React from 'react';
import type { CombinedHistoryEntry } from '../types';
import { CloseIcon } from './icons';

interface AllHistoryModalProps {
  history: CombinedHistoryEntry[];
  onClose: () => void;
}

const AllHistoryModal: React.FC<AllHistoryModalProps> = ({ history, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-history-modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="all-history-modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
            전체 학생 변경 이력
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="닫기">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-4 overflow-y-auto">
          {history.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="sticky top-0 bg-slate-50 dark:bg-slate-700 p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600">시간</th>
                  <th className="sticky top-0 bg-slate-50 dark:bg-slate-700 p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600">학생</th>
                  <th className="sticky top-0 bg-slate-50 dark:bg-slate-700 p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600 text-center">변경값</th>
                  <th className="sticky top-0 bg-slate-50 dark:bg-slate-700 p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600">사유</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString('ko-KR', {
                        year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-3 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
                        {entry.studentName}
                    </td>
                    <td className={`p-3 border-b border-slate-200 dark:border-slate-700 text-center font-mono font-semibold ${entry.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {entry.change > 0 ? `+${entry.change}` : entry.change}
                    </td>
                    <td className="p-3 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {entry.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">변경 이력이 없습니다.</p>
          )}
        </main>
        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 text-right">
            <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
                닫기
            </button>
        </footer>
      </div>
    </div>
  );
};

export default AllHistoryModal;
