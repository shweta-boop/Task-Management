# Backend - Task Management API

Express.js backend for the Role-Based Task Management System with JWT authentication and MongoDB integration.

## Features

- JWT-based authentication
- Role-based authorization (Manager, Team Lead, Employee)
- Complete task CRUD operations
- Real-time updates via Socket.io
- Input validation using express-validator
- Error handling and logging
- CORS support

## Prerequisites

- Node.js v14 or higher
- npm v6 or higher
- MongoDB (local or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "Employee"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Employee"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Employee"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Employee",
    "teamMembers": [],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get All Users
```
GET /api/auth/users?role=Employee
Authorization: Bearer <token>
(Only Team Lead and Manager can access)

Response:
{
  "success": true,
  "users": [
    {
      "id": "507f1f77bcf86cd799439012",
      "username": "jane_doe",
      "email": "jane@example.com",
      "role": "Employee"
    }
  ]
}
```

### Task Endpoints

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Project Report",
  "description": "Finish the quarterly project report",
  "priority": "high",
  "dueDate": "2023-12-31T23:59:59Z",
  "assignedTo": "507f1f77bcf86cd799439012"
}

Response:
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Complete Project Report",
    "description": "Finish the quarterly project report",
    "status": "pending",
    "priority": "high",
    "createdBy": { ... },
    "assignedTo": { ... },
    "dueDate": "2023-12-31T23:59:59Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get All Tasks
```
GET /api/tasks?status=pending
Authorization: Bearer <token>

Response:
{
  "success": true,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Complete Project Report",
      "status": "pending",
      "priority": "high",
      "createdBy": { ... },
      "assignedTo": { ... },
      "dueDate": "2023-12-31T23:59:59Z",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Task by ID
```
GET /api/tasks/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "task": { ... }
}
```

#### Update Task
```
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "in-progress",
  "priority": "medium"
}

Response:
{
  "success": true,
  "task": { ... }
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens expire in 30 days.

## Role-Based Permissions

### Manager
- View all tasks and users
- Create, update, delete any task
- Assign tasks to any user
- View team leads and their tasks

### Team Lead
- View and manage team members' tasks
- Create and assign tasks to team members
- Update own tasks and team members' tasks
- Cannot delete other users' tasks (except own)

### Employee
- Create tasks (automatically assigned to self)
- Update own tasks
- Cannot assign tasks to others
- Cannot delete other users' tasks

## WebSocket Events

### Connection
```javascript
socket.connect();
socket.emit('user-online', userId);
```

### Listen Events
```javascript
socket.on('users-online', (userIds) => { ... });
socket.on('task-created', (task) => { ... });
socket.on('task-updated', (task) => { ... });
socket.on('task-deleted', (taskId) => { ... });
```

### Emit Events
```javascript
socket.emit('task-created', task);
socket.emit('task-updated', task);
socket.emit('task-deleted', taskId);
```

## Error Handling

The API returns standard HTTP status codes:

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid"
    }
  ]
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:4200` |

## Deployment

### Docker
```bash
docker build -t task-management-backend .
docker run -p 5000:5000 task-management-backend
```

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens expire in 30 days
- All endpoints validate input using express-validator
- CORS is configured to allow only specified origins
- Rate limiting is recommended for production

## Development

### Code Structure
- `server.js` - Express app and Socket.io setup
- `config/db.js` - Database connection
- `models/` - Mongoose schemas
- `controllers/` - Business logic
- `routes/` - API endpoints
- `middleware/` - Authentication and authorization

### Adding New Features
1. Create model in `models/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Add routes to `server.js`
5. Implement Socket.io events if needed

## Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify network access in MongoDB Atlas
- Ensure credentials are correct

### JWT Errors
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure token hasn't expired

### CORS Errors
- Update FRONTEND_URL in .env
- Check browser console for exact error
- Verify credentials: true is set in Socket.io

## Testing with Postman

1. Register a user
2. Copy the returned token
3. Set `Authorization` header to `Bearer <token>`
4. Test endpoints

Example Postman variables:
- `{{base_url}}` = `http://localhost:5000`
- `{{token}}` = JWT token from login

---

For more information, see the main [README.md](../README.md)
