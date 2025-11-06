import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeBlock, TodoItem } from '../models/time-block.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  // Time Blocks
  getTimeBlocks(startDate?: Date, endDate?: Date): Observable<TimeBlock[]> {
    let url = `${this.apiUrl}/timeblocks`;
    const params: string[] = [];

    if (startDate) {
      params.push(`startDate=${startDate.toISOString()}`);
    }
    if (endDate) {
      params.push(`endDate=${endDate.toISOString()}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<TimeBlock[]>(url);
  }

  createTimeBlock(block: Omit<TimeBlock, 'id'>): Observable<TimeBlock> {
    return this.http.post<TimeBlock>(`${this.apiUrl}/timeblocks`, block);
  }

  updateTimeBlock(id: string, updates: Partial<TimeBlock>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/timeblocks/${id}`, { id, ...updates });
  }

  deleteTimeBlock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/timeblocks/${id}`);
  }

  // Todo Items
  getTodoItems(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(`${this.apiUrl}/todoitems`);
  }

  createTodoItem(item: Omit<TodoItem, 'id'>): Observable<TodoItem> {
    return this.http.post<TodoItem>(`${this.apiUrl}/todoitems`, item);
  }

  updateTodoItem(id: string, updates: Partial<TodoItem>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/todoitems/${id}`, { id, ...updates });
  }

  deleteTodoItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todoitems/${id}`);
  }
}
