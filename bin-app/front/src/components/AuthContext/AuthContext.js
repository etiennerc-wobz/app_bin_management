// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../../api';
import { setAuthToken } from '../../api';
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userFavoriteFestivalId, setUserFavoriteFestivalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fonction pour se connecter
  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      if (!data || !data.token) {
        throw new Error('Invalid credentials');
      }
      
      
      setUser(data.user);
      setToken(data.token);
      setUserFavoriteFestivalId(data.user.festival);
      setAuthToken(data.token,logout);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const data = await apiRegister(username, password);
      console.log('register response : ', data);

      setUser(data.user);
      setToken(data.token);
      setAuthToken(data.token, logout);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('token');
    setSnackbarMessage('Vous êtes déconnecté');
    setOpenSnackbar(true);
  };

  const notLogged = () => {
    setSnackbarMessage('Vous devez vous connecter');
    setOpenSnackbar(true);
    return <Navigate to="/login" />
  };


  // Vérifier si l'utilisateur est déjà connecté lors du chargement de la page
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      try {
        setToken(storedToken);
        setAuthToken(storedToken,logout);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token,notLogged , register }}>
      {children}
      <SnackbarAlert
        open={openSnackbar}
        message={snackbarMessage}
        color="info"
        onClose={() => setOpenSnackbar(false)}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;