FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json only and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli@17.3.11

# Copy the rest of the application files
COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]