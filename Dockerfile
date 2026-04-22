# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Create a sample .env file if it doesn't exist (Production should provide actual variables)
RUN cp .env.example .env || true

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
