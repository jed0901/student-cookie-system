import React from 'react';
import type { ViewMode } from '../types';
import { UndoIcon, DownloadIcon, UploadIcon, EyeIcon, LockIcon, ShieldCheckIcon, SettingsIcon, GridIcon, PencilSquareIcon } from './icons';

interface HeaderProps {
  onUndo: () => void;
  canUndo: boolean;
  onExport: () => void;
  onImportClick: () => void;
  viewMode: ViewMode;
  onEnterStudentMode: () => void;
  onEnterOverviewMode: () => void;
  onExitOverviewMode: () => void;
  onRequestTeacherMode: () => void;
  onRequestAssistantMode: () => void;
  onExitAssistantMode: () => void;
  onOpenSettings: () => void;
  onSelectAll?: () => void;
  numStudents?: number;
  numSelected?: number;
  isTeacherSelectionMode?: boolean;
  onToggleTeacherSelectionMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onUndo, canUndo, onExport, onImportClick,
  viewMode, onEnterStudentMode, onEnterOverviewMode, onExitOverviewMode, onRequestTeacherMode, onRequestAssistantMode, onExitAssistantMode,
  onOpenSettings, onSelectAll, numStudents = 0, numSelected = 0, isTeacherSelectionMode, onToggleTeacherSelectionMode
}) => {
  const getTitle = () => {
    switch (viewMode) {
      case 'teacher':
        return isTeacherSelectionMode ? '일괄 편집 모드' : '학생 쿠키 관리 시스템';
      case 'student':
        return '학생 쿠키 현황';
      case 'assistant':
        return '보조 모드 (일괄 차감)';
      case 'overview':
        return '전체 쿠키 현황';
      default:
        return '학생 관리';
    }
  };

  const isAllSelected = numStudents > 0 && numStudents === numSelected;

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          <i className="fas fa-user-graduate mr-2"></i>
          {getTitle()}
        </h1>
        <div className="flex items-center gap-2">
          {viewMode === 'teacher' && (
            isTeacherSelectionMode ? (
              <>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">
                    {numSelected} / {numStudents} 선택됨
                </span>
                <button onClick={onSelectAll} className="control-button">
                    {isAllSelected ? '전체 해제' : '전체 선택'}
                </button>
                <button onClick={onToggleTeacherSelectionMode} title="선택 모드 종료" className="action-button">
                  <span className="hidden sm:inline">종료</span>
                </button>
              </>
            ) : (
            <>
              <button onClick={onImportClick} title="데이터 가져오기 (JSON)" className="control-button">
                <UploadIcon className="w-4 h-4" />
                <span className="hidden sm:inline">가져오기</span>
              </button>
              <button onClick={onExport} title="데이터 내보내기 (JSON)" className="control-button">
                <DownloadIcon className="w-4 h-4" />
                <span className="hidden sm:inline">내보내기</span>
              </button>
              <button onClick={onUndo} disabled={!canUndo} title="마지막 작업 실행 취소" className="control-button disabled:opacity-50 disabled:cursor-not-allowed">
                <UndoIcon className="w-4 h-4" />
                <span className="hidden sm:inline">실행 취소</span>
              </button>
               <button onClick={onToggleTeacherSelectionMode} title="일괄 편집" className="control-button">
                <PencilSquareIcon className="w-4 h-4" />
                <span className="hidden sm:inline">일괄 편집</span>
              </button>
              <button onClick={onEnterOverviewMode} title="전체 현황 보기" className="control-button">
                <GridIcon className="w-4 h-4" />
                <span className="hidden sm:inline">전체보기</span>
              </button>
              <button onClick={onOpenSettings} title="설정" className="control-button">
                 <SettingsIcon className="w-4 h-4" />
                 <span className="hidden sm:inline">설정</span>
              </button>
              <button onClick={onEnterStudentMode} title="학생 모드로 전환" className="action-button">
                <EyeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">학생 모드</span>
              </button>
            </>
            )
          )}
          {viewMode === 'student' && (
            <>
              <button onClick={onRequestTeacherMode} title="교사 모드로 전환" className="control-button">
                <LockIcon className="w-4 h-4" />
                <span className="hidden sm:inline">교사</span>
              </button>
              <button onClick={onRequestAssistantMode} title="보조 모드로 전환" className="control-button">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">보조</span>
              </button>
            </>
          )}
          {viewMode === 'assistant' && (
            <>
              <button onClick={onUndo} disabled={!canUndo} title="마지막 작업 실행 취소" className="control-button disabled:opacity-50 disabled:cursor-not-allowed">
                <UndoIcon className="w-4 h-4" />
                <span className="hidden sm:inline">실행 취소</span>
              </button>
              {numStudents > 0 && (
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">
                        {numSelected} / {numStudents} 선택됨
                    </span>
                    <button onClick={onSelectAll} className="control-button">
                        {isAllSelected ? '전체 해제' : '전체 선택'}
                    </button>
                </div>
              )}
              <button onClick={onExitAssistantMode} title="학생 모드로 돌아가기" className="action-button">
                  <EyeIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">돌아가기</span>
              </button>
            </>
          )}
          {viewMode === 'overview' && (
            <button onClick={onExitOverviewMode} title="상세보기로 돌아가기" className="action-button">
                <i className="fas fa-list-alt mr-2"></i>
                상세보기
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;