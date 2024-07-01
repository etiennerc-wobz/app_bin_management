// src/api/api.js
import axios from 'axios';

const API_URL = 'http://10.58.131.69:4040'; 

export const getBins = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/bins`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bins data:', error);
    throw error;
  }
};

export const getTraps = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/traps`);
    return response.data;
  } catch (error) {
    console.error('Error fetching traps data:', error);
    throw error;
  }
};

export const getBinTraps = async (id) => {
  console.log('tentative de récupération des traps de la bin : ', id);
  try {
    const response = await axios.get(`${API_URL}/api/bintraps`, {
      params: {
        id: id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bin traps data:', error);
    throw error;
  }
}


export const getTrap = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/trap`, {
      params: {
        id: id
      }
    });
    console.log('gettrapresponse:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching trap:', error);
    throw error;
  }
}

export const deleteBin = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/api/deletebin`, null, {
      params: {
        id: id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting bin:', error);
    throw error;
  }
}

export const createBin = async (bin) => {
  try {
    console.log('tentative de création de la bin : ', bin);
    const response = await axios.post(`${API_URL}/api/createbin`, bin);
    return response.data;
  } catch (error) {
    console.error('Error creating bin:', error);
    throw error;
  }
}

export const closeTrap = async (trapId) => {
  try {
    console.log('tentative de fermeture de la trap : ', trapId);
    const response = await axios.post(`${API_URL}/api/closetrap`, { id: trapId });
    console.log('response:', response);
    return response.data;
  } catch (error) {
    console.error('Error closing trap:', error);
    throw error;
  }
}

export const openTrap = async (trapId) => {
  try {
    console.log('tentative d\'ouverture de la trap : ', trapId);
    const response = await axios.post(`${API_URL}/api/opentrap`, { id: trapId });
    console.log('response:', response);
    return response.data;
  } catch (error) {
    console.error('Error opening trap:', error);
    throw error;
  }
}



