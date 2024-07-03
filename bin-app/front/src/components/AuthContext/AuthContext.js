// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin } from '../../api';
import { setAuthToken } from '../../api';
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fonction pour se connecter
  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      if (!data || !data.token) {
        throw new Error('Invalid credentials');
      }
      console.log('data:', data);
      console.log('data.token:', data.token);
      setUser(data.user);
      setToken(data.token);
      setAuthToken(data.token,logout);
      localStorage.setItem('token', data.token);
      console.log('localstorage token is : ', localStorage.getItem('token'));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  // Fonction pour simuler une déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('token');
    setOpenSnackbar(true);
  };


  // Vérifier si l'utilisateur est déjà connecté lors du chargement de la page
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token  }}>
      {children}
      <SnackbarAlert
        open={openSnackbar}
        message="Vous avez été déconnecté"
        color="info"
        onClose={() => setOpenSnackbar(false)}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;