import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './icons';
import type { ViewMode, PinModalMode, PinType } from '../types';

interface PinModalProps {
  mode: PinModalMode;
  targetMode: ViewMode | null;
  onClose: () => void;
  onSetPin: (pin: string, type: PinType) => void;
  onConfirmPin: (pin: string) => void;
  error?: string;
}

const PinModal: React.FC<PinModalProps> = ({ mode, targetMode, onClose, onSetPin, onConfirmPin, error }) => {
  const [pin, setPin] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getTitle = () => {
    if (mode === 'set-teacher') return '교사 PIN 설정';
    if (mode === 'set-assistant') return '보조 PIN 설정';
    return 'PIN 입력';
  };

  const getDescription = () => {
    if (mode === 'set-teacher') return '교사 모드 접근에 사용할 4자리 숫자를 입력하세요. 이 PIN은 모든 관리 기능에 사용됩니다.';
    if (mode === 'set-assistant') {
        if (targetMode === 'assistant') {
            return '보조 모드에 처음으로 접근하려면 PIN을 설정해야 합니다.';
        }
        return '보조 모드 접근에 사용할 4자리 숫자를 입력하세요.';
    }
    if (targetMode === 'assistant') return '보조 모드로 전환하려면 PIN을 입력하세요.';
    return '교사 모드로 전환하려면 PIN을 입력하세요.';
  };

  const getButtonText = () => {
    if (mode === 'set-teacher') {
        if (targetMode === 'teacher') return '설정하고 교사 모드로 전환';
        return '설정하고 학생 모드로 전환';
    }
    if (mode === 'set-assistant') {
        if (targetMode === 'assistant') return '설정하고 보조 모드로 전환';
        return '설정';
    }
    return '확인';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow up to 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
        alert("PIN은 4자리 숫자여야 합니다.");
        return;
    }

    if (mode === 'set-teacher') {
      onSetPin(pin, 'teacher');
    } else if (mode === 'set-assistant') {
      onSetPin(pin, 'assistant');
    } else {
      onConfirmPin(pin);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-sm flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="pin-modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {getTitle()}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="닫기">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6">
          <form onSubmit={handleSubmit}>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{getDescription()}</p>
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              value={pin}
              onChange={handleChange}
              className="w-full text-center text-3xl tracking-[1rem] font-mono px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={4}
              autoComplete="off"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-6">
                 <button type="button" onClick={onClose} className="w-full flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors">
                    취소
                 </button>
                 <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-50" disabled={pin.length !== 4}>
                    {getButtonText()}
                 </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default PinModal;