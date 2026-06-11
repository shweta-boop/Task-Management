# Role-Based Task Management System

A full-stack MEAN application for managing tasks with Role-Based Access Control (RBAC), JWT Authentication, Real-Time Updates using Socket.IO, and MongoDB Atlas.

## Live Demo

**Frontend:** https://task-management-rose-eight.vercel.app

**Backend API:** https://task-management-jf71.onrender.com

---

## Features

### Authentication & Authorization

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* Role-Based Access Control (RBAC)

### User Roles

#### Manager

* View all users and tasks
* Create, update, delete, and reassign tasks
* Assign tasks to any user or self
* View team leads and their tasks

#### Team Lead

* View team members
* Create and assign tasks to team members
* Update and manage assigned tasks
* Assign tasks to self

#### Employee

* Create tasks
* Tasks are automatically assigned to self
* Update own tasks
* View own tasks

### Task Management

* Create Task
* Update Task
* Delete Task
* Change Task Status
* Task Priority Support
* Filter Tasks by Status

### Real-Time Updates

* Implemented using Socket.IO
* Task updates are reflected instantly across connected users without page refresh

---

## Tech Stack

### Frontend

* Angular 15
* TypeScript
* Bootstrap 5
* RxJS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT (jsonwebtoken)
* BcryptJS
* Socket.IO

---

## Project Structure

```text
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
└── server.js

frontend/
├── components/
├── services/
├── guards/
├── models/
└── environments/
```

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:4200
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Demo Accounts

### Manager

Email: [manager@test.com]

Password: password123

### Team Lead

Email: [teamlead@test.com]

Password: password123

### Employee

Email: [employee@test.com]

Password: password123

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
GET /api/auth/users
```

### Tasks

```http
POST /api/tasks
GET /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

---

## Database Schema

### User

```javascript
{
  username,
  email,
  password,
  role,
  reportingTo,
  teamMembers
}
```

### Task

```javascript
{
  title,
  description,
  status,
  priority,
  createdBy,
  assignedTo,
  dueDate
}
```

---

### Frontend

* Vercel

### Backend

* Render

### Database

* MongoDB Atlas

---

## Key Learnings

* JWT Authentication & Authorization
* Role-Based Access Control (RBAC)
* Real-Time Communication with Socket.IO
* MongoDB Atlas Integration
* Angular Reactive Forms & Validation
* REST API Design using Express.js
* Cloud Deployment using Render and Vercel

---

## Summary


This project demonstrates a complete MEAN stack application featuring authentication, role-based authorization, real-time communication, and cloud deployment using modern web technologies.
