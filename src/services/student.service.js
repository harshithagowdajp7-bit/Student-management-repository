const Student = require('../models/student.model');

// CREATE
exports.createStudent = async (data) => {
  try {
    const student = new Student(data);
    return await student.save();
  } catch (error) {
    throw new Error('Failed to create student: ' + error.message);
  }
};

// GET ALL (with pagination + search)
exports.getAllStudents = async (query) => {
  try {
    const { page = 1, limit = 5, search } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive partial match
    }

    const students = await Student.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // Sort by newest first

    const total = await Student.countDocuments(filter);
    return { students, total, page: parseInt(page), limit: parseInt(limit) };
  } catch (error) {
    throw new Error('Failed to fetch students: ' + error.message);
  }
};

// GET BY ID
exports.getStudentById = async (id) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      throw new Error('Invalid student ID');
    }
    return await Student.findById(id);
  } catch (error) {
    throw new Error('Failed to fetch students: ' + error.message);
  }
};

// UPDATE
exports.updateStudent = async (id, data) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      throw new Error('Invalid student ID');
    }
    return await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  } catch (error) {
    throw new Error('Failed to update student: ' + error.message);
  }
};

// DELETE
exports.deleteStudent = async (id) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      throw new Error('Invalid student ID');
    }
    const result = await Student.findByIdAndDelete(id);
    return !!result; // Return true if deleted
  } catch (error) {
    throw new Error('Failed to delete student: ' + error.message);
  }
};
