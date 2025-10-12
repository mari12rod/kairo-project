import { useEffect, useState } from "react";
import { getEmotions, deleteEmotion } from "../services/emotionService";

export default function EmotionList() {
  const [emotions, setEmotions] = useState([]);

  useEffect(() => {
    setEmotions(getEmotions());
  }, []);

  const handleDelete = (id) => {
    deleteEmotion(id);
    setEmotions(getEmotions());
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Historial de Emociones</h2>
      {emotions.length === 0 ? (
        <p>No hay emociones registradas aún.</p>
      ) : (
        <ul className="space-y-2">
          {emotions.map((e) => (
            <li
              key={e.id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
            >
              <span>
                {e.date} — {e.mood} — {e.note}
              </span>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
