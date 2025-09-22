import React, { useState, FormEvent } from 'react';
import type { Student, HistoryEntry, ViewMode } from '../types';
import HistoryModal from './HistoryModal';
import { HistoryIcon, TrashIcon, PlusIcon, MinusIcon } from './icons';

interface StudentCardProps {
  student: Student;
  onUpdate: (student: Student) => void;
  onDelete: (studentId: string) => void;
  viewMode: ViewMode;
  isSelected?: boolean;
  onToggleSelection?: (studentId: string) => void;
  isSelectionActive?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdate, onDelete, viewMode, isSelected, onToggleSelection, isSelectionActive }) => {
  const [change, setChange] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [isHistoryVisible, setHistoryVisible] = useState(false);

  const isReadOnly = viewMode === 'student';

  const handleSubmit = (e: FormEvent, amount: number) => {
    e.preventDefault();
    if (isReadOnly || isSelectionActive) return;

    if (!reason.trim()) {
      alert("사유를 입력해주세요.");
      return;
    }

    const newHistoryEntry: HistoryEntry = {
      id: `history-${Date.now()}`,
      timestamp: Date.now(),
      change: amount,
      reason: reason.trim(),
    };

    const updatedStudent: Student = {
      ...student,
      count: student.count + amount,
      history: [newHistoryEntry, ...student.history],
    };

    onUpdate(updatedStudent);
    setReason('');
  };

  const countColor = student.count > 0 ? 'text-green-500' : student.count < 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400';

  const handleCardClick = () => {
    if (isSelectionActive && onToggleSelection) {
      onToggleSelection(student.id);
    }
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col relative transition-all duration-200 ${isSelectionActive ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-indigo-500 shadow-xl scale-105' : 'hover:shadow-xl'}`}
        onClick={handleCardClick}
        role="button"
        aria-pressed={isSelected}
        tabIndex={isSelectionActive ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {isSelectionActive && (
          <div className="absolute top-3 right-3 z-10 bg-white/50 dark:bg-slate-900/50 rounded-full pointer-events-none">
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="h-6 w-6 rounded-full border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-0 focus:ring-offset-0"
              tabIndex={-1}
            />
          </div>
        )}

        <div className={`p-5 flex-grow ${isSelected && isSelectionActive ? 'opacity-80' : ''}`}>
          <div className={`flex justify-between items-start ${isSelectionActive ? 'pr-8' : ''}`}>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{student.name}</h2>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); setHistoryVisible(true); }} className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" title="변경 이력 보기">
                <HistoryIcon className="w-5 h-5" />
              </button>
              {viewMode === 'teacher' && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(student.id); }} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="학생 삭제">
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <p className={`text-5xl font-mono font-bold my-4 text-center ${countColor}`}>
            {student.count}
          </p>
          {!isReadOnly && !isSelectionActive && (
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()} onClick={e => e.stopPropagation()}>
              <div>
                <label htmlFor={`reason-${student.id}`} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">사유</label>
                <input
                  id={`reason-${student.id}`}
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="예: 과제 제출 우수"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor={`change-${student.id}`} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">변경 값 (양수 입력)</label>
                <input
                  id={`change-${student.id}`}
                  type="number"
                  min="0"
                  value={change}
                  onChange={(e) => setChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                {viewMode === 'teacher' && (
                    <button type="button" onClick={(e) => handleSubmit(e, Math.abs(change))} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors">
                      <PlusIcon className="w-5 h-5"/>
                      <span>추가</span>
                    </button>
                )}
                <button type="button" onClick={(e) => handleSubmit(e, -Math.abs(change))} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors">
                  <MinusIcon className="w-5 h-5"/>
                  <span>차감</span>
                </button>
              </div>
            </form>
          )}
           { isSelectionActive && (
            <div className="text-center text-slate-500 dark:text-slate-400 h-full flex items-center justify-center min-h-[180px]">
                <p>카드를 클릭하여 선택</p>
            </div>
          )}
        </div>
        <div className={`bg-slate-50 dark:bg-slate-700/50 px-5 py-3 text-xs text-slate-500 dark:text-slate-400 ${isSelected && isSelectionActive ? 'opacity-80' : ''}`}>
          마지막 변경: {student.history.length > 0 ? new Date(student.history[0].timestamp).toLocaleString('ko-KR') : '없음'}
        </div>
      </div>
      {isHistoryVisible && (
        <HistoryModal
          studentName={student.name}
          history={student.history}
          onClose={() => setHistoryVisible(false)}
        />
      )}
    </>
  );
};

export default StudentCard;