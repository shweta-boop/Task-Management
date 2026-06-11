import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  private taskCreatedSubject = new BehaviorSubject<Task | null>(null);
  public taskCreated$ = this.taskCreatedSubject.asObservable();

  private taskUpdatedSubject = new BehaviorSubject<Task | null>(null);
  public taskUpdated$ = this.taskUpdatedSubject.asObservable();

  private taskDeletedSubject = new BehaviorSubject<string | null>(null);
  public taskDeleted$ = this.taskDeletedSubject.asObservable();

  connect(userId: string): void {
    if (this.socket) {
      return;
    }

    this.socket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket?.emit('user-online', userId);
    });

    this.socket.on('users-online', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });

    this.socket.on('task-created', (task: Task) => {
      this.taskCreatedSubject.next(task);
    });

    this.socket.on('task-updated', (task: Task) => {
      this.taskUpdatedSubject.next(task);
    });

    this.socket.on('task-deleted', (taskId: string) => {
      this.taskDeletedSubject.next(taskId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emitTaskCreated(task: Task): void {
    if (this.socket) {
      this.socket.emit('task-created', task);
    }
  }

  emitTaskUpdated(task: Task): void {
    if (this.socket) {
      this.socket.emit('task-updated', task);
    }
  }

  emitTaskDeleted(taskId: string): void {
    if (this.socket) {
      this.socket.emit('task-deleted', taskId);
    }
  }
}
