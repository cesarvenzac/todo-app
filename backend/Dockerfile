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

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5038

# Command to run the application
CMD ["node", "index.js"]