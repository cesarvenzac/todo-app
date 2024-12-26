# Todo List Application

A modern task management application built with Express.js, Angular, and MongoDB, designed for efficient task organization and team collaboration.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![Angular](https://img.shields.io/badge/angular-17-red)

## Features

### Core Features

- **Secure Authentication System**

  - JWT-based authentication
  - User registration with profile customization
  - Protected routes and secure endpoints

- **Task Management**
  - Intuitive task creation and editing
  - Status tracking (To Start, In Progress, Completed)
  - Priority levels (Low, Medium, High)
  - Real-time progress visualization
  - Priority distribution analytics

### Coming Soon

- Team collaboration features
- Project management capabilities
- Enhanced task features (attachments, comments, due dates)
- Notifications system
- Mobile optimization

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
- [Development Roadmap](documentation/plan.md)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
