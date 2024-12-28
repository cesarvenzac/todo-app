import express from "express";
import path from "path";
import cors from "cors";
import { config } from "./config";
import { MongoDBService } from "./services/database.service";
import { AuthService } from "./services/auth.service";
import { TaskService } from "./services/task.service";
import { AuthController } from "./controllers/auth.controller";
import { TaskController } from "./controllers/task.controller";
import { createAuthRouter } from "./routes/auth.routes";
import { createTaskRouter } from "./routes/task.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { logger } from "./services/logger.service";

async function bootstrap() {
  try {
    // Initialize database
    const db = new MongoDBService(config.database.uri, config.database.name);
    await db.connect();

    // Initialize services
    const authService = new AuthService(db);
    const taskService = new TaskService(db);

    // Initialize controllers
    const authController = new AuthController(authService);
    const taskController = new TaskController(taskService);

    // Create Express app
    const app = express();

    // Serve static files from the "uploads" directory
    app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

    // CORS configuration
    app.use(
      cors({
        origin: ["http://localhost:4200"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use("/api/auth", createAuthRouter(authController));
    app.use("/api/tasks", createTaskRouter(taskController, authService));

    // Error handling
    app.use(notFound);
    app.use(errorHandler);

    // Start server
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
