import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import EmotionForm from "./components/EmotionForm";
import EmotionList from "./components/EmotionList";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-purple-600 text-white p-3 flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Registro</Link>
        <Link to="/emotion">Registrar Emocion</Link>
        <Link to="/history">Historial</Link>
      </nav>

      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold mb-4">Kairo App</h1>
              <div className="flex gap-4">
                <LoginForm />
                <RegisterForm />
              </div>
              <EmotionForm />
              <EmotionList />
            </div>
          } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/emotion" element={<EmotionForm />} />
          <Route path="/history" element={<EmotionList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}