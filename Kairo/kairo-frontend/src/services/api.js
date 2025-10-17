const API_URL = "http://localhost:3000";

// 🔐 Funciones para manejar el token
export const getAuthToken = () => {
  return localStorage.getItem('kairo_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('kairo_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('kairo_token');
};

// Headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? 'Bearer ${token}' : ''
  };
};

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const res = await fetch('${API_URL}/register', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error registrando usuario:", error);
    return { error: "No se pudo registrar el usuario" };
  }
};

// Inicio de sesión (actualizado para guardar token)
export const loginUser = async (userData) => {
  try {
    const res = await fetch('${API_URL}/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    const data = await res.json();
    
    // Guardar token si el login fue exitoso
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    return { error: "No se pudo iniciar sesión" };
  }
};

// Cerrar sesión
export const logoutUser = () => {
  removeAuthToken();
};