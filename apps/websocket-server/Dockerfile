# Use a Node.js base image
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json 
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Additionally, install TypeScript and the types for Express
RUN npm install typescript @types/express

# Copy the rest of the codebase into the image
COPY . .

# Build the TypeScript project
RUN npm run build

# Multi-stage build: Start a new stage from node:alpine to keep the image small
FROM node:16-alpine

WORKDIR /usr/src/app

# Copy the build artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the port the server listens on
EXPOSE 8080

# Command to run the application
CMD [ "node", "dist/websocket-server.js" ]
