import { useState } from "react";
import { addEmotion } from "../services/emotionService";

export default function EmotionForm() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mood) return alert("Selecciona un estado de ánimo");
    addEmotion({ mood, note, date: new Date().toLocaleDateString() });
    setMood("");
    setNote("");
    alert("Emoción guardada con éxito");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">Registrar Emoción</h2>
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="border p-2 w-full mb-2"
      >
        <option value="">Selecciona tu emoción</option>
        <option value="😊">Feliz</option>
        <option value="😐">Neutral</option>
        <option value="😔">Triste</option>
        <option value="😠">Enojado</option>
      </select>
      <textarea
        placeholder="Escribe una nota (opcional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
        Guardar
      </button>
    </form>
  );
}
