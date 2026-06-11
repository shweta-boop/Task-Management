# Role-Based Task Management System

A complete MEAN stack application with role-based authorization, real-time task updates, and user-friendly task management interface.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Role-Based Authorization**: Three roles - Manager, Team Lead, and Employee with different permissions
- **Task Management**: Full CRUD operations with task filtering and status management
- **Real-Time Updates**: WebSocket integration for real-time task synchronization
- **Responsive UI**: Built with Angular and Bootstrap for mobile-friendly experience
- **Form Validation**: Client-side and server-side validation
- **Role-Specific Dashboards**: Different views for different user roles

## Architecture

### Backend
- **Node.js & Express**: RESTful API server
- **MongoDB**: NoSQL database for data persistence
- **JWT**: Token-based authentication
- **Socket.io**: Real-time bidirectional communication
- **Bcryptjs**: Password hashing and security

### Frontend
- **Angular 15**: Modern SPA framework
- **Bootstrap 5**: Responsive CSS framework
- **RxJS**: Reactive programming library
- **Socket.io Client**: Real-time communication

### Database
- **MongoDB Atlas**: Cloud-hosted MongoDB database

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task operations
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── roleAuth.js        # Role-based authorization
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── tasks.js           # Task routes
│   ├── server.js              # Express app setup
│   ├── .env.example           # Environment variables template
│   └── package.json           # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── auth/           # Login & Register
│   │   │   │   ├── dashboard/      # Main dashboard
│   │   │   │   └── tasks/          # Task management
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts   # Route protection
│   │   │   ├── models/
│   │   │   │   └── index.ts        # Data models
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── task.service.ts
│   │   │   │   ├── socket.service.ts
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── plan.md
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

5. Start the backend server:
```bash
# Development with hot reload
npm run dev

# Production
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200`

### Testing the Application

#### Demo Accounts

Manager:
- Email: `manager@test.com`
- Password: `password123`
- Role: Manager

Team Lead:
- Email: `teamlead@test.com`
- Password: `password123`
- Role: Team Lead

Employee:
- Email: `employee@test.com`
- Password: `password123`
- Role: Employee

#### Features by Role

**Manager**:
- View all users and tasks
- Create, update, and delete tasks
- Assign tasks to any user (Team Lead, Employee, or self)
- View team structure with team leads and their tasks
- Modify and reassign any task

**Team Lead**:
- View and manage team members' tasks
- Create and assign tasks to team members or self
- Update and delete their own tasks and team member tasks
- View their team members list

**Employee**:
- Create tasks (automatically assigned to self)
- Update their own tasks
- View their tasks
- Cannot reassign or delete other users' tasks

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/users` | Get all users (Team Lead, Manager only) |
| POST | `/api/auth/assign-team-members` | Assign team members (Team Lead, Manager only) |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get user's tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## WebSocket Events

### Client Events
- `user-online`: User comes online (sends userId)
- `task-created`: New task created (sends task object)
- `task-updated`: Task updated (sends updated task object)
- `task-deleted`: Task deleted (sends taskId)

### Server Events
- `users-online`: List of online users
- `task-created`: Receive new task updates
- `task-updated`: Receive task update notifications
- `task-deleted`: Receive task deletion notifications

## Database Schema

### User Collection
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (Manager, Team Lead, Employee),
  reportingTo: ObjectId (reference to User),
  teamMembers: [ObjectId] (references to Users),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  title: String (required),
  description: String,
  status: String (pending, in-progress, completed),
  createdBy: ObjectId (reference to User),
  assignedTo: ObjectId (reference to User),
  priority: String (low, medium, high),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Deploy Backend to Heroku

1. Create Heroku account and install Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create Heroku app:
```bash
cd backend
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FRONTEND_URL=your_frontend_url
```

5. Deploy:
```bash
git push heroku main
```

### Deploy Frontend to Vercel

1. Create Vercel account
2. Connect GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/task-management`

4. Deploy

### MongoDB Atlas Setup

1. Create account on MongoDB Atlas
2. Create a new cluster
3. Create database user
4. Get connection string
5. Update `.env` with connection string

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

## Technologies Used

### Frontend
- Angular 15
- Bootstrap 5
- TypeScript
- RxJS
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- Bcryptjs
- Socket.io
- CORS

### Tools
- Git
- Postman (for API testing)
- MongoDB Compass (for database management)

## Troubleshooting

### CORS Issues
- Ensure FRONTEND_URL in backend `.env` matches your frontend URL
- Check CORS configuration in server.js

### WebSocket Connection Issues
- Verify Socket.io is properly configured
- Check firewall and network settings
- Ensure both frontend and backend are running

### Database Connection Issues
- Verify MongoDB connection string
- Check MongoDB Atlas network access
- Ensure credentials are correct

### Authentication Issues
- Clear browser local storage and cookies
- Verify JWT_SECRET is set correctly
- Check token expiration settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Future Enhancements

- [ ] Email notifications for task updates
- [ ] Task comments and activity log
- [ ] File attachments for tasks
- [ ] Task templates
- [ ] Advanced filtering and search
- [ ] Analytics dashboard
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] Activity audit log

---

**Note**: This is a demonstration project. For production use, ensure proper security measures, error handling, and testing are implemented.
