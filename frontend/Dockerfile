# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
# Set the API URL for production build
ENV VITE_API_BASE_URL=https://student-management-api.onrender.com
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config (optional, for SPA routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
