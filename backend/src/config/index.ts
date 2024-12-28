import { config as dotenvConfig } from "dotenv";
import { join } from "path";

// Load .env file
dotenvConfig();

const env = process.env.NODE_ENV || "development";

export const config = {
  env,
  port: parseInt(process.env.PORT || "5038", 10),
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
    name: process.env.DATABASE_NAME || "todo_app",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:4200",
  },
  upload: {
    directory: process.env.UPLOAD_DIR || "uploads",
    maxSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/gif").split(","),
  },
  logging: {
    level: process.env.LOG_LEVEL || "debug",
    file: process.env.LOG_FILE_PATH || join(__dirname, "../../logs/app.log"),
  },
};
