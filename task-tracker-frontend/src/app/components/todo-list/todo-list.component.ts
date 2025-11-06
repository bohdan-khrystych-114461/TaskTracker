import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { TodoItem } from '../../models/time-block.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit, OnDestroy {
  todoItems: TodoItem[] = [];
  newTodoTitle: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private timeTrackerService: TimeTrackerService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.timeTrackerService.getTodoItems().subscribe(items => {
        this.todoItems = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
