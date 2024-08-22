import axios from 'axios';

const API_URL = 'http://10.58.131.69:4040';

// Create an Axios instance with the base URL
const api = axios.create({
    baseURL: API_URL,
});

let logoutFunction = null;

// Function to set the JWT token in Axios request headers
export const setAuthToken = (token, logout) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
    logoutFunction = logout;
};

// Axios interceptor to handle authentication errors (401 and 403)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const {status} = error.response;
            if (status === 401) {
                console.error('*** Unauthorized error (Auth failed):', error);
                // Log out the user on the client side
                if (logoutFunction) {
                    logoutFunction();
                }
            } else if (status === 403) {
                console.error('*** Forbidden error (You are not allowed to do that):', error);
            }
        }
        return Promise.reject(error);
    }
);

// Fetch all bins
export const getBins = async () => {
    try {
        const response = await api.get('/api/bins');
        return response.data;
    } catch (error) {
        console.error('Error fetching bins data:', error);
        throw error;
    }
};

// Fetch all traps
export const getTraps = async () => {
    try {
        const response = await api.get('/api/traps');
        return response.data;
    } catch (error) {
        console.error('Error fetching traps data:', error);
        throw error;
    }
};

// Fetch traps for a specific bin
export const getBinTraps = async (binId) => {
    try {
        const response = await api.get('/api/bintraps', {
            params: {
                binId: binId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bin traps data:', error);
        throw error;
    }
};

// Fetch a specific trap by ID
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

// Unassign a bin from a festival (protected to WOBZ ADMIN)
export const unAssignBinFromFestival = async (binId) => {
    try {
        const response = await api.post(`/api/bins/${binId}/unassign`);
        return response.data;
    } catch (error) {
        console.error('Error unassigning bin from festival:', error);
        throw error;
    }
};

// Stop using a festival bin
export const stopUsingFestivalBin = async (binId) => {
    try {
        const response = await api.post(`/api/bins/${binId}/stop-using`);
        return response.data;
    } catch (error) {
        console.error('Error stopping using festival bin:', error);
        throw error;
    }
};

// Start using bins for a festival
export const startUsingFestivalBins = async (festivalId, bins) => {
    try {
        const response = await api.post(`/api/festivals/${festivalId}/start-using`, {bins});
        return response.data;
    } catch (error) {
        console.error('Error starting using festival bins:', error);
        throw error;
    }
};

// Delete a bin (not used in the app)
export const deleteBin = async (binId) => {
    try {
        const response = await api.post('/api/deletebin', {id: binId});
        return response.data;
    } catch (error) {
        console.error('Error deleting bin:', error);
        throw error;
    }
};

// Create a new bin (not used in the app)
export const createBin = async (bin) => {
    try {
        const response = await api.post('/api/createbin', bin);
        return response.data;
    } catch (error) {
        console.error('Error creating bin:', error);
        throw error;
    }
};

// Close a trap
export const closeTrap = async (trapId) => {
    try {
        const response = await api.post('/api/closetrap', {id: trapId});
        return response.data;
    } catch (error) {
        console.error('Error closing trap:', error);
        throw error;
    }
};

// Open a trap
export const openTrap = async (trapId) => {
    try {
        const response = await api.post('/api/opentrap', {id: trapId});
        return response.data;
    } catch (error) {
        console.error('Error opening trap:', error);
        throw error;
    }
};

// User login
export const login = async (username, password) => {
    try {
        const response = await api.post('/api/login', {username, password});
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// User registration
export const register = async (username, password) => {
    try {
        const response = await api.post('/api/register', {username, password});
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch the favorite festival of a user
export const getFavoriteFestival = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/favorite-festival`);
        return response.data;
    } catch (error) {
        console.error('Error fetching favorite festival:', error);
        throw error;
    }
};

// Fetch bins associated with a user's festival
export const getMyFestivalBins = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/bins`);
        return response.data;
    } catch (error) {
        console.error('Error fetching my festival bins:', error);
        throw error;
    }
};

// Fetch traps associated with a festival
export const getFestivalTraps = async (festivalId) => {
    try {
        const response = await api.get(`/api/festivals/${festivalId}/traps`);
        return response.data;
    } catch (error) {
        console.error('Error fetching festival traps:', error);
        throw error;
    }
}

// Fetch all festivals
export const getFestivals = async () => {
    try {
        const response = await api.get('/api/festivals');
        return response.data;
    } catch (error) {
        console.error('Error fetching festivals:', error);
        throw error;
    }
}

// Change the favorite festival of a user
export const changeFavoriteFestival = async (userId, festivalId) => {
    try {
        const response = await api.post(`/api/users/${userId}/favorite-festival`, {festivalId});
        return response.data;
    } catch (error) {
        console.error('Error changing favorite festival:', error);
        throw error;
    }
}

// Create a new festival (protected to WOBZ ADMIN)
export const createFestival = async (data) => {
    try {
        const response = await api.post('/api/festivals', data);
        return response.data;
    } catch (error) {
        console.error('Error creating festival:', error);
        throw error;
    }
}

// Set bins for a festival (protected to WOBZ ADMIN)
export const setFestivalBins = async (festivalId, bins) => {
    try {
        const response = await api.post(`/api/festivals/${festivalId}/bins`, {bins});
        return response.data;
    } catch (error) {
        console.error('Error setting festival bins:', error);
        throw error;
    }
}

// Fetch free traps
export const getFreeTraps = async () => {
    try {
        const response = await api.get('/api/traps/free');
        return response.data;
    } catch (error) {
        console.error('Error fetching free traps:', error);
        throw error;
    }
}

// Fetch free bins
export const getFreeBins = async () => {
    try {
        const response = await api.get('/api/bins/free');
        return response.data;
    } catch (error) {
        console.error('Error fetching free bins:', error);
        throw error;
    }
}

// Unassign a trap from a festival (protected to WOBZ ADMIN)
export const unassignTrapFromFestival = async (trapId) => {
    try {
        const response = await api.post(`/api/traps/${trapId}/unassign`);
        return response.data;
    } catch (error) {
        console.error('Error unassigning trap from festival:', error);
        throw error;
    }
}

// Assign traps to a festival (protected to WOBZ ADMIN)
export const assignTrapsToFestival = async (festivalId, traps) => {
    try {
        const response = await api.post(`/api/festivals/${festivalId}/traps`, {traps});
        return response.data;
    } catch (error) {
        console.error('Error assigning traps to festival:', error);
        throw error;
    }
}

// Assign traps to a bin (protected to Festival Owner/Admin)
export const assignTrapsToBin = async (binId, traps) => {
    try {
        const response = await api.post(`/api/bins/${binId}/traps`, {traps});
        return response.data;
    } catch (error) {
        console.error('Error assigning traps to bin:', error);
        throw error;
    }
}

// Unassign traps from a bin (protected to Festival Owner/Admin)
export const unassignTrapsFromBin = async (binId, traps) => {
    try {
        const response = await api.post(`/api/bins/${binId}/unassign-traps`, {traps});
        return response.data;
    } catch (error) {
        console.error('Error unassigning traps from bin:', error);
        throw error;
    }
}

// Fetch free traps for a festival
export const getFreeFestivalTraps = async (festivalId) => {
    try {
        const response = await api.get(`/api/festivals/${festivalId}/free-traps`);
        return response.data;
    } catch (error) {
        console.error('Error fetching free festival traps:', error);
        throw error;
    }
}

// Create a bin for demo purposes
export const createBinDEMO = async (bin) => {
    try {
        const response = await api.post('/api/createbinDEMO', bin);
        return response.data;
    } catch (error) {
        console.error('Error creating bin:', error);
        throw error;
    }
}

// Edit festival information (protected to Festival Owner/Admin)
export const editFestivalInformations = async (name, dates, festivalId) => {
    try {
        const response = await api.post('/api/editfestival', {name, dates, festivalId});
        return response.data;
    } catch (error) {
        console.error('Error editing festival:', error);
        throw error;
    }
}

// Edit bin information (protected to Festival Owner/Admin)
export const editBinInformations = async (name, zone, binId) => {
    try {
        const response = await api.post('/api/editbin', {name, zone, binId});
        return response.data;
    } catch (error) {
        console.error('Error editing bin:', error);
        throw error;
    }
}

// Edit bin location (protected to Festival Owner/Admin)
export const editBinLocation = async (lat, lon, binId) => {
    try {
        const response = await api.post('/api/editbinlocation', {lat, lon, binId});
        return response.data;
    } catch (error) {
        console.error('Error editing bin:', error);
        throw error;
    }
}

// Fetch the owner of a festival
export const getFestivalOwner = async (festivalId) => {
    try {
        const response = await api.get(`/api/festivals/${festivalId}/owner`);
        return response.data;
    } catch (error) {
        console.error('Error fetching festival owner:', error);
        throw error;
    }
}

// Fetch festivals associated with a user
export const getMyFestivals = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/festivals`);
        return response.data;
    } catch (error) {
        console.error('Error fetching my festivals:', error);
        throw error;
    }
}

// Fetch all users
export const getUsers = async () => {
    try {
        const response = await api.get('/api/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// Add users to a festival (protected to Festival Owner/Admin)
export const addUsersToFestival = async (festivalId, usersIds) => {
    try {
        const response = await api.post(`/api/festivals/${festivalId}/users`, {usersIds});
        return response.data;
    } catch (error) {
        console.error('Error adding users to festival:', error);
        throw error;
    }
}

// Fetch users associated with a festival
export const getFestivalUsers = async (festivalId) => {
    try {
        const response = await api.get(`/api/festivals/${festivalId}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching festival users:', error);
        throw error;
    }
}

// Fetch the role of a user in a festival
export const getUserRole = async (userId, festivalId) => {
    try {
        const response = await api.get(`/api/users/${userId}/role`, {params: {festivalId}});
        return response.data;
    } catch (error) {
        console.error('Error fetching user role:', error);
        throw error;
    }
}

// Fetch unused bins for a festival
export const getUnusedFestivalBins = async (festivalId) => {
    try {
        const response = await api.get(`/api/festivals/${festivalId}/unused-bins`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unused festival bins:', error);
        throw error;
    }
}

// Change the role of a user in a festival (protected to Festival Owner/Admin)
export const changeUserRole = async (userId, festivalId, role) => {
    try {
        const response = await api.post(`/api/users/${userId}/role`, {festivalId, role});
        return response.data;
    } catch (error) {
        console.error('Error changing user role:', error);
        throw error;
    }
}

// Remove a user from a festival (protected to Festival Owner/Admin)
export const removeUserFromFestival = async (userId, festivalId) => {
    try {
        const response = await api.post(`/api/users/${userId}/remove`, {festivalId});
        return response.data;
    } catch (error) {
        console.error('Error removing user from festival:', error);
        throw error;
    }
}