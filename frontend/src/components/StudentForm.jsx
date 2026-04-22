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
    course: '',
    image: 'https://res.cloudinary.com/dcl76m2qy/image/upload/v1713783582/default-avatar_v9jw5k.png'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Validation errors state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age || '',
        course: student.course || '',
        image: student.image || 'https://res.cloudinary.com/dcl76m2qy/image/upload/v1713783582/default-avatar_v9jw5k.png'
      });
      setImagePreview(student.image || null);
    }
  }, [student]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;
    
    setIsUploading(true);
    const data = new FormData();
    data.append('image', imageFile);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/students/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });
      const result = await response.json();
      return result.url;
    } catch (err) {
      console.error('Image upload failed:', err);
      return formData.image;
    } finally {
      setIsUploading(false);
    }
  };

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsUploading(true);
      const imageUrl = await uploadImage();
      
      const submissionData = {
        ...formData,
        age: parseInt(formData.age),
        image: imageUrl
      };
      onSubmit(submissionData);
      setIsUploading(false);
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
          {/* Image Upload */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span>Change Profile Picture</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={loading || isUploading} />
            </label>
          </div>

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
              loading={loading || isUploading}
              disabled={loading || isUploading}
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
