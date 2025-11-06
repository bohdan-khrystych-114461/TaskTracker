export interface TimeBlock {
  id: string;
  taskName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  date: Date;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TimerState {
  taskName: string;
  startTime: Date | null;
  elapsedTime: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
}
