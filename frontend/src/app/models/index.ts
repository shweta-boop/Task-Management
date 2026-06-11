export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  role: 'Manager' | 'Team Lead' | 'Employee';
  reportingTo?: string;
  teamMembers?: User[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Task {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdBy: User | string;
  assignedTo: User | string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface TaskResponse {
  success: boolean;
  task: Task;
}

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}
