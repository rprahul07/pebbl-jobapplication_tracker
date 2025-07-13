/**
 * AppContext for Job Application Tracker.
 * Provides global user and applications state via Context API, integrated with backend.
 */
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import api from '../api/axios';

const initialState = {
  user: null,
  applications: [],
  loading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'SET_USER':
      return { ...state, user: action.user, loading: false, error: null };
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.applications, loading: false, error: null };
    case 'LOGOUT':
      return { ...state, user: null, applications: [], loading: false, error: null };
    default:
      return state;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user from /api/auth/profile if JWT exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
      fetchApplications();
    }
    // eslint-disable-next-line
  }, []);

  // Auth actions
  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      dispatch({ type: 'SET_USER', user: res.data.user });
      fetchApplications();
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err.response?.data?.message || 'Login failed' });
      return { success: false, error: err.response?.data?.message };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await api.post('/auth/register', { name, email, password });
      // Auto-login after register
      return await login(email, password);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err.response?.data?.message || 'Register failed' });
      return { success: false, error: err.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const fetchUser = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await api.get('/auth/profile');
      dispatch({ type: 'SET_USER', user: res.data });
    } catch (err) {
      logout();
    }
  };

  // Applications actions
  const fetchApplications = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await api.get('/jobs');
      dispatch({ type: 'SET_APPLICATIONS', applications: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err.response?.data?.message || 'Failed to load applications' });
    }
  };

  // Provide all actions and state
  return (
    <AppContext.Provider value={{ ...state, dispatch, login, register, logout, fetchUser, fetchApplications }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
} 