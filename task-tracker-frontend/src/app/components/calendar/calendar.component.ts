import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { TimeBlock } from '../../models/time-block.model';
import { Subscription } from 'rxjs';
import { TimeBlockModalComponent } from '../time-block-modal/time-block-modal.component';

interface DayColumn {
  date: Date;
  dayName: string;
  dayNumber: number;
  blocks: TimeBlock[];
}

interface TimeSlot {
  hour: number;
  displayTime: string;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, DragDropModule, TimeBlockModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('timeColumn') timeColumn!: ElementRef<HTMLDivElement>;
  @ViewChild('daysContainer') daysContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('dayHeadersRow') dayHeadersRow!: ElementRef<HTMLDivElement>;

  weekDays: DayColumn[] = [];
  timeSlots: TimeSlot[] = [];
  currentWeekStart: Date = new Date();
  isDragging = false;
  dragStartSlot: { day: number; hour: number; minute: number } | null = null;
  dragEndSlot: { day: number; hour: number; minute: number } | null = null;
  viewMode: 'day' | 'week' | '5days' = 'week';

  // Modal state
  isModalVisible = false;
  selectedBlock: TimeBlock | null = null;

  // Dropdown state
  isDropdownOpen = false;

  // Date picker state
  isDatePickerOpen = false;
  pickerMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private timeTrackerService: TimeTrackerService) {}

  ngOnInit(): void {
    this.initializeTimeSlots();
    this.initializeWeek();

    this.subscription.add(
      this.timeTrackerService.getTimeBlocks().subscribe(blocks => {
        this.updateWeekBlocks(blocks);
      })
    );
  }

  ngAfterViewInit(): void {
    // Synchronize scroll between time column and days container
    setTimeout(() => {
      if (this.daysContainer && this.timeColumn && this.dayHeadersRow) {
        const daysEl = this.daysContainer.nativeElement;
        const timeEl = this.timeColumn.nativeElement;
        const headersEl = this.dayHeadersRow.nativeElement;

        console.log('Setting up scroll sync');

        // Sync vertical scroll (time column with days)
        daysEl.addEventListener('scroll', () => {
          timeEl.scrollTop = daysEl.scrollTop;
          // Sync horizontal scroll (headers with days)
          headersEl.scrollLeft = daysEl.scrollLeft;
        });
      } else {
        console.error('Scroll sync failed - elements not found:', {
          daysContainer: !!this.daysContainer,
          timeColumn: !!this.timeColumn,
          dayHeadersRow: !!this.dayHeadersRow
        });
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close dropdowns when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.date-picker-container') && !target.closest('.view-dropdown')) {
      this.isDatePickerOpen = false;
      this.isDropdownOpen = false;
    }
  }

  initializeTimeSlots(): void {
    for (let hour = 7; hour <= 22; hour++) {
      this.timeSlots.push({
        hour,
        displayTime: this.formatHour(hour)
      });
    }
  }

  initializeWeek(): void {
    // Use currentWeekStart if it's already set, otherwise calculate from today
    if (!this.currentWeekStart || this.currentWeekStart.toString() === 'Invalid Date') {
      const today = new Date();
      const currentDay = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
      monday.setHours(0, 0, 0, 0);
      this.currentWeekStart = monday;
    }

    const monday = new Date(this.currentWeekStart);
    monday.setHours(0, 0, 0, 0);

    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      this.weekDays.push({
        date,
        dayName: this.getDayName(date),
        dayNumber: date.getDate(),
        blocks: []
      });
    }

    console.log('Week initialized:', this.weekDays.map(d => d.date.toDateString()));

    // Reload blocks from the service for the new week
    this.updateWeekBlocks(this.timeTrackerService.getTimeBlocksValue());
  }

  updateWeekBlocks(blocks: TimeBlock[]): void {
    this.weekDays.forEach(day => {
      day.blocks = blocks.filter(block =>
        this.isSameDay(new Date(block.date), day.date)
      );
    });
  }

  onMouseDown(dayIndex: number, hour: number, minute: number, event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.dragStartSlot = { day: dayIndex, hour, minute };
    this.dragEndSlot = { day: dayIndex, hour, minute };
  }

  onMouseMove(dayIndex: number, hour: number, minute: number, event: MouseEvent): void {
    if (this.isDragging && this.dragStartSlot) {
      this.dragEndSlot = { day: dayIndex, hour, minute };
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.isDragging && this.dragStartSlot && this.dragEndSlot) {
      this.createTimeBlock();
    }
    this.isDragging = false;
    this.dragStartSlot = null;
    this.dragEndSlot = null;
  }

  onSlotClick(dayIndex: number, hour: number, minute: number, event: MouseEvent): void {
    if (!this.isDragging) {
      const day = this.displayDays[dayIndex]; // Use displayDays instead of weekDays
      const startTime = new Date(day.date);
      startTime.setHours(hour, minute, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(minute + 15);

      // Create a temporary block to show in modal
      this.selectedBlock = {
        id: 'temp-' + Date.now(),
        taskName: '',
        startTime,
        endTime,
        duration: 15,
        date: day.date
      };
      this.isModalVisible = true;
    }
  }

  createTimeBlock(): void {
    if (!this.dragStartSlot || !this.dragEndSlot) return;

    const dayIndex = this.dragStartSlot.day;

    // Calculate start and end times in minutes
    const startMinutes = this.dragStartSlot.hour * 60 + this.dragStartSlot.minute;
    const endMinutes = this.dragEndSlot.hour * 60 + this.dragEndSlot.minute + 15; // Add 15 to include the end slot

    const minMinutes = Math.min(startMinutes, endMinutes);
    const maxMinutes = Math.max(startMinutes, endMinutes);

    const day = this.displayDays[dayIndex]; // Use displayDays instead of weekDays
    const startTime = new Date(day.date);
    startTime.setHours(Math.floor(minMinutes / 60), minMinutes % 60, 0, 0);

    const endTime = new Date(day.date);
    endTime.setHours(Math.floor(maxMinutes / 60), maxMinutes % 60, 0, 0);

    const duration = maxMinutes - minMinutes;

    // Create a temporary block to show in modal
    this.selectedBlock = {
      id: 'temp-' + Date.now(),
      taskName: '',
      startTime,
      endTime,
      duration,
      date: day.date
    };
    this.isModalVisible = true;
  }

  isSlotInDragRange(dayIndex: number, hour: number, minute: number): boolean {
    if (!this.isDragging || !this.dragStartSlot || !this.dragEndSlot) {
      return false;
    }

    if (dayIndex !== this.dragStartSlot.day) {
      return false;
    }

    const currentMinutes = hour * 60 + minute;
    const startMinutes = this.dragStartSlot.hour * 60 + this.dragStartSlot.minute;
    const endMinutes = this.dragEndSlot.hour * 60 + this.dragEndSlot.minute;

    const minMinutes = Math.min(startMinutes, endMinutes);
    const maxMinutes = Math.max(startMinutes, endMinutes);

    return currentMinutes >= minMinutes && currentMinutes <= maxMinutes;
  }

  getBlockStyle(block: TimeBlock): any {
    const startTime = new Date(block.startTime);
    const endTime = new Date(block.endTime);

    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    // Calculate position in pixels (80px per hour = 1.333px per minute)
    // Base time is 7 AM (hour 7)
    const startMinutesFromBase = (startHour - 7) * 60 + startMinute;
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

    const pixelsPerMinute = 80 / 60; // 80px per hour / 60 minutes
    const topPx = startMinutesFromBase * pixelsPerMinute;
    const heightPx = durationMinutes * pixelsPerMinute;

    console.log('Block:', block.taskName, 'Start:', startTime, 'End:', endTime, 'Duration mins:', durationMinutes, 'Height:', heightPx + 'px');

    return {
      top: `${topPx}px`,
      height: `${heightPx}px`
    };
  }

  openBlockModal(block: TimeBlock, event: Event): void {
    event.stopPropagation();
    this.selectedBlock = block;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedBlock = null;
  }

  saveBlock(updates: Partial<TimeBlock>): void {
    if (this.selectedBlock) {
      // Check if this is a new block (temp ID) or existing block
      if (this.selectedBlock.id.startsWith('temp-')) {
        // Create new block
        const startTime = updates.startTime || this.selectedBlock.startTime;
        const endTime = updates.endTime || this.selectedBlock.endTime;

        // Ensure date is set to the start of the day for proper filtering
        const blockDate = new Date(startTime);
        blockDate.setHours(0, 0, 0, 0);

        const newBlock = {
          taskName: updates.taskName || '',
          startTime: startTime,
          endTime: endTime,
          duration: updates.duration || this.selectedBlock.duration,
          date: blockDate
        };

        this.timeTrackerService.addTimeBlock(newBlock);
      } else {
        // Check if this is the active timer block and update timer if needed
        const activeTimerBlockId = this.timeTrackerService.getActiveTimerBlockId();
        const isActiveTimer = activeTimerBlockId === this.selectedBlock.id;
        
        if (isActiveTimer && updates.startTime) {
          // Update the timer state when start time is changed
          this.timeTrackerService.updateTimerStartTime(updates.startTime, updates.taskName);
        }
        
        // Update existing block
        this.timeTrackerService.updateTimeBlock(this.selectedBlock.id, updates);
      }
      this.closeModal();
    }
  }

  deleteBlock(): void {
    if (this.selectedBlock && !this.selectedBlock.id.startsWith('temp-')) {
      this.timeTrackerService.deleteTimeBlock(this.selectedBlock.id);
    }
    this.closeModal();
  }

  formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.initializeWeek();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.initializeWeek();
  }

  goToToday(): void {
    this.initializeWeek();
  }

  setViewMode(mode: 'day' | 'week' | '5days'): void {
    this.viewMode = mode;
    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getViewModeLabel(): string {
    switch(this.viewMode) {
      case 'day': return 'Day view';
      case '5days': return '5 days view';
      case 'week': return 'Week view';
      default: return 'Week view';
    }
  }

  get displayDays(): DayColumn[] {
    if (this.viewMode === 'day') {
      const today = this.weekDays.find(day => this.isToday(day.date));
      return today ? [today] : [this.weekDays[0]];
    }
    if (this.viewMode === '5days') {
      return this.weekDays.slice(0, 5); // Monday to Friday
    }
    return this.weekDays;
  }

  previousDay(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 1);
    this.initializeWeek();
  }

  nextDay(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 1);
    this.initializeWeek();
  }

  // Date Picker Methods
  toggleDatePicker(): void {
    this.isDatePickerOpen = !this.isDatePickerOpen;
    if (this.isDatePickerOpen) {
      this.pickerMonth = new Date(this.currentWeekStart);
      this.generateCalendarDays();
    }
  }

  getCurrentDateLabel(): string {
    const today = new Date();
    const current = new Date(this.currentWeekStart);

    if (this.isSameDay(current, today)) {
      return 'Today';
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (this.isSameDay(current, yesterday)) {
      return 'Yesterday';
    }

    return current.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getMonthYearLabel(): string {
    return this.pickerMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  previousMonth(): void {
    this.pickerMonth = new Date(this.pickerMonth.getFullYear(), this.pickerMonth.getMonth() - 1, 1);
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.pickerMonth = new Date(this.pickerMonth.getFullYear(), this.pickerMonth.getMonth() + 1, 1);
    this.generateCalendarDays();
  }

  selectQuickDate(option: string): void {
    console.log('Quick date selected:', option);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch(option) {
      case 'today':
        this.currentWeekStart = new Date(today);
        break;
      case 'yesterday':
        this.currentWeekStart = new Date(today);
        this.currentWeekStart.setDate(today.getDate() - 1);
        break;
      case 'thisWeek':
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
        this.currentWeekStart = monday;
        break;
      case 'lastWeek':
        const lastWeekDay = today.getDay();
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - lastWeekDay + (lastWeekDay === 0 ? -6 : 1) - 7);
        this.currentWeekStart = lastMonday;
        break;
    }

    console.log('New week start:', this.currentWeekStart);
    this.initializeWeek();
    this.isDatePickerOpen = false;
  }

  selectDate(date: Date): void {
    console.log('Date selected from calendar:', date);

    // Calculate the Monday of the selected date's week
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    console.log('Setting week start to Monday:', monday);
    this.currentWeekStart = monday;
    this.initializeWeek();
    this.isDatePickerOpen = false;
  }

  generateCalendarDays(): void {
    const year = this.pickerMonth.getFullYear();
    const month = this.pickerMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonthDays = startDay === 0 ? 6 : startDay - 1;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    this.calendarDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(this.currentWeekStart);
    selected.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = prevMonthDays; i > 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i + 1);
      this.calendarDays.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: this.isSameDay(date, selected)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, today),
        isSelected: this.isSameDay(date, selected)
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: this.isSameDay(date, selected)
      });
    }
  }

  isBlockActive(block: TimeBlock): boolean {
    const timerState = this.timeTrackerService.getTimerStateValue();
    return timerState.isRunning && block.id === this.timeTrackerService.getActiveTimerBlockId();
  }
}
