import { useState } from "react";
import { loginUser } from "../services/api";

function LoginForm() {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    setMensaje(res.message || res.error);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-96 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="correo"
          placeholder="Correo"
          type="email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          name="password"
          placeholder="Contraseña"
          type="password"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
        >
          Iniciar sesión
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
    </div>
  );
}

export default LoginForm;
