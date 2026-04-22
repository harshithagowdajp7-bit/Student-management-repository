import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser()
          setUser(userData.user)
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('token')
          setError('Session expired. Please login again.')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authAPI.login(email, password)
      
      // Store token
      localStorage.setItem('token', response.data.token)
      
      // Update user state
      setUser(response.data.user)
      
      return response
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      setError(errorMessage)
      throw error
    }
  }

  const signup = async (name, email, password) => {
    try {
      setError(null)
      const response = await authAPI.signup(name, email, password)
      
      // Store token
      localStorage.setItem('token', response.data.token)
      
      // Update user state
      setUser(response.data.user)
      
      return response
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed'
      setError(errorMessage)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token')
      setUser(null)
      setError(null)
    }
  }

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null)
      const response = await authAPI.updatePassword(currentPassword, newPassword)
      
      // Update token with new one
      localStorage.setItem('token', response.data.token)
      
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password update failed'
      setError(errorMessage)
      throw error
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updatePassword,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
