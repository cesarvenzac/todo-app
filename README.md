# Todo List Application

A modern task management application built with Express.js, Angular, and MongoDB, designed for efficient task organization and team collaboration.

![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![Angular](https://img.shields.io/badge/angular-17-red)

## Features

### Authentication System

- **Secure User Management**
  - User registration with personal information
  - Avatar upload capability
  - Newsletter subscription option
  - Terms consent handling
  - JWT-based authentication
  - Protected routes and secure endpoints

### Task Management

- **Comprehensive Task Control**
  - Create, edit, and delete tasks
  - Rich task descriptions
  - Status tracking (To Start, In Progress, Completed)
  - Priority levels (Low, Medium, High)
  - Due dates management
  - Categories and tags support
  - Drag-and-drop task organization
  - Detailed task modal view

### Coming Soon

- **Team Collaboration**

  - Team creation and management
  - User invitations system
  - Role-based permissions
  - Shared task lists

- **Project Management**

  - Project creation and assignment
  - Progress tracking
  - Multi-project support

- **Enhanced Task Features**
  - File attachments
  - Task comments
  - Task sharing
  - Notification system

## Tech Stack

### Backend

- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads
- bcrypt for security

### Frontend

- Angular 17
- Angular Router
- HttpClient
- Custom CSS with Variables
- Angular CDK for Drag & Drop

### Infrastructure

- Docker & Docker Compose
- RESTful API architecture
- Microservices design

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js ≥ 14
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/todo-list-app.git
cd todo-list-app
```

2. Set up environment variables

```bash
cp .env.example .env
```

3. Launch with Docker

```bash
docker-compose up --build
```

### Development Mode

```bash
npm install
npm run dev
```

### Testing

```bash
npm run test
```

## Documentation

Detailed documentation is available in the `/documentation` directory:

- [Technical Description](documentation/description.md)
- [Feature List](documentation/features.md)
- [Architecture Overview](documentation/structure.md)
- [Development Plan](documentation/plan.md)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
