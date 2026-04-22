import React, { useState, useEffect } from 'react';
import { Button } from './Button';

// Reusable StudentForm component
// Demonstrates useState, useEffect, form validation, and closures
export const StudentForm = ({ 
  student = null, 
  onSubmit, 
  loading = false,
  onCancel 
}) => {
  // Form state using useState
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: ''
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({});

  // useEffect to populate form when editing existing student
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age || '',
        course: student.course || ''
      });
    }
  }, [student]);

  // Handle input changes with closure to capture field name
  const handleInputChange = (fieldName) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) < 16 || parseInt(formData.age) > 100) {
      newErrors.age = 'Age must be between 16 and 100';
    }
    
    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    } else if (formData.course.trim().length < 2) {
      newErrors.course = 'Course must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submissionData = {
        ...formData,
        age: parseInt(formData.age)
      };
      onSubmit(submissionData);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      course: ''
    });
    setErrors({});
  };

  return (
    <section className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {student ? 'Edit Student' : 'Add New Student'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter student name"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange('age')}
              className={`input-field ${errors.age ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter student age"
              min="16"
              max="100"
              disabled={loading}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.age}
              </p>
            )}
          </div>

          {/* Course Field */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange('course')}
              className={`input-field ${errors.course ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            >
              <option value="">Select a course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
            </select>
            {errors.course && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.course}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {student ? 'Update Student' : 'Add Student'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel || handleReset}
              disabled={loading}
              className="flex-1"
            >
              {onCancel ? 'Cancel' : 'Reset'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
