function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-200 text-center">
      <h1 className="text-5xl font-bold text-indigo-700 mb-4">
        🌿 Bienvenida a KAIRO
      </h1>
      <p className="text-gray-700 text-lg max-w-xl">
        Tu diario de emociones. Registra cómo te sientes cada día y descubre
        patrones en tu bienestar emocional 💜
      </p>

      <button className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
        Empezar ahora
      </button>
    </div>
  );
}

export default App;
