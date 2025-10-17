import { getAuthHeaders } from './api.js';

const API_URL = "http://localhost:3000";

export const getEmotions = async (userId) => {
  try {
    const res = await fetch('${API_URL}/emotions/${userId}', {
      headers: getAuthHeaders()
    });
    
    if (res.status === 403 || res.status === 401) {
      return { error: "No autenticado. Por favor inicia sesión." };
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo emociones:", error);
    return { error: "Error de conexión" };
  }
};

export const addEmotion = async (emotionData) => {
  try {
    const res = await fetch('${API_URL}/emotions', {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(emotionData),
    });
    
    if (res.status === 403 || res.status === 401) {
      return { error: "No autenticado. Por favor inicia sesión." };
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error guardando emoción:", error);
    return { error: "No se pudo guardar la emoción" };
  }
};

export const deleteEmotion = async (emotionId) => {
  try {
    const res = await fetch('${API_URL}/emotions/${emotionId}', {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    
    if (res.status === 403 || res.status === 401) {
      return { error: "No autenticado. Por favor inicia sesión." };
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error eliminando emoción:", error);
    return { error: "No se pudo eliminar la emoción" };
  }
};

// Estadísticas
export const getEmotionsStats = async (userId) => {
  try {
    const res = await fetch('${API_URL}/emotions/stats/${userId}', {
      headers: getAuthHeaders()
    });
    
    if (res.status === 403 || res.status === 401) {
      return { error: "No autenticado. Por favor inicia sesión." };
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return { error: "Error al obtener estadísticas" };
  }
};