import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../utils/studentService';

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
        setStudents(result.data);
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
      const result = await studentService.addStudent(studentData);
      if (result.success) {
        setStudents(prev => [...prev, result.data]);
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError('Failed to add student');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (id, studentData) => {
    try {
      setLoading(true);
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
      setError('Failed to update student');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    try {
      setLoading(true);
      const result = await studentService.deleteStudent(id);
      if (result.success) {
        setStudents(prev => prev.filter(student => student.id !== parseInt(id)));
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('Failed to delete student');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchStudents = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentService.searchStudents(query);
      if (result.success) {
        setStudents(result.data);
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
