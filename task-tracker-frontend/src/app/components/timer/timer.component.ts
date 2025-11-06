import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { TimerState } from '../../models/time-block.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy {
  taskName: string = '';
  timerState: TimerState | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private timeTrackerService: TimeTrackerService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.timeTrackerService.getTimerState().subscribe(state => {
        this.timerState = state;
        if (state.isRunning || state.isPaused) {
          this.taskName = state.taskName;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onStartTimer(): void {
    if (this.taskName.trim()) {
      this.timeTrackerService.startTimer(this.taskName);
    }
  }

  onPauseTimer(): void {
    this.timeTrackerService.pauseTimer();
  }

  onStopTimer(): void {
    this.timeTrackerService.stopTimer();
    this.taskName = '';
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
