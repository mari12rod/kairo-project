import { useState } from "react";
import { registerUser } from "../services/api";

function RegisterForm() {
  const [form, setForm] = useState({ nombre: "", correo: "", password: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    setMensaje(res.message || res.error);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-96 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
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
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Registrar
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
    </div>
  );
}

export default RegisterForm;
