export const API_URL = "http://localhost:3000"; // Cambia si tu backend usa otro puerto

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
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

// Inicio de sesión
export const loginUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    return { error: "No se pudo iniciar sesión" };
  }
};
