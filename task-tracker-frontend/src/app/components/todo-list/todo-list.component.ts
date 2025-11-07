import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { TodoItem } from '../../models/time-block.model';
import { Subscription } from 'rxjs';

interface DailyGoal {
  date: string; // YYYY-MM-DD format
  goal: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit, OnDestroy {
  todoItems: TodoItem[] = [];
  newTodoTitle: string = '';
  dailyGoal: string = '';
  savedDailyGoal: string = ''; // Track the saved goal separately
  isDailyGoalCompleted: boolean = false;
  isEditingGoal: boolean = false;
  private subscription: Subscription = new Subscription();
  private readonly DAILY_GOALS_KEY = 'dailyGoals';

  constructor(private timeTrackerService: TimeTrackerService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.timeTrackerService.getTodoItems().subscribe(items => {
        this.todoItems = items;
      })
    );
    this.loadDailyGoal();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private loadDailyGoal(): void {
    const storedGoals = localStorage.getItem(this.DAILY_GOALS_KEY);
    if (storedGoals) {
      const goals: DailyGoal[] = JSON.parse(storedGoals);
      const todayGoal = goals.find(g => g.date === this.getTodayDateString());
      if (todayGoal) {
        this.dailyGoal = todayGoal.goal;
        this.savedDailyGoal = todayGoal.goal;
        this.isDailyGoalCompleted = todayGoal.isCompleted;
      }
    }
  }

  private saveDailyGoal(): void {
    const storedGoals = localStorage.getItem(this.DAILY_GOALS_KEY);
    let goals: DailyGoal[] = storedGoals ? JSON.parse(storedGoals) : [];

    // Remove old goals (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    goals = goals.filter(g => new Date(g.date) >= thirtyDaysAgo);

    // Update or add today's goal
    const todayDate = this.getTodayDateString();
    const existingGoalIndex = goals.findIndex(g => g.date === todayDate);

    // Only save if goal has at least 3 characters
    if (this.dailyGoal.trim() && this.dailyGoal.trim().length >= 3) {
      const todayGoal: DailyGoal = {
        date: todayDate,
        goal: this.dailyGoal.trim(),
        isCompleted: this.isDailyGoalCompleted
      };

      if (existingGoalIndex >= 0) {
        goals[existingGoalIndex] = todayGoal;
      } else {
        goals.push(todayGoal);
      }
    } else if (existingGoalIndex >= 0 && this.dailyGoal.trim().length === 0) {
      // Remove empty goal
      goals.splice(existingGoalIndex, 1);
    }

    localStorage.setItem(this.DAILY_GOALS_KEY, JSON.stringify(goals));
  }

  editDailyGoal(): void {
    this.isEditingGoal = true;
  }

  saveDailyGoalEdit(): void {
    // Only save if there's meaningful content (at least 3 characters)
    if (this.dailyGoal.trim().length >= 3) {
      this.savedDailyGoal = this.dailyGoal.trim();
      this.isEditingGoal = false;
      this.saveDailyGoal();
    } else if (this.dailyGoal.trim().length === 0) {
      // If empty, clear the goal
      this.clearDailyGoal();
    }
    // If less than 3 characters, do nothing (stay in edit mode)
  }

  cancelDailyGoalEdit(): void {
    this.dailyGoal = this.savedDailyGoal; // Restore saved value
    this.isEditingGoal = false;
  }

  toggleDailyGoal(): void {
    this.isDailyGoalCompleted = !this.isDailyGoalCompleted;
    this.saveDailyGoal();
  }

  clearDailyGoal(): void {
    this.dailyGoal = '';
    this.savedDailyGoal = '';
    this.isDailyGoalCompleted = false;
    this.isEditingGoal = false;
    this.saveDailyGoal();
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.timeTrackerService.addTodoItem(this.newTodoTitle.trim());
      this.newTodoTitle = '';
    }
  }

  toggleTodo(id: string): void {
    this.timeTrackerService.toggleTodoItem(id);
  }

  deleteTodo(id: string): void {
    this.timeTrackerService.deleteTodoItem(id);
  }

  get activeTodos(): TodoItem[] {
    return this.todoItems.filter(item => !item.isCompleted);
  }

  get completedTodos(): TodoItem[] {
    return this.todoItems.filter(item => item.isCompleted);
  }
}
