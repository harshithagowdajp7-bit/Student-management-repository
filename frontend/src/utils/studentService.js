// Mock data service - simulates API calls with async/await and setTimeout
// This structure makes it easy to replace with real API calls later

const mockStudents = [
  {
    id: 1,
    name: 'John Doe',
    age: 20,
    course: 'Computer Science',
    email: 'john.doe@example.com'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 22,
    course: 'Mathematics',
    email: 'jane.smith@example.com'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    age: 21,
    course: 'Physics',
    email: 'mike.johnson@example.com'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    age: 19,
    course: 'Chemistry',
    email: 'sarah.williams@example.com'
  },
  {
    id: 5,
    name: 'David Brown',
    age: 23,
    course: 'Biology',
    email: 'david.brown@example.com'
  }
];

// Simulate network delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  // Get all students
  async getStudents() {
    await delay(); // Simulate network delay
    return { success: true, data: [...mockStudents] };
  },

  // Get student by ID
  async getStudentById(id) {
    await delay();
    const student = mockStudents.find(s => s.id === parseInt(id));
    if (student) {
      return { success: true, data: student };
    }
    return { success: false, error: 'Student not found' };
  },

  // Add new student
  async addStudent(studentData) {
    await delay();
    const newStudent = {
      id: Math.max(...mockStudents.map(s => s.id)) + 1,
      ...studentData,
      email: `${studentData.name.toLowerCase().replace(' ', '.')}@example.com`
    };
    mockStudents.push(newStudent);
    return { success: true, data: newStudent };
  },

  // Update student
  async updateStudent(id, studentData) {
    await delay();
    const index = mockStudents.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
      mockStudents[index] = {
        ...mockStudents[index],
        ...studentData,
        email: `${studentData.name.toLowerCase().replace(' ', '.')}@example.com`
      };
      return { success: true, data: mockStudents[index] };
    }
    return { success: false, error: 'Student not found' };
  },

  // Delete student
  async deleteStudent(id) {
    await delay();
    const index = mockStudents.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
      const deletedStudent = mockStudents.splice(index, 1)[0];
      return { success: true, data: deletedStudent };
    }
    return { success: false, error: 'Student not found' };
  },

  // Search students (simulated)
  async searchStudents(query) {
    await delay();
    const filtered = mockStudents.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.course.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, data: filtered };
  }
};
