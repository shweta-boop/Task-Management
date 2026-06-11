import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { SocketService } from '../../services/socket.service';
import { User, Task } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statusFilter = '';
  loading = true;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadTasks();

    this.socketService.taskCreated$.subscribe(task => {
      if (task) {
        this.tasks.unshift(task);
        this.applyFilter();
      }
    });

    this.socketService.taskUpdated$.subscribe(task => {
      if (task) {
        const index = this.tasks.findIndex(t => (t._id || t.id) === (task._id || task.id));
        if (index > -1) {
          this.tasks[index] = task;
        }
        this.applyFilter();
      }
    });

    this.socketService.taskDeleted$.subscribe(taskId => {
      if (taskId) {
        this.tasks = this.tasks.filter(t => (t._id || t.id) !== taskId);
        this.applyFilter();
      }
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.filteredTasks = this.tasks;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.loading = false;
      }
    });
  }

  onStatusFilterChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.statusFilter) {
      this.filteredTasks = this.tasks.filter(task => task.status === this.statusFilter);
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'in-progress':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning';
      default:
        return 'bg-info';
    }
  }

  getAssignedToName(task: Task): string {
    return typeof task.assignedTo === 'string'
      ? task.assignedTo
      : task.assignedTo.username || '';
  }

  getCreatedByName(task: Task): string {
    return typeof task.createdBy === 'string'
      ? task.createdBy
      : task.createdBy.username || '';
  }

  editTask(task: Task): void {
    this.router.navigate(['/tasks', 'edit', task._id || task.id]);
  }

  deleteTask(taskId: string | undefined): void {
    if (!taskId || !confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.socketService.emitTaskDeleted(taskId);
      },
      error: (err) => {
        console.error('Error deleting task', err);
      }
    });
  }

  isManager(): boolean {
    return this.currentUser?.role === 'Manager';
  }

  isTeamLead(): boolean {
    return this.currentUser?.role === 'Team Lead';
  }

  canDelete(task: Task): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'Manager') return true;
    return typeof task.createdBy === 'string'
      ? task.createdBy === this.currentUser.id
      : task.createdBy.id === this.currentUser.id;
  }
}
