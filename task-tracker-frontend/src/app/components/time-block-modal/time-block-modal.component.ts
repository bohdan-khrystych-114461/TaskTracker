import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeBlock } from '../../models/time-block.model';
import { TimeTrackerService } from '../../services/time-tracker.service';

@Component({
  selector: 'app-time-block-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './time-block-modal.component.html',
  styleUrl: './time-block-modal.component.scss'
})
export class TimeBlockModalComponent {
  @Input() block: TimeBlock | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<TimeBlock>>();
  @Output() delete = new EventEmitter<void>();

  editedTaskName: string = '';
  editedStartTime: string = '';
  editedEndTime: string = '';

  constructor(private timeTrackerService: TimeTrackerService) {}

  get isNewBlock(): boolean {
    return this.block?.id.startsWith('temp-') || false;
  }

  get isActiveTimer(): boolean {
    if (!this.block || this.isNewBlock) return false;
    const activeTimerBlockId = this.timeTrackerService.getActiveTimerBlockId();
    return activeTimerBlockId === this.block.id;
  }

  ngOnChanges(): void {
    if (this.block) {
      this.editedTaskName = this.block.taskName;
      this.editedStartTime = this.formatTimeForInput(this.block.startTime);
      this.editedEndTime = this.formatTimeForInput(this.block.endTime);
    }
  }

  formatTimeForInput(date: Date): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onSave(): void {
    if (!this.block) return;
    
    // Validate task name
    if (!this.editedTaskName || !this.editedTaskName.trim()) {
      alert('Please enter a task name');
      return;
    }

    const [startHours, startMinutes] = this.editedStartTime.split(':').map(Number);
    const [endHours, endMinutes] = this.editedEndTime.split(':').map(Number);

    const startTime = new Date(this.block.startTime);
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date(this.block.endTime);
    endTime.setHours(endHours, endMinutes, 0, 0);

    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    this.save.emit({
      taskName: this.editedTaskName.trim(),
      startTime,
      endTime,
      duration
    });
  }

  onDelete(): void {
    if (confirm('Delete this time block?')) {
      this.delete.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
