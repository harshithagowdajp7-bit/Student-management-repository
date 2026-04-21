class Student {
  constructor({ id, name, age, course }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.course = course;
    this.createdAt = new Date();
  }
}

module.exports = Student;