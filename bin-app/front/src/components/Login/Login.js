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
      if (error.message === 'Network Error') {
        setSnackbarMessage('Serveur injoignable');
      } else {
        setSnackbarMessage('Nom d\'utilisateur ou mot de passe incorrect');
      }
      setSnackbarColor('error');
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
        {registerMode ?(
          <img src={process.env.PUBLIC_URL + '/wobzPinkLogo.png'} alt="logo" className="w-52 h-auto mb-4" />
        ) : (
          <img src={process.env.PUBLIC_URL + '/wobzReuseLogo.png'} alt="logo" className="w-52 h-auto mb-4" />
        )}
        
          {!loading ? (
            <form onSubmit={registerMode ? handleRegisterSubmit : handleLoginSubmit} className="space-y-6 w-9/12 md:w-[20rem]">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wobzBlue focus:border-wobzBlue sm:text-sm transition-colors duration-300 ease-in-out"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wobzBlue focus:border-wobzBlue sm:text-sm transition-colors duration-300 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 sm:top-1.5 cursor-pointer hover:text-gray-400"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${registerMode ? 'bg-wobzPink hover:bg-wobzPink' : 'bg-wobzBlue hover:bg-wobzBlue'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${registerMode ? 'focus:ring-wobzPink' : 'focus:ring-wobzBlue'}`}
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
                  className="font-medium text-wobzPink hover:text-wobzPink"
                >
                  Connectez-vous ici
                </button>
              </p>
            ) : (
              <p>
                Pas encore inscrit ?{' '}
                <button
                  onClick={toggleRegisterMode}
                  className="font-medium text-wobzBlue hover:text-wobzBlue"
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
