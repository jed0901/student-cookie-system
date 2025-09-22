import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { MinusIcon, CloseIcon, PlusIcon } from './icons';

interface BulkActionFormProps {
    selectedCount: number;
    onSubmit: (amount: number, reason: string, action: 'add' | 'subtract') => void;
    onClearSelection: () => void;
    mode: 'add-subtract' | 'subtract-only';
}

const BulkActionForm: React.FC<BulkActionFormProps> = ({ selectedCount, onSubmit, onClearSelection, mode }) => {
    const [amount, setAmount] = useState<number>(1);
    const [reason, setReason] = useState('');
    const reasonInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Only focus if the input is not already focused to avoid disrupting user typing
        if (document.activeElement !== reasonInputRef.current) {
             reasonInputRef.current?.focus();
        }
    }, []);

    const handleAction = (action: 'add' | 'subtract') => {
        if (!reason.trim()) {
            alert("사유를 입력해주세요.");
            reasonInputRef.current?.focus();
            return;
        }
        if (amount <= 0) {
            alert("변경할 값을 양수로 입력해주세요.");
            return;
        }
        onSubmit(amount, reason, action);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-20" role="dialog" aria-modal="true" aria-labelledby="bulk-action-heading">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] animate-slide-up">
                <div className="container mx-auto max-w-4xl">
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-full sm:w-auto text-center sm:text-left">
                            <h3 id="bulk-action-heading" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCount}명</span>
                                <span>의 학생에게 일괄 적용</span>
                            </h3>
                        </div>
                        
                        <div className="flex-grow w-full">
                            <label htmlFor="bulk-reason" className="sr-only">사유</label>
                            <input
                                id="bulk-reason"
                                ref={reasonInputRef}
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="적용 사유"
                                required
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex-shrink-0 w-auto">
                            <label htmlFor="bulk-amount" className="sr-only">변경 값 (양수 입력)</label>
                            <input
                                id="bulk-amount"
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                required
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        <div className="flex gap-3 w-full sm:w-auto">
                             {mode === 'add-subtract' && (
                                <button
                                    type="button"
                                    onClick={() => handleAction('add')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                                >
                                    <PlusIcon className="w-5 h-5"/>
                                    <span>추가</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => handleAction('subtract')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                            >
                                <MinusIcon className="w-5 h-5"/>
                                <span>차감</span>
                            </button>
                            <button
                                type="button"
                                onClick={onClearSelection}
                                title="선택 취소"
                                aria-label="선택 취소"
                                className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                            >
                               <CloseIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
             <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default BulkActionForm;