# Frontend-Backend API Integration Guide

## Overview

This guide explains how the frontend React application has been integrated with the Node.js + Express + MongoDB backend to create a fully functional Student Management System.

## Architecture

### Frontend (Port 5173)
- **React + Vite**: Modern frontend framework
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Fetch API**: HTTP requests to backend

### Backend (Port 3000)
- **Node.js + Express**: REST API server
- **MongoDB**: Database for student data
- **CORS**: Cross-origin resource sharing
- **Mongoose**: MongoDB object modeling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update existing student |
| DELETE | `/api/students/:id` | Delete student |

## Integration Details

### 1. Environment Variables

Frontend `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. API Service Layer

**Location**: `src/services/studentService.js`

Key features:
- **Fetch API**: Native browser API for HTTP requests
- **Error Handling**: Comprehensive error catching and user-friendly messages
- **Retry Mechanism**: Automatic retries for failed requests (up to 3 times)
- **Network Error Detection**: Specific handling for connectivity issues

```javascript
// Example API call
const response = await fetch(`${API_BASE_URL}/students`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(studentData)
});
```

### 3. CORS Configuration

Backend CORS setup in `src/app.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Error Handling

#### Frontend Error Types:
- **Network Errors**: Connection issues, server down
- **HTTP Errors**: 4xx/5xx status codes
- **Validation Errors**: Backend validation failures
- **Not Found**: 404 errors for missing resources

#### User Feedback:
- **Toast Notifications**: Success/error messages
- **Loading States**: Visual feedback during operations
- **Error Boundaries**: Catch React component errors
- **Form Validation**: Client-side validation with backend confirmation

### 5. Optimistic UI Updates

Delete operations use optimistic updates:
```javascript
// Remove from UI immediately
setStudents(prev => prev.filter(student => student.id !== id));

// API call
const result = await studentService.deleteStudent(id);

// Rollback on failure
if (!result.success) {
  setStudents(originalStudents);
}
```

## Running the Application

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Step 1: Backend Setup

1. Navigate to root directory:
```bash
cd Student-management-repository
```

2. Install backend dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` in root):
```env
MONGODB_URI=mongodb://localhost:27017/student-management
PORT=3000
```

4. Start backend server:
```bash
npm start
```

Backend will run on: `http://localhost:3000`

### Step 2: Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start frontend development server:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 3: Test the Integration

1. Open browser to `http://localhost:5173`
2. Navigate to Dashboard
3. Test CRUD operations:
   - **Create**: Add new student
   - **Read**: View student list
   - **Update**: Edit existing student
   - **Delete**: Remove student

## Common Issues and Solutions

### 1. CORS Errors

**Problem**: `Access-Control-Allow-Origin` error

**Solution**: Ensure CORS is properly configured in backend:
```javascript
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
```

### 2. Network Errors

**Problem**: "Network error" or "Failed to fetch"

**Solutions**:
- Check if backend server is running on port 3000
- Verify API base URL in `.env` file
- Check firewall/antivirus blocking
- Ensure MongoDB connection is established

### 3. 404 Errors

**Problem**: API endpoints return 404

**Solutions**:
- Verify route paths in backend (`/api/students`)
- Check Express router configuration
- Ensure API base URL includes `/api` prefix

### 4. Validation Errors

**Problem**: Backend rejects form data

**Solutions**:
- Check backend validation middleware
- Ensure required fields are included
- Verify data types match backend expectations

### 5. MongoDB Connection Issues

**Problem**: Database connection failed

**Solutions**:
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database name exists

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Enable HTTPS

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy to static hosting (Vercel, Netlify)
3. Update API base URL to production backend
4. Configure CORS for production domain

## Monitoring and Debugging

### Frontend Debugging
- Browser DevTools: Network tab for API calls
- Console logs for error tracking
- React DevTools for component state

### Backend Debugging
- Server console logs
- MongoDB logs
- API testing tools (Postman, curl)

## Performance Optimizations

### Frontend
- **Code Splitting**: Lazy load routes
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search input optimization
- **Virtual Scrolling**: For large lists

### Backend
- **Database Indexing**: Optimize queries
- **Caching**: Redis for frequent data
- **Pagination**: Limit response sizes
- **Compression**: Gzip responses

## Security Considerations

### Frontend
- **Input Validation**: Client-side validation
- **XSS Prevention**: Sanitize user input
- **CSRF Protection**: Use tokens if needed

### Backend
- **Input Sanitization**: Validate all inputs
- **Rate Limiting**: Prevent abuse
- **Authentication**: JWT tokens (future enhancement)
- **HTTPS**: Secure communication

## Future Enhancements

1. **Authentication**: User login system
2. **Real-time Updates**: WebSocket integration
3. **File Upload**: Profile pictures
4. **Advanced Search**: Multiple filters
5. **Data Export**: CSV/PDF generation
6. **Mobile App**: React Native version

## Testing

### Frontend Tests
```bash
npm run test  # Unit tests
npm run test:e2e  # End-to-end tests
```

### Backend Tests
```bash
npm run test  # API tests
npm run test:integration  # Integration tests
```

## Troubleshooting Checklist

- [ ] Backend server running on port 3000?
- [ ] Frontend server running on port 5173?
- [ ] MongoDB connection established?
- [ ] CORS properly configured?
- [ ] API base URL correct in `.env`?
- [ ] No firewall blocking ports?
- [ ] Browser console clear of errors?
- [ ] Network tab shows successful API calls?

## Support

For issues:
1. Check browser console for errors
2. Verify backend server logs
3. Test API endpoints directly
4. Review this troubleshooting guide
