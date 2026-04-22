const service = require('../services/student.service');

// CREATE
exports.createStudent = async (req, res, next) => {
  try {
    const student = await service.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// GET ALL
exports.getAllStudents = async (req, res, next) => {
  try {
    const result = await service.getAllStudents(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET BY ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await service.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await service.updateStudent(req.params.id, req.body);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteStudent = async (req, res, next) => {
  try {
    const success = await service.deleteStudent(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
