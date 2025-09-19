import React, { useState, FormEvent } from 'react';
import type { Student, HistoryEntry, ViewMode } from '../types';
import HistoryModal from './HistoryModal';
import { HistoryIcon, TrashIcon, PlusIcon, MinusIcon } from './icons';

interface StudentCardProps {
  student: Student;
  onUpdate: (student: Student) => void;
  onDelete: (studentId: string) => void;
  viewMode: ViewMode;
  isSelected: boolean;
  onToggleSelection: (studentId: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdate, onDelete, viewMode, isSelected, onToggleSelection }) => {
  const [change, setChange] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [isHistoryVisible, setHistoryVisible] = useState(false);

  const isReadOnly = viewMode === 'student';

  const handleSubmit = (e: FormEvent, amount: number) => {
    e.preventDefault();
    if (viewMode === 'student') return; // Should not happen, but as a safeguard

    // In assistant mode, only allow subtraction
    if (viewMode === 'assistant' && amount > 0) {
        alert("보조 모드에서는 차감만 가능합니다.");
        return;
    }

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
    // 폼 초기화
    setReason('');
  };

  const countColor = student.count > 0 ? 'text-green-500' : student.count < 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400';

  const cardClickHandler = () => {
    if (viewMode === 'teacher') {
      onToggleSelection(student.id);
    }
  };

  return (
    <>
      <div 
        className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-200 ${isSelected ? 'ring-2 ring-indigo-500 shadow-indigo-200 dark:shadow-indigo-900/40' : 'hover:shadow-xl'} ${viewMode === 'teacher' ? 'cursor-pointer' : ''}`}
        onClick={cardClickHandler}
      >
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{student.name}</h2>
            <div className="flex items-center gap-3">
               {viewMode === 'teacher' && (
                <div 
                  className={`w-6 h-6 rounded-md border-2 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-500'} flex items-center justify-center transition-colors`}
                  aria-hidden="true"
                >
                  {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
              )}
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
          {viewMode !== 'student' && (
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
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
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
