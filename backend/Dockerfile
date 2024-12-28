# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --no-package-lock

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

# Copy TypeScript config
COPY tsconfig.json ./

# Create necessary directories
RUN mkdir -p src dist uploads logs

# Copy source code
COPY src ./src

# Build TypeScript code
RUN npm run build

# Verify the build
RUN ls -la dist/

# Expose the port the app runs on
EXPOSE 5038

# Run compiled JavaScript
CMD ["npm", "start"]