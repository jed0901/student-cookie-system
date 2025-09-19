import React from 'react';
import { CloseIcon, PlusIcon, HistoryIcon, ResetIcon, TrashIcon, KeyIcon } from './icons';

interface SettingsModalProps {
    onClose: () => void;
    onAddStudent: () => void;
    onShowAllHistory: () => void;
    onResetTeacherPin: () => void;
    onSetOrResetAssistantPin: () => void;
    onResetData: () => void;
    hasAssistantPin: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    onClose, onAddStudent, onShowAllHistory, onResetTeacherPin, onSetOrResetAssistantPin, onResetData, hasAssistantPin
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="settings-modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
            설정
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="닫기">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingsButton
                icon={<PlusIcon className="w-6 h-6"/>}
                label="학생 추가"
                description="새로운 학생을 목록에 등록합니다."
                onClick={onAddStudent}
            />
            <SettingsButton
                icon={<HistoryIcon className="w-6 h-6"/>}
                label="전체 이력 보기"
                description="모든 학생의 변경 기록을 봅니다."
                onClick={onShowAllHistory}
            />
             <SettingsButton
                icon={<KeyIcon className="w-6 h-6"/>}
                label={hasAssistantPin ? "보조 PIN 재설정" : "보조 PIN 설정"}
                description="보조 관리자용 PIN을 설정하거나 변경합니다."
                onClick={onSetOrResetAssistantPin}
            />
            <SettingsButton
                icon={<ResetIcon className="w-6 h-6"/>}
                label="교사 PIN 재설정"
                description="교사 계정의 보안 PIN을 초기화합니다."
                onClick={onResetTeacherPin}
                isDestructive={true}
            />
            <SettingsButton
                icon={<TrashIcon className="w-6 h-6"/>}
                label="전체 데이터 초기화"
                description="모든 학생 데이터를 삭제합니다."
                onClick={onResetData}
                isDestructive={true}
            />
        </main>
      </div>
    </div>
  );
};

interface SettingsButtonProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    isDestructive?: boolean;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ icon, label, description, onClick, isDestructive }) => (
    <button 
        onClick={onClick} 
        className={`p-4 rounded-lg text-left transition-colors flex flex-col items-start justify-between h-full ${
            isDestructive 
                ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
        }`}
    >
        <div>
            <div className={`flex items-center gap-3 mb-2 ${isDestructive ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {icon}
                <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{label}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </button>
)

export default SettingsModal;
