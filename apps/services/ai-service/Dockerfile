# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or bun.lockb) to leverage Docker's layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application's source code into the container
COPY . .

# Expose the port that the application runs on
EXPOSE 4003

# Define the command to run your application in development mode
CMD ["npm", "run", "dev"]