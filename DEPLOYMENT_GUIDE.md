# Render Deployment Guide

This guide covers both **Normal Deployment** and **Docker Deployment** on Render.

## Prerequisites
- A GitHub repository with your code.
- A Cloudinary account for image uploads.
- A MongoDB Atlas account for the production database.

---

## 1. Normal Deployment (Recommended for simplicity)

### A. Backend (Node.js)
1. Log in to [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your repository.
4. **Environment**: `Node`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A strong random string)
   - `CLOUDINARY_CLOUD_NAME`: (From Cloudinary)
   - `CLOUDINARY_API_KEY`: (From Cloudinary)
   - `CLOUDINARY_API_SECRET`: (From Cloudinary)
   - `NODE_ENV`: `production`

### B. Frontend (React/Vite)
1. Click **New** -> **Static Site**.
2. Connect your repository.
3. **Build Command**: `cd frontend && npm install && npm run build`
4. **Publish Directory**: `frontend/dist`
5. **Environment Variables**:
   - `VITE_API_BASE_URL`: (The URL of your deployed Render backend)
6. **Redirects**: Add a "Rewrite" rule from `/*` to `/index.html` (Status 200) to support React Router.

---

## 2. Docker Deployment (For consistency)

1. Click **New** -> **Web Service**.
2. Connect your repository.
3. **Runtime**: `Docker`
4. **Dockerfile Path**: `Dockerfile` (for backend) or `frontend/Dockerfile` (for frontend).
5. Add the same Environment Variables as in Method 1.

---

## Common Errors & Fixes

### 1. CORS Errors
**Issue**: Frontend cannot talk to backend.
**Fix**: Ensure `origin` in `src/app.js` includes your deployed frontend URL.

### 2. "secretOrPrivateKey must have a value"
**Issue**: `JWT_SECRET` environment variable is missing.
**Fix**: Add it in the Render dashboard under "Environment".

### 3. Port Conflicts
**Issue**: Render expects your app to listen on port `10000` by default, but provides a `PORT` env var.
**Fix**: Ensure your backend uses `process.env.PORT || 3000`.

### 4. White Screen on Frontend
**Issue**: React Router paths not found on refresh.
**Fix**: Add the rewrite rule in Render (Static Site settings) to redirect all paths to `index.html`.
