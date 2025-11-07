import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimerComponent } from './components/timer/timer.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TimerComponent, CalendarComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'task-tracker-frontend';
  sidebarWidth: number = 350; // Default width in pixels
  isDragging: boolean = false;
  private readonly MIN_WIDTH = 250;
  private readonly MAX_WIDTH = 600;

  ngOnInit(): void {
    // Load saved width from localStorage
    const savedWidth = localStorage.getItem('todoSidebarWidth');
    if (savedWidth) {
      this.sidebarWidth = parseInt(savedWidth, 10);
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    event.preventDefault();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const containerWidth = window.innerWidth;
    const newWidth = containerWidth - event.clientX;

    if (newWidth >= this.MIN_WIDTH && newWidth <= this.MAX_WIDTH) {
      this.sidebarWidth = newWidth;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      // Save to localStorage
      localStorage.setItem('todoSidebarWidth', this.sidebarWidth.toString());
    }
  }
}
