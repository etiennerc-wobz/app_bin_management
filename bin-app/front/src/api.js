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

