// src/api/api.js
import axios from 'axios';

const API_URL = 'http://10.58.131.69:4040'; // Remplacez par l'adresse de votre serveur

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



