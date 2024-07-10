// src/api/api.js
import axios from 'axios';

const API_URL = 'http://10.58.131.69:4040';

// Création d'une instance Axios
const api = axios.create({
  baseURL: API_URL,
});

let logoutFunction = null;


// Fonction pour définir le token JWT dans les en-têtes des requêtes Axios
export const setAuthToken = (token,logout) => {
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
  logoutFunction=logout;
};

// Interceptor Axios pour gérer les erreurs d'authentification (401 et 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        console.error('Unauthorized or Forbidden error:', error);
        // Déconnecter l'utilisateur côté client
        if(logoutFunction){
          logoutFunction();
        }
    }
  }
    return Promise.reject(error);
  }
);

// Exports de toutes vos fonctions d'appel API avec l'instance Axios configurée
export const getBins = async () => {
  try {
    const response = await api.get('/api/bins');
    return response.data;
  } catch (error) {
    console.error('Error fetching bins data:', error);
    throw error;
  }
};

export const getTraps = async () => {
  try {
    const response = await api.get('/api/traps');
    return response.data;
  } catch (error) {
    console.error('Error fetching traps data:', error);
    throw error;
  }
};

export const getBinTraps = async (id) => {
  try {
    const response = await api.get('/api/bintraps', {
      params: {
        id: id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bin traps data:', error);
    throw error;
  }
};

export const getTrap = async (id) => {
  try {
    const response = await api.get('/api/trap', {
      params: {
        id: id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trap:', error);
    throw error;
  }
};

export const unAssignBinFromFestival = async (binId) => {
  try {
    const response = await api.post(`/api/bins/${binId}/unassign`);
    return response.data;
  } catch (error) {
    console.error('Error unassigning bin from festival:', error);
    throw error;
  }
};

export const deleteBin = async (binId) => {
  try {
    const response = await api.post('/api/deletebin', { id: binId });
    return response.data;
  } catch (error) {
    console.error('Error deleting bin:', error);
    throw error;
  }
};

export const createBin = async (bin) => {
  try {
    
    const response = await api.post('/api/createbin', bin);
    return response.data;
  } catch (error) {
    console.error('Error creating bin:', error);
    throw error;
  }
};

export const closeTrap = async (trapId) => {
  try {
    
    const response = await api.post('/api/closetrap', { id: trapId });
    
    return response.data;
  } catch (error) {
    console.error('Error closing trap:', error);
    throw error;
  }
};

export const openTrap = async (trapId) => {
  try {
    
    const response = await api.post('/api/opentrap', { id: trapId });
    
    return response.data;
  } catch (error) {
    console.error('Error opening trap:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post('/api/register', { username, password });
    console.log('register response : ', response);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const fetchProtectedData = async () => {
  try {
    const response = await api.get('/api/protected');
    return response.data;
  } catch (error) {
    console.error('Error fetching protected data:', error);
    throw error;
  }
};

export const getFavoriteFestival = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/favorite-festival`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite festival:', error);
    throw error;
  }
};

export const getMyFestivalBins = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/bins`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my festival bins:', error);
    throw error;
  }
};

export const getFestivalTraps = async (festivalId) => {
  try {
    
    const response = await api.get(`/api/festivals/${festivalId}/traps`);
    return response.data;
  } catch (error) {
    console.error('Error fetching festival traps:', error);
    throw error;
  }
}

export const getFestivals = async () => {
  try {
    const response = await api.get('/api/festivals');
    return response.data;
  } catch (error) {
    console.error('Error fetching festivals:', error);
    throw error;
  }
}

export const changeFavoriteFestival = async (userId, festivalId) => {
  try {
    const response = await api.post(`/api/users/${userId}/favorite-festival`, { festivalId });
    return response.data;
  } catch (error) {
    console.error('Error changing favorite festival:', error);
    throw error;
  }
}

export const createFestival = async (festival) => {
  try {
    
    const response = await api.post('/api/festivals', festival);
    return response.data;
  } catch (error) {
    console.error('Error creating festival:', error);
    throw error;
  }
}

export const setFestivalBins = async (festivalId, bins) => {
  try {
    
    
    const response = await api.post(`/api/festivals/${festivalId}/bins`, { bins });
    return response.data;
  } catch (error) {
    console.error('Error setting festival bins:', error);
    throw error;
  }
}

export const getFreeTraps = async () => {
  try {
    const response = await api.get('/api/traps/free');
    return response.data;
  } catch (error) {
    console.error('Error fetching free traps:', error);
    throw error;
  }
}

export const getFreeBins = async () => {
  try {
    const response = await api.get('/api/bins/free');
    return response.data;
  } catch (error) {
    console.error('Error fetching free bins:', error);
    throw error;
  }
}

export const unassignTrapFromFestival = async (trapId) => {
  try {
    const response = await api.post(`/api/traps/${trapId}/unassign`);
    return response.data;
  } catch (error) {
    console.error('Error unassigning trap from festival:', error);
    throw error;
  }
}

export const assignTrapsToFestival = async (festivalId, traps) => {
  try {
    const response = await api.post(`/api/festivals/${festivalId}/traps`, { traps });
    return response.data;
  } catch (error) {
    console.error('Error assigning traps to festival:', error);
    throw error;
  }
}

export const assignTrapsToBin = async (binId, traps) => {
  try {
    const response = await api.post(`/api/bins/${binId}/traps`, { traps });
    return response.data;
  } catch (error) {
    console.error('Error assigning traps to bin:', error);
    throw error;
  }
}

export const getFreeFestivalTraps = async (festivalId) => {
  try {
    const response = await api.get(`/api/festivals/${festivalId}/free-traps`);
    return response.data;
  } catch (error) {
    console.error('Error fetching free festival traps:', error);
    throw error;
  }
}

export const createBinDEMO = async (bin) => {
  try {
    
    const response = await api.post('/api/createbinDEMO', bin);
    return response.data;
  } catch (error) {
    console.error('Error creating bin:', error);
    throw error;
  }
}

export const editBinInformations = async (name,zone,binId) => {
  try {
    
    const response = await api.post('/api/editbin', { name, zone, binId });
    return response.data;
  } catch (error) {
    console.error('Error editing bin:', error);
    throw error;
  }
}

export const editBinLocation = async (lat,lon,binId) => {
  try {
    const response = await api.post('/api/editbinlocation', { lat, lon, binId });
    return response.data;
  } catch (error) {
    console.error('Error editing bin:', error);
    throw error;
  }
}