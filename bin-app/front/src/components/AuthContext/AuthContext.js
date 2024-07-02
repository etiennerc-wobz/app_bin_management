// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../../api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour se connecter
  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      if (!data) {
        throw new Error('Invalid credentials');
      }
      console.log('data:', data);
      setUser(data); 
      localStorage.setItem('user', JSON.stringify(data));
      console.log('localStorage:', localStorage.getItem('user'));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  // Fonction pour simuler une déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Vérifier si l'utilisateur est déjà connecté lors du chargement de la page
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;