# Use Node 20 Alpine for small size
FROM node:20-alpine AS base
WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Expose the default Next.js dev port
EXPOSE 3000

# Command for development
CMD ["npm", "run", "dev"]
