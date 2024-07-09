import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';
import { CircularProgress } from '@mui/material';
import UserIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
  const [showPassword, setShowPassword] = useState(false);

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
    <>
      <div className="min-h-screen flex flex-col items-center justify-center sm:shadow-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">{registerMode ? 'Inscription' : 'Se connecter'}</h2>

          {!loading ? (
            <form onSubmit={registerMode ? handleRegisterSubmit : handleLoginSubmit} className="space-y-6 w-9/12 sm:w-3/12">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700"></label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  placeholder="Nom d'utilisateur"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm transition-colors duration-300 ease-in-out"
                />
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700"></label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm transition-colors duration-300 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1.5 cursor-pointer hover:text-gray-400"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${registerMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-900 hover:bg-green-1000'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${registerMode ? 'focus:ring-indigo-500' : 'focus:ring-green-800'}`}
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
                  className="font-medium text-green-900 hover:text-green-1000"
                >
                  Inscrivez-vous ici
                </button>
              </p>
            )}
          </div>
      </div>
      <SnackbarAlert
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        color={snackbarColor}
      />
    </>
  );
};

export default Login;
