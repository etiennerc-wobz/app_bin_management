import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';
import { CircularProgress } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [loginEvent, setLoginEvent] = useState('success');
  const [registerMode, setRegisterMode] = useState(false); // State pour basculer entre le mode connexion et inscription
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');
  const [loading, setLoading] = useState(false);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setSnackbarMessage('Connexion réussie');
      setSnackbarColor('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setSnackbarColor('error');
      setSnackbarMessage('Nom d\'utilisateur ou mot de passe incorrect');
      setOpenSnackbar(true);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      setSnackbarMessage('Inscription réussie');
      setSnackbarColor('success');
      setOpenSnackbar(true);
      await login(username, password);
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      // Ici, vous pouvez gérer les erreurs d'inscription spécifiques, par exemple si le nom d'utilisateur est déjà pris
      console.error('Error registering:', error);
      setSnackbarMessage('Erreur lors de l\'inscription');
      setSnackbarColor('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleRegisterMode = () => {
    setLoading(true);
    setTimeout(() => { //temps de chargement factice
      setLoading(false);
      setRegisterMode(!registerMode); 
      setInvalidCredentials(false);     
    }, 800);
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">{registerMode ? 'Inscription' : 'Se connecter'}</h2>

          {!loading ? (
            <form onSubmit={registerMode ? handleRegisterSubmit : handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur :</label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe :</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {registerMode ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </div>
          </form>
          ) : (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          )}
          
          <div className="mt-4 text-sm text-center">
            {registerMode ? (
              <p>
                Déjà inscrit ?{' '}
                <button
                  onClick={toggleRegisterMode}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Connectez-vous ici
                </button>
              </p>
            ) : (
              <p>
                Pas encore inscrit ?{' '}
                <button
                  onClick={toggleRegisterMode}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Inscrivez-vous ici
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
      <SnackbarAlert
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        color={snackbarColor}
      />
    </div>
  );
};

export default Login;
