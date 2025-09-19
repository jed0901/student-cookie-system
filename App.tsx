import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Student, ViewMode, CombinedHistoryEntry, PinModalMode, PinType, HistoryEntry } from './types';
import Header from './components/Header';
import StudentCard from './components/StudentCard';
import AddStudentCard from './components/AddStudentCard';
import PinModal from './components/PinModal';
import SettingsModal from './components/SettingsModal';
import AllHistoryModal from './components/AllHistoryModal';
import ConfirmModal from './components/ConfirmModal';
import OverviewGrid from './components/OverviewGrid';
import BulkActionBar from './components/BulkActionBar';
import { PlusIcon } from './components/icons';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [previousStudents, setPreviousStudents] = useState<Student[] | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // View mode and PIN state
  const [viewMode, setViewMode] = useState<ViewMode>('teacher');
  const [teacherPin, setTeacherPin] = useState<string | null>(null);
  const [assistantPin, setAssistantPin] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<PinModalMode>('enter');
  const [pinTargetMode, setPinTargetMode] = useState<ViewMode | null>(null);
  const [pinError, setPinError] = useState<string>('');

  // Modal States
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAllHistoryModalOpen, setIsAllHistoryModalOpen] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    confirmText?: string;
  }>({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: '확인' });


  // Load students and PINs from localStorage on initial render
  useEffect(() => {
    try {
      const savedStudents = localStorage.getItem('student-score-tracker');
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      }
      const savedTeacherPin = localStorage.getItem('student-score-tracker-teacher-pin');
      if (savedTeacherPin) setTeacherPin(savedTeacherPin);

      const savedAssistantPin = localStorage.getItem('student-score-tracker-assistant-pin');
      if (savedAssistantPin) setAssistantPin(savedAssistantPin);
      
    } catch (error) {
      console.error("저장된 데이터를 불러오는 데 실패했습니다:", error);
    }
  }, []);

  // Save students to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('student-score-tracker', JSON.stringify(students));
    } catch (error) {
      console.error("학생 데이터를 저장하는 데 실패했습니다:", error);
    }
  }, [students]);

  // Save PINs to localStorage when they change
  useEffect(() => {
    try {
      if (teacherPin) localStorage.setItem('student-score-tracker-teacher-pin', teacherPin);
      else localStorage.removeItem('student-score-tracker-teacher-pin');

      if (assistantPin) localStorage.setItem('student-score-tracker-assistant-pin', assistantPin);
      else localStorage.removeItem('student-score-tracker-assistant-pin');
    } catch (error) {
      console.error("PIN을 저장하는 데 실패했습니다:", error);
    }
  }, [teacherPin, assistantPin]);

  const updateStateAndUndo = useCallback((newState: Student[] | ((prevState: Student[]) => Student[])) => {
    setStudents(prevState => {
      setPreviousStudents(prevState); // 현재 상태를 undo를 위해 저장
      if (typeof newState === 'function') {
        return newState(prevState);
      }
      return newState;
    });
  }, []);

  const handleAddStudent = () => {
    setIsSettingsModalOpen(false); // Close settings modal first
    setIsAdding(true);
  };

  const handleSaveNewStudents = (names: string[]) => {
    const newStudents: Student[] = names.map((name, index) => ({
      id: `student-${Date.now()}-${index}`,
      name: name.trim(),
      count: 0,
      history: [],
    }));

    if (newStudents.length > 0) {
      updateStateAndUndo(prev => [...newStudents, ...prev]);
      setSelectedStudentIds([]);
    }
    setIsAdding(false);
  };
  
  const handleCancelAddStudent = () => {
    setIsAdding(false);
  };

  const handleUpdateStudent = useCallback((updatedStudent: Student) => {
    updateStateAndUndo(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  }, [updateStateAndUndo]);

  const closeConfirmModal = () => {
    setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  const handleConfirmAction = () => {
    if (confirmModalState.onConfirm) {
      confirmModalState.onConfirm();
    }
    closeConfirmModal();
  };

  const handleDeleteStudent = useCallback((studentId: string) => {
    setConfirmModalState({
        isOpen: true,
        title: "학생 삭제 확인",
        message: "정말로 이 학생을 삭제하시겠습니까? 모든 기록이 영구적으로 사라집니다.",
        confirmText: "삭제",
        onConfirm: () => {
            updateStateAndUndo(prev => prev.filter(s => s.id !== studentId));
        }
    });
  }, [updateStateAndUndo]);


  const handleUndo = () => {
    if (previousStudents) {
      setStudents(previousStudents);
      setPreviousStudents(null); // 한 번만 실행 취소 가능
    }
  };
  
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(students, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `student_data_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("데이터 내보내기에 실패했습니다:", error);
      alert("데이터 내보내기에 실패했습니다.");
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedStudents: Student[] = JSON.parse(text);
          // Basic validation
          if (Array.isArray(importedStudents) && importedStudents.every(s => s.id && s.name && typeof s.count === 'number' && Array.isArray(s.history))) {
            setConfirmModalState({
                isOpen: true,
                title: '데이터 가져오기',
                message: '데이터를 가져오면 현재 데이터가 덮어씌워집니다. 계속하시겠습니까?',
                confirmText: '가져오기',
                onConfirm: () => {
                    updateStateAndUndo(importedStudents);
                    alert("데이터를 성공적으로 가져왔습니다.");
                }
            })
          } else {
            throw new Error("Invalid file format");
          }
        }
      } catch (error) {
        console.error("데이터 가져오기에 실패했습니다:", error);
        alert("데이터 파일이 유효하지 않거나 읽는 데 실패했습니다.");
      } finally {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    setConfirmModalState({
      isOpen: true,
      title: '전체 데이터 초기화',
      message: '정말로 모든 학생 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      confirmText: '초기화',
      onConfirm: () => {
        updateStateAndUndo([]);
        alert("모든 데이터가 초기화되었습니다.");
        setIsSettingsModalOpen(false);
      }
    });
  };

  const handleResetTeacherPin = () => {
    setConfirmModalState({
      isOpen: true,
      title: '교사 PIN 재설정',
      message: '정말로 교사 PIN을 재설정하시겠습니까? 재설정 후 다시 PIN을 설정해야 합니다.',
      confirmText: '재설정',
      onConfirm: () => {
        setTeacherPin(null);
        alert("교사 PIN이 재설정되었습니다.");
        setIsSettingsModalOpen(false);
      }
    });
  }

  const handleOpenAssistantPinModal = () => {
    setIsSettingsModalOpen(false);
    setPinError('');
    setPinModalMode('set-assistant');
    setIsPinModalOpen(true);
  }
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  const handleEnterStudentMode = () => {
    if (teacherPin) {
      setViewMode('student');
    } else {
      // Force setting teacher PIN if it doesn't exist
      setPinError('');
      setPinModalMode('set-teacher');
      setIsPinModalOpen(true);
    }
  };

  const handleEnterOverviewMode = () => {
    setViewMode('overview');
  };

  const handleExitOverviewMode = () => {
    setViewMode('teacher');
  };

  const handleRequestProtectedMode = (mode: 'teacher' | 'assistant') => {
    if (mode === 'assistant' && !assistantPin) {
      // 보조 PIN이 설정되지 않은 경우, 즉시 설정 모드로 진입
      setPinError('');
      setPinModalMode('set-assistant');
      setIsPinModalOpen(true);
      return;
    }
    setPinError('');
    setPinTargetMode(mode);
    setPinModalMode('enter');
    setIsPinModalOpen(true);
  };
  
  const handleExitAssistantMode = () => {
      setViewMode('student');
  };

  const handleSetPin = (newPin: string, type: PinType) => {
    if (type === 'teacher') {
      setTeacherPin(newPin);
      setViewMode('student'); // Switch to student mode after setting teacher pin
    } else {
      setAssistantPin(newPin);
    }
    setIsPinModalOpen(false);
  };

  const handleConfirmPin = (enteredPin: string) => {
    const isCorrect = (pinTargetMode === 'teacher' && enteredPin === teacherPin) ||
                      (pinTargetMode === 'assistant' && enteredPin === assistantPin);

    if (isCorrect) {
      if (pinTargetMode) {
        setViewMode(pinTargetMode);
      }
      setIsPinModalOpen(false);
      setPinError('');
      setPinTargetMode(null);
    } else {
      setPinError('PIN이 올바르지 않습니다.');
    }
  };

  const handleClosePinModal = () => {
    setIsPinModalOpen(false);
    setPinError('');
    setPinTargetMode(null);
  }

  const handleOpenAllHistory = () => {
    setIsSettingsModalOpen(false);
    setIsAllHistoryModalOpen(true);
  }

  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    setSelectedStudentIds(students.map(s => s.id));
  };

  const handleDeselectAllStudents = () => {
    setSelectedStudentIds([]);
  };

  const handleToggleAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      handleDeselectAllStudents();
    } else {
      handleSelectAllStudents();
    }
  };

  const handleApplyBulkChange = (change: number, reason: string) => {
    if (!reason.trim()) {
      alert("사유를 입력해주세요.");
      return;
    }
    if (change === 0) {
      return;
    }

    const timestamp = Date.now();
    updateStateAndUndo(prevStudents =>
      prevStudents.map(student => {
        if (selectedStudentIds.includes(student.id)) {
          const newHistoryEntry: HistoryEntry = {
            id: `history-${timestamp}-${student.id}`,
            timestamp,
            change,
            reason: reason.trim(),
          };
          return {
            ...student,
            count: student.count + change,
            history: [newHistoryEntry, ...student.history],
          };
        }
        return student;
      })
    );

    handleDeselectAllStudents();
  };

  const allHistory = useMemo<CombinedHistoryEntry[]>(() => {
    return students
        .flatMap(student => 
            student.history.map(entry => ({ ...entry, studentName: student.name }))
        )
        .sort((a, b) => b.timestamp - a.timestamp);
  }, [students]);

  return (
    <div className="min-h-screen font-sans">
      <Header
        onUndo={handleUndo}
        canUndo={previousStudents !== null}
        onExport={handleExportData}
        onImportClick={triggerFileInput}
        viewMode={viewMode}
        onEnterStudentMode={handleEnterStudentMode}
        onEnterOverviewMode={handleEnterOverviewMode}
        onExitOverviewMode={handleExitOverviewMode}
        onRequestTeacherMode={() => handleRequestProtectedMode('teacher')}
        onRequestAssistantMode={() => handleRequestProtectedMode('assistant')}
        onExitAssistantMode={handleExitAssistantMode}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        studentCount={students.length}
        selectedCount={selectedStudentIds.length}
        onToggleAllStudents={handleToggleAllStudents}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportData}
        className="hidden"
        accept="application/json"
      />
      <main className="p-4 sm:p-6 md:p-8 pb-32">
        {viewMode === 'overview' ? (
          students.length > 0 ? (
            <OverviewGrid students={students} />
          ) : (
            <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mb-4">학생 데이터가 없습니다.</h2>
              <p className="text-slate-500 dark:text-slate-400">교사 모드에서 학생을 추가해주세요.</p>
            </div>
          )
        ) : (students.length > 0 || (isAdding && viewMode === 'teacher')) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isAdding && viewMode === 'teacher' && (
              <AddStudentCard onSave={handleSaveNewStudents} onCancel={handleCancelAddStudent} />
            )}
            {students.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onUpdate={handleUpdateStudent}
                onDelete={handleDeleteStudent}
                viewMode={viewMode}
                isSelected={selectedStudentIds.includes(student.id)}
                onToggleSelection={handleToggleStudentSelection}
              />
            ))}
          </div>
        ) : viewMode === 'teacher' && !isAdding ? (
          <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mb-4">학생 데이터가 없습니다.</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">'설정' 메뉴에서 첫 학생을 등록해보세요.</p>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              학생 추가하기
            </button>
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mb-4">학생 데이터가 없습니다.</h2>
            <p className="text-slate-500 dark:text-slate-400">교사 모드에서 학생을 추가해주세요.</p>
          </div>
        )}
      </main>
      {isPinModalOpen && (
        <PinModal 
          mode={pinModalMode}
          targetMode={pinTargetMode}
          onClose={handleClosePinModal}
          onSetPin={handleSetPin}
          onConfirmPin={handleConfirmPin}
          error={pinError}
        />
      )}
      {isSettingsModalOpen && viewMode === 'teacher' && (
        <SettingsModal
            onClose={() => setIsSettingsModalOpen(false)}
            onAddStudent={handleAddStudent}
            onShowAllHistory={handleOpenAllHistory}
            onSetOrResetAssistantPin={handleOpenAssistantPinModal}
            onResetTeacherPin={handleResetTeacherPin}
            onResetData={handleResetData}
            hasAssistantPin={assistantPin !== null}
        />
      )}
      {isAllHistoryModalOpen && (
        <AllHistoryModal
            history={allHistory}
            onClose={() => setIsAllHistoryModalOpen(false)}
        />
      )}
      {confirmModalState.isOpen && (
        <ConfirmModal
          isOpen={confirmModalState.isOpen}
          onClose={closeConfirmModal}
          onConfirm={handleConfirmAction}
          title={confirmModalState.title}
          message={confirmModalState.message}
          confirmText={confirmModalState.confirmText}
          isDestructive={true}
        />
      )}
      {viewMode === 'teacher' && selectedStudentIds.length > 0 && (
        <BulkActionBar
          selectedCount={selectedStudentIds.length}
          totalCount={students.length}
          onApply={handleApplyBulkChange}
          onSelectAll={handleSelectAllStudents}
          onDeselectAll={handleDeselectAllStudents}
        />
      )}
    </div>
  );
};

export default App;