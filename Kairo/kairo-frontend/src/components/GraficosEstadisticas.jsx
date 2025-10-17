import { useEffect, useState } from "react";
import { getEmotionsStats } from "../services/emotionService";

// Componente simple de gráfico de barras (sin librerías externas)
const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.count));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="w-20 text-sm">{item.mood}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className="bg-purple-600 h-6 rounded-full transition-all duration-500"
                style={{ width: `${(item.count / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm w-8">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de gráfico circular simple
const SimplePieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{
                backgroundColor: `hsl(${index * 60}, 70%, 50%)`
              }}
            ></div>
            <span className="text-sm">
              {item.mood} ({Math.round((item.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GraficosEstadisticas() {
  const [stats, setStats] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    summary: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Usar userId 1 como ejemplo - en una app real usarías el ID del usuario logueado
      const userId = 1;

      // Aquí llamarías a tus endpoints reales
      // Por ahora usamos datos de ejemplo
      const mockData = {
        daily: [
          { fecha: "2024-01-15", mood: "😊", count: 3 },
          { fecha: "2024-01-15", mood: "😐", count: 1 },
          { fecha: "2024-01-14", mood: "😊", count: 2 },
          { fecha: "2024-01-14", mood: "😔", count: 1 }
        ],
        weekly: [
          { week: "2024-02", mood: "😊", count: 12 },
          { week: "2024-02", mood: "😐", count: 5 },
          { week: "2024-01", mood: "😊", count: 8 },
          { week: "2024-01", mood: "😔", count: 3 }
        ],
        monthly: [
          { month: "2024-01", mood: "😊", count: 45 },
          { month: "2024-01", mood: "😐", count: 20 },
          { month: "2024-01", mood: "😔", count: 8 },
          { month: "2023-12", mood: "😊", count: 38 }
        ],
        summary: {
          summary: [
            { mood: "😊", total: 45, percentage: 61.6 },
            { mood: "😐", total: 20, percentage: 27.4 },
            { mood: "😔", total: 8, percentage: 11.0 }
          ],
          mostFrequent: { mood: "😊", count: 45 },
          totalEmotions: 73
        }
      };

      setStats(mockData);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Estadísticas de Emociones</h2>
        <div className="text-center">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📊 Estadísticas de Emociones
      </h2>

      {/* Resumen General */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-3">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.summary.totalEmotions}</div>
            <div className="text-sm">Total de emociones</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.summary.mostFrequent.mood}</div>
            <div className="text-sm">Emoción más frecuente</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.summary.mostFrequent.count}</div>
            <div className="text-sm">Veces registrada</div>
          </div>
        </div>
      </div>

      {/* Navegación de pestañas */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "daily"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          Diario
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "weekly"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("weekly")}
        >
          Semanal
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "monthly"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          Mensual
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "summary"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          Resumen
        </button>
      </div>

      {/* Contenido de pestañas */}
      <div className="min-h-64">
        {activeTab === "daily" && (
          <SimpleBarChart
            data={stats.daily}
            title="Distribución Diaria de Emociones"
          />
        )}

        {activeTab === "weekly" && (
          <SimpleBarChart
            data={stats.weekly}
            title="Distribución Semanal de Emociones"
          />
        )}

        {activeTab === "monthly" && (
          <SimpleBarChart
            data={stats.monthly}
            title="Distribución Mensual de Emociones"
          />
        )}

        {activeTab === "summary" && (
          <SimplePieChart
            data={stats.summary.summary}
            title="Distribución General de Emociones"
          />
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 p-4 rounded-lg mt-6">
        <h4 className="font-semibold mb-2">💡 Análisis de Tendencia</h4>
        <p className="text-sm text-gray-600">
          Basado en tus registros, tu emoción predominante es{" "}
          <strong>{stats.summary.mostFrequent.mood}</strong> con{" "}
          <strong>{stats.summary.mostFrequent.count}</strong> registros.
        </p>
      </div>
    </div>
  );
}
// Funciones para estadísticas
export const getDailyStats = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/stats/daily/${userId}`);
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo estadísticas diarias:", error);
    return [];
  }
};

export const getWeeklyStats = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/stats/weekly/${userId}`);
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo estadísticas semanales:", error);
    return [];
  }
};

export const getMonthlyStats = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/stats/monthly/${userId}`);
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo estadísticas mensuales:", error);
    return [];
  }
};

export const getSummaryStats = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/stats/summary/${userId}`);
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo resumen:", error);
    return {};
  }
};

// Función general para todas las estadísticas
export const getEmotionsStats = async (userId) => {
  try {
    const [daily, weekly, monthly, summary] = await Promise.all([
      getDailyStats(userId),
      getWeeklyStats(userId),
      getMonthlyStats(userId),
      getSummaryStats(userId)
    ]);

    return { daily, weekly, monthly, summary };
  } catch (error) {
    console.error("Error obteniendo todas las estadísticas:", error);
    return { daily: [], weekly: [], monthly: [], summary: {} };
  }
};