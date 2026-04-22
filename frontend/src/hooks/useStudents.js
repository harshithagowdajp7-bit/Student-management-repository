import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/studentService';

// Custom hook for student data management
// Demonstrates useState, useEffect, and useCallback concepts
export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentService.getStudents();
      if (result.success) {
        setStudents(result.data.students || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  const addStudent = useCallback(async (studentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentService.createStudent(studentData);
      if (result.success) {
        setStudents(prev => [...prev, result.data]);
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError('Failed to add student. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (id, studentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentService.updateStudent(id, studentData);
      if (result.success) {
        setStudents(prev => 
          prev.map(student => 
            student.id === parseInt(id) ? result.data : student
          )
        );
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError('Failed to update student. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Optimistic UI update - remove student immediately
      const originalStudents = [...students];
      setStudents(prev => prev.filter(student => student.id !== parseInt(id)));
      
      const result = await studentService.deleteStudent(id);
      if (!result.success) {
        // Rollback on failure
        setStudents(originalStudents);
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to delete student. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [students]);

  const searchStudents = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentService.searchStudents(query);
      if (result.success) {
        setStudents(result.data.students || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to search students');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    students,
    loading,
    error,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents
  };
};
