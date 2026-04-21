const service = require('../services/student.service');

// CREATE
exports.createStudent = (req, res) => {
  const student = service.createStudent(req.body);
  res.status(201).json(student);
};

// GET ALL
exports.getAllStudents = (req, res) => {
  const students = service.getAllStudents(req.query);
  res.status(200).json(students);
};

// GET BY ID
exports.getStudentById = (req, res, next) => {
  const student = service.getStudentById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
};

// UPDATE
exports.updateStudent = (req, res) => {
  const student = service.updateStudent(req.params.id, req.body);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
};

// DELETE
exports.deleteStudent = (req, res) => {
  const success = service.deleteStudent(req.params.id);

  if (!success) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json({ message: "Deleted successfully" });
};