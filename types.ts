export interface HistoryEntry {
  id: string;
  timestamp: number;
  change: number;
  reason: string;
}

export interface Student {
  id: string;
  name: string;
  count: number;
  history: HistoryEntry[];
}

export type ViewMode = 'teacher' | 'student' | 'assistant' | 'overview';

export type PinType = 'teacher' | 'assistant';

export type PinModalMode = 'set-teacher' | 'set-assistant' | 'enter';

// For the "All History" modal
export interface CombinedHistoryEntry extends HistoryEntry {
  studentName: string;
}