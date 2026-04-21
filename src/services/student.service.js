const Student = require('../models/student.model');
const generateId = require('../utils/generateId');

let students = []; // in-memory storage

// CREATE
exports.createStudent = (data) => {
  const newStudent = new Student({
    id: generateId(),
    ...data,
  });
  students.push(newStudent);
  return newStudent;
};

// GET ALL (with pagination + search)
exports.getAllStudents = (query) => {
  let result = [...students];

  if (query.search) {
    result = result.filter(s =>
      s.name.toLowerCase().includes(query.search.toLowerCase())
    );
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;

  const start = (page - 1) * limit;
  return result.slice(start, start + limit);
};

// GET BY ID
exports.getStudentById = (id) => {
  return students.find(s => s.id === id);
};

// UPDATE
exports.updateStudent = (id, data) => {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;

  students[index] = { ...students[index], ...data };
  return students[index];
};

// DELETE
exports.deleteStudent = (id) => {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return false;

  students.splice(index, 1);
  return true;
};