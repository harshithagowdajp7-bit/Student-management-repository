// Real API service for student management
// Replaces mock data with actual backend API calls using fetch API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function for API requests
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.error || 
        `HTTP error! status: ${response.status}`
      );
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors and other exceptions
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and ensure the backend server is running.');
    }
    throw error;
  }
};

// Retry mechanism for failed requests
const apiRequestWithRetry = async (url, options = {}, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest(url, options);
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.message.includes('HTTP error! status: 4')) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }
  
  throw lastError;
};

export const studentService = {
  // Get all students
  async getStudents() {
    try {
      const response = await apiRequestWithRetry('/students');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get student by ID
  async getStudentById(id) {
    try {
      const response = await apiRequestWithRetry(`/students/${id}`);
      return { success: true, data: response };
    } catch (error) {
      if (error.message.includes('HTTP error! status: 404')) {
        return { success: false, error: 'Student not found' };
      }
      return { success: false, error: error.message };
    }
  },

  // Add new student
  async createStudent(studentData) {
    try {
      const response = await apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
      return { success: true, data: response };
    } catch (error) {
      // Handle validation errors
      if (error.message.includes('HTTP error! status: 400')) {
        return { 
          success: false, 
          error: 'Invalid student data. Please check all fields and try again.',
          validationError: true
        };
      }
      return { success: false, error: error.message };
    }
  },

  // Update student
  async updateStudent(id, studentData) {
    try {
      const response = await apiRequest(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      });
      return { success: true, data: response };
    } catch (error) {
      if (error.message.includes('HTTP error! status: 404')) {
        return { success: false, error: 'Student not found' };
      }
      if (error.message.includes('HTTP error! status: 400')) {
        return { 
          success: false, 
          error: 'Invalid student data. Please check all fields and try again.',
          validationError: true
        };
      }
      return { success: false, error: error.message };
    }
  },

  // Delete student
  async deleteStudent(id) {
    try {
      await apiRequest(`/students/${id}`, {
        method: 'DELETE',
      });
      return { success: true };
    } catch (error) {
      if (error.message.includes('HTTP error! status: 404')) {
        return { success: false, error: 'Student not found' };
      }
      return { success: false, error: error.message };
    }
  },

  // Search students (if backend supports it)
  async searchStudents(query) {
    try {
      const response = await apiRequestWithRetry(`/students?search=${encodeURIComponent(query)}`);
      return { success: true, data: response };
    } catch (error) {
      // If search endpoint doesn't exist, fallback to client-side filtering
      if (error.message.includes('HTTP error! status: 404')) {
        const allStudents = await this.getStudents();
        if (allStudents.success) {
          const filtered = allStudents.data.students?.filter(student =>
            student.name.toLowerCase().includes(query.toLowerCase()) ||
            student.course.toLowerCase().includes(query.toLowerCase())
          );
          return { success: true, data: { students: filtered } };
        }
        return allStudents;
      }
      return { success: false, error: error.message };
    }
  }
};
