# Project Structure

## Directory Organization

```
cesarvenzac-todo-app/
├── backend/                 # Express.js backend
│   ├── controllers/        # Request handlers
│   ├── services/          # Business logic
│   ├── middlewares/       # Custom middlewares
│   ├── routes/            # API routes
│   └── uploads/           # File storage
└── frontend/              # Angular frontend
    └── src/
        ├── app/
        │   ├── components/    # UI components
        │   ├── services/      # Data services
        │   ├── guards/        # Route protection
        │   ├── interceptors/  # HTTP interceptors
        │   └── pipes/         # Data transformation
```

## Key Components

### Backend Components
1. **Controllers**
   - `authController.js`: Handles authentication requests
   - `taskController.js`: Manages task operations

2. **Services**
   - `authService.js`: Authentication business logic
   - `taskService.js`: Task management logic

3. **Middlewares**
   - `authMiddleware.js`: JWT validation

### Frontend Components
1. **Core Components**
   - `AppComponent`: Application shell
   - `CardComponent`: Task card display
   - `TasksComponent`: Task management
   - `LoginComponent`: User authentication
   - `RegisterComponent`: User registration

2. **Services**
   - `AuthService`: Authentication state management
   - `AuthGuard`: Route protection
   - `AuthInterceptor`: Token injection

3. **Utilities**
   - `FilterPipe`: Task filtering