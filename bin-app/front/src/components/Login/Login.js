// Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';

const Login = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [loginEvent, setLoginEvent] = useState('success');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res=await login(username, password);
      
      setLoginEvent('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setLoginEvent('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Se connecter</h2>
          <div className="text-red-500 text-center mb-4">{invalidCredentials ? 'Nom d\'utilisateur ou mot de passe incorrect' : ''}</div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur :</label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete='off'
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
                autoComplete='off'
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
      <SnackbarAlert open={openSnackbar} onClose={handleCloseSnackbar} message={loginEvent === 'success' ? 'Connexion réussie, vous allez être redirigés' : 'Nom d\'utilisateur ou mot de passe incorrect'} color={loginEvent === 'success' ? 'success' : 'error'} />
    </div>
  );
};

export default Login;
