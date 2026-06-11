import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskResponse, TasksResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  createTask(title: string, description: string, priority: string = 'medium', assignedTo?: string, dueDate?: string): Observable<TaskResponse> {
    const payload: any = { title, description, priority };
    if (assignedTo) {
      payload.assignedTo = assignedTo;
    }
    if (dueDate) {
      payload.dueDate = dueDate;
    }
    return this.http.post<TaskResponse>(`${this.apiUrl}`, payload).pipe(
      map(response => {
        this.getTasks().subscribe();
        return response;
      })
    );
  }

  getTasks(status?: string): Observable<TasksResponse> {
    let url = this.apiUrl;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<TasksResponse>(url).pipe(
      map(response => {
        this.tasksSubject.next(response.tasks);
        return response;
      })
    );
  }

  getTaskById(id: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, updates: Partial<Task>): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, updates).pipe(
      map(response => {
        this.getTasks().subscribe();
        return response;
      })
    );
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        this.getTasks().subscribe();
        return response;
      })
    );
  }

  getLocalTasks(): Task[] {
    return this.tasksSubject.value;
  }

  setLocalTasks(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
  }
}
