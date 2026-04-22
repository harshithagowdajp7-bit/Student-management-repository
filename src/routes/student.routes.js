const express = require('express');
const controller = require('../controllers/student.controller');
const validate = require('../middlewares/validate.middleware');
const upload = require('../config/cloudinary');

const router = express.Router();

// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});

router.post('/', validate, controller.createStudent);
router.get('/', controller.getAllStudents);
router.get('/:id', controller.getStudentById);
router.put('/:id', validate, controller.updateStudent);
router.delete('/:id', controller.deleteStudent);

module.exports = router;