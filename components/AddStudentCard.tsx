import React, { useState, useRef, useEffect } from 'react';

interface AddStudentCardProps {
  onSave: (names: string[]) => void;
  onCancel: () => void;
}

const AddStudentCard: React.FC<AddStudentCardProps> = ({ onSave, onCancel }) => {
  const [names, setNames] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameList = names
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (nameList.length > 0) {
      onSave(nameList);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 border-2 border-dashed border-indigo-400 dark:border-indigo-500">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">학생 추가</h2>
        <div>
          <label htmlFor="new-student-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">학생 이름 (한 줄에 한 명씩)</label>
          <textarea
            id="new-student-name"
            ref={textareaRef}
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="김철수&#10;이영희&#10;박민준"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors">
            저장
          </button>
          <button type="button" onClick={onCancel} className="w-full flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors">
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentCard;