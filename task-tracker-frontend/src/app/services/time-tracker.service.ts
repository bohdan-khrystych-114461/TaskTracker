import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { TimeBlock, TodoItem, TimerState } from '../models/time-block.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {
  private timeBlocks$ = new BehaviorSubject<TimeBlock[]>([]);
  private todoItems$ = new BehaviorSubject<TodoItem[]>([]);
  private timerState$ = new BehaviorSubject<TimerState>({
    taskName: '',
    startTime: null,
    elapsedTime: 0,
    isRunning: false,
    isPaused: false
  });

  private timerInterval: any;
  private activeTimerBlockId: string | null = null;

  constructor(private apiService: ApiService) {
    this.loadData();
    this.restoreTimerState();
    this.setupVisibilityListener();
  }

  // Time Blocks
  getTimeBlocks(): Observable<TimeBlock[]> {
    return this.timeBlocks$.asObservable();
  }

  getTimeBlocksValue(): TimeBlock[] {
    return this.timeBlocks$.value;
  }

  addTimeBlock(block: Omit<TimeBlock, 'id'>): void {
    this.apiService.createTimeBlock(block).subscribe({
      next: (newBlock) => {
        const blocks = [...this.timeBlocks$.value, newBlock];
        this.timeBlocks$.next(blocks);
      },
      error: (error) => console.error('Error creating time block:', error)
    });
  }

  updateTimeBlock(id: string, updates: Partial<TimeBlock>): void {
    const existingBlock = this.timeBlocks$.value.find(b => b.id === id);
    if (!existingBlock) return;

    const updatedBlock = { ...existingBlock, ...updates };
    this.apiService.updateTimeBlock(id, updatedBlock).subscribe({
      next: () => {
        const blocks = this.timeBlocks$.value.map(block =>
          block.id === id ? updatedBlock : block
        );
        this.timeBlocks$.next(blocks);
      },
      error: (error) => console.error('Error updating time block:', error)
    });
  }

  deleteTimeBlock(id: string): void {
    this.apiService.deleteTimeBlock(id).subscribe({
      next: () => {
        const blocks = this.timeBlocks$.value.filter(block => block.id !== id);
        this.timeBlocks$.next(blocks);
      },
      error: (error) => console.error('Error deleting time block:', error)
    });
  }

  // Todo Items
  getTodoItems(): Observable<TodoItem[]> {
    return this.todoItems$.asObservable();
  }

  addTodoItem(title: string): void {
    const newItem = {
      title,
      isCompleted: false,
      createdAt: new Date()
    };
    this.apiService.createTodoItem(newItem).subscribe({
      next: (created) => {
        const items = [...this.todoItems$.value, created];
        this.todoItems$.next(items);
      },
      error: (error) => console.error('Error creating todo item:', error)
    });
  }

  toggleTodoItem(id: string): void {
    const item = this.todoItems$.value.find(i => i.id === id);
    if (!item) return;

    const updated = { ...item, isCompleted: !item.isCompleted };
    this.apiService.updateTodoItem(id, updated).subscribe({
      next: () => {
        const items = this.todoItems$.value.map(i =>
          i.id === id ? updated : i
        );
        this.todoItems$.next(items);
      },
      error: (error) => console.error('Error updating todo item:', error)
    });
  }

  deleteTodoItem(id: string): void {
    this.apiService.deleteTodoItem(id).subscribe({
      next: () => {
        const items = this.todoItems$.value.filter(item => item.id !== id);
        this.todoItems$.next(items);
      },
      error: (error) => console.error('Error deleting todo item:', error)
    });
  }

  // Timer
  getTimerState(): Observable<TimerState> {
    return this.timerState$.asObservable();
  }

  getTimerStateValue(): TimerState {
    return this.timerState$.value;
  }

  getActiveTimerBlockId(): string | null {
    return this.activeTimerBlockId;
  }

  startTimer(taskName: string): void {
    const state = this.timerState$.value;

    if (state.isPaused) {
      // Resume from pause
      this.timerState$.next({
        ...state,
        isRunning: true,
        isPaused: false
      });
      this.startTimerInterval();
      this.saveTimerState();
    } else {
      // Start new timer and create live block
      const now = new Date();
      this.timerState$.next({
        taskName,
        startTime: now,
        elapsedTime: 0,
        isRunning: true,
        isPaused: false
      });

      // Create initial time block that will update in real-time
      const newBlock = {
        taskName,
        startTime: now,
        endTime: now,
        duration: 0,
        date: now
      };

      this.apiService.createTimeBlock(newBlock).subscribe({
        next: (created) => {
          this.activeTimerBlockId = created.id;
          const blocks = [...this.timeBlocks$.value, created];
          this.timeBlocks$.next(blocks);
          this.saveTimerState();
        },
        error: (error) => console.error('Error creating timer block:', error)
      });

      this.startTimerInterval();
    }
  }

  pauseTimer(): void {
    const state = this.timerState$.value;
    this.timerState$.next({
      ...state,
      isRunning: false,
      isPaused: true
    });
    this.stopTimerInterval();
    this.saveTimerState();
  }

  stopTimer(): void {
    const state = this.timerState$.value;

    // Just finalize the existing block, don't create a new one
    if (this.activeTimerBlockId) {
      this.activeTimerBlockId = null;
    }

    this.timerState$.next({
      taskName: '',
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
      isPaused: false
    });

    this.stopTimerInterval();
    this.clearTimerState();
  }

  updateTimerStartTime(newStartTime: Date, newTaskName?: string): void {
    const state = this.timerState$.value;
    
    if (state.isRunning && state.startTime) {
      // Calculate new elapsed time based on new start time
      const now = new Date();
      const newElapsedTime = Math.floor((now.getTime() - newStartTime.getTime()) / 1000);
      
      this.timerState$.next({
        ...state,
        startTime: newStartTime,
        taskName: newTaskName || state.taskName,
        elapsedTime: Math.max(0, newElapsedTime) // Ensure non-negative
      });
      
      this.saveTimerState();
    }
  }

  private startTimerInterval(): void {
    this.stopTimerInterval();
    this.timerInterval = setInterval(() => {
      const state = this.timerState$.value;
      if (state.isRunning && state.startTime) {
        // Calculate actual elapsed time based on start time
        const now = new Date();
        const actualElapsed = Math.floor((now.getTime() - state.startTime.getTime()) / 1000);
        
        this.timerState$.next({
          ...state,
          elapsedTime: actualElapsed
        });

        // Update the active timer block in real-time
        if (this.activeTimerBlockId) {
          const startTime = state.startTime;
          const blocks = this.timeBlocks$.value.map(block => {
            if (block.id === this.activeTimerBlockId) {
              return {
                ...block,
                endTime: now,
                duration: Math.round((now.getTime() - startTime.getTime()) / 60000)
              };
            }
            return block;
          });
          this.timeBlocks$.next(blocks);
        }
      }
    }, 1000);
  }

  private stopTimerInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Load data from API
  private loadData(): void {
    // Load time blocks
    this.apiService.getTimeBlocks().subscribe({
      next: (blocks) => {
        const parsedBlocks = blocks.map(block => ({
          ...block,
          startTime: new Date(block.startTime),
          endTime: new Date(block.endTime),
          date: new Date(block.date)
        }));
        this.timeBlocks$.next(parsedBlocks);
      },
      error: (error) => console.error('Error loading time blocks:', error)
    });

    // Load todo items
    this.apiService.getTodoItems().subscribe({
      next: (items) => {
        const parsedItems = items.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          completedAt: item.completedAt ? new Date(item.completedAt) : undefined
        }));
        this.todoItems$.next(parsedItems);
      },
      error: (error) => console.error('Error loading todo items:', error)
    });
  }

  // Timer persistence methods
  private saveTimerState(): void {
    const state = this.timerState$.value;
    const timerData = {
      taskName: state.taskName,
      startTime: state.startTime?.toISOString(),
      elapsedTime: state.elapsedTime,
      isRunning: state.isRunning,
      isPaused: state.isPaused,
      activeTimerBlockId: this.activeTimerBlockId
    };
    localStorage.setItem('timerState', JSON.stringify(timerData));
  }

  private restoreTimerState(): void {
    const saved = localStorage.getItem('timerState');
    if (!saved) return;

    try {
      const timerData = JSON.parse(saved);
      
      // Only restore if timer was running or paused
      if (timerData.isRunning || timerData.isPaused) {
        const startTime = timerData.startTime ? new Date(timerData.startTime) : null;
        
        // Calculate elapsed time including time while app was closed
        let elapsedTime = timerData.elapsedTime;
        if (timerData.isRunning && startTime) {
          const now = new Date();
          const additionalTime = Math.floor((now.getTime() - startTime.getTime()) / 1000);
          elapsedTime = additionalTime;
        }

        this.activeTimerBlockId = timerData.activeTimerBlockId;
        
        this.timerState$.next({
          taskName: timerData.taskName,
          startTime: startTime,
          elapsedTime: elapsedTime,
          isRunning: timerData.isRunning,
          isPaused: timerData.isPaused
        });

        // Resume timer if it was running
        if (timerData.isRunning) {
          this.startTimerInterval();
        }

        console.log('Timer state restored:', {
          taskName: timerData.taskName,
          elapsedTime: elapsedTime,
          isRunning: timerData.isRunning
        });
      } else {
        // Clear saved state if timer wasn't active
        localStorage.removeItem('timerState');
      }
    } catch (error) {
      console.error('Error restoring timer state:', error);
      localStorage.removeItem('timerState');
    }
  }

  private clearTimerState(): void {
    localStorage.removeItem('timerState');
  }

  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.timerState$.value.isRunning) {
        // Tab became visible again, update timer state immediately
        const state = this.timerState$.value;
        if (state.startTime) {
          const now = new Date();
          const actualElapsed = Math.floor((now.getTime() - state.startTime.getTime()) / 1000);
          
          this.timerState$.next({
            ...state,
            elapsedTime: actualElapsed
          });

          // Update the active timer block
          if (this.activeTimerBlockId) {
            const startTime = state.startTime;
            const blocks = this.timeBlocks$.value.map(block => {
              if (block.id === this.activeTimerBlockId) {
                return {
                  ...block,
                  endTime: now,
                  duration: Math.round((now.getTime() - startTime.getTime()) / 60000)
                };
              }
              return block;
            });
            this.timeBlocks$.next(blocks);
          }
        }
      }
    });
  }
}
