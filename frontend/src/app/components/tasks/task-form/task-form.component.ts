import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { SocketService } from '../../../services/socket.service';
import { User } from '../../../models';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  isEditing = false;
  taskId: string | null = null;
  currentUser: User | null = null;
  teamMembers: User[] = [];
  allUsers: User[] = [];
  router: Router;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    router: Router
  ) {
    this.router = router;
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      priority: ['medium', Validators.required],
      status: ['pending', Validators.required],
      dueDate: ['', Validators.required],
      assignedTo: ['', Validators.required]
    });
  }

  get f() {
    return this.taskForm.controls;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser, "currentUser");
      if (user) {
        this.loadUsers();
      }
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.taskId = id;
        this.loadTask(id);
      } else {
        this.taskForm.get('assignedTo')?.setValue(this.currentUser?.id);
      }
    });
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (response) => {
        this.allUsers = response.users;
        console.log(this.allUsers);
        console.log(this.allUsers[0]);
        console.log(this.allUsers[0]._id);
        console.log(this.allUsers[0].id);
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  loadTask(id: string): void {
    this.taskService.getTaskById(id).subscribe({
      next: (response) => {
        const task = response.task;
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          assignedTo: typeof task.assignedTo === 'string' ? task.assignedTo : task.assignedTo._id
        });
      },
      error: (err) => {
        console.error('Error loading task', err);
        this.error = 'Failed to load task';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.taskForm.value;
    console.log(formValue, "formValue");
    if (this.isEditing && this.taskId) {
      this.taskService.updateTask(this.taskId, formValue).subscribe({
        next: (response) => {
          this.socketService.emitTaskUpdated(response.task);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update task';
          this.loading = false;
        }
      });
    } else {
      this.taskService.createTask(
        formValue.title,
        formValue.description,
        formValue.priority,
        formValue.assignedTo,
        formValue.dueDate
      ).subscribe({
        next: (response) => {
          this.socketService.emitTaskCreated(response.task);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create task';
          this.loading = false;
        }
      });
    }
  }

  canAssignToOthers(): boolean {
    return this.currentUser?.role === 'Manager' || this.currentUser?.role === 'Team Lead';
  }
}
