import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import EmotionForm from "./components/EmotionForm";
import EmotionList from "./components/EmotionList";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-purple-600 text-white p-3 flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/register">Registrar Emoción</Link>
        <Link to="/history">Historial</Link>
      </nav>

      <div className="p-4">
        <Routes>
          <Route path="/" element={<h1 className="text-xl">Bienvenida a KAIRO 💜</h1>} />
          <Route path="/register" element={<EmotionForm />} />
          <Route path="/history" element={<EmotionList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


