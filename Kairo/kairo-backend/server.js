import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

// Conectar a MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err.message);
    return;
  }
  console.log("✅ Conectado a la base de datos MySQL");
});

// ========================
// 🔐 AUTENTICACIÓN SEGURA
// ========================

// Registro con hash de contraseña
app.post("/register", async (req, res) => {
  const { nombre, correo, password } = req.body;
  if (!nombre || !correo || !password)
    return res.status(400).json({ error: "Faltan datos obligatorios" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.execute(checkQuery, [correo], (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      if (results.length > 0)
        return res.status(400).json({ error: "El usuario ya existe" });

      const insertQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.execute(insertQuery, [nombre, correo, hashedPassword], (err, result) => {
        if (err)
          return res.status(500).json({ error: "Error al registrar usuario" });
        res.json({
          message: "Usuario registrado exitosamente",
          user: { id: result.insertId, name: nombre, email: correo },
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login con verificación y token JWT
app.post("/login", (req, res) => {
  const { correo, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.execute(query, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0)
      return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    // Crear token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

// Middleware para verificar token JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido o expirado" });
    req.user = decoded;
    next();
  });
}

// ========================
// 😊 RUTAS DE EMOCIONES
// ========================
app.post("/emotions", verifyToken, (req, res) => {
  // 🔍 DEBUG AQUÍ (líneas nuevas que agregas)
  console.log("🔐 Usuario del token:", req.user);
  console.log("📦 Body recibido:", req.body);
  
  const { mood, note, date } = req.body;
  const user_id = req.user.id;

  // ... el resto de tu código igual
  const query = "INSERT INTO emociones (usuario_id, fecha, emocion, comentario) VALUES (?, ?, ?, ?)";
  
  db.execute(query, [user_id, date, mood, note || null], (err, result) => {
    if (err) {
      console.error("❌ Error en BD:", err);
      return res.status(500).json({ error: "Error al guardar emoción" });
    }
    
    console.log("✅ Emoción guardada - ID:", result.insertId);
    res.json({
      message: "Emoción guardada exitosamente",
      emotion: { id: result.insertId, mood, note, date, usuario_id: user_id },
    });
  });
});

app.get("/emotions/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  const query =
    "SELECT id, usuario_id, fecha, emocion as mood, comentario as note FROM emociones WHERE usuario_id = ? ORDER BY fecha DESC, id DESC";
  db.execute(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener emociones" });
    res.json(results);
  });
});

app.delete("/emotions/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM emociones WHERE id = ?";
  db.execute(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar emoción" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Emoción no encontrada" });
    res.json({ message: "Emoción eliminada exitosamente" });
  });
});

// ========================
// 📊 ESTADÍSTICAS COMPLETAS
// ========================

app.get("/stats/summary/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  
  console.log("=== ESTADÍSTICAS CORREGIDAS ===");
  console.log("📊 User ID:", user_id);

  // ✅ QUERY CORREGIDA - Dos consultas separadas
  const countQuery = "SELECT COUNT(*) as total FROM emociones WHERE usuario_id = ?";
  const statsQuery = `
    SELECT 
      emocion as mood, 
      COUNT(*) as count
    FROM emociones 
    WHERE usuario_id = ?
    GROUP BY emocion 
    ORDER BY count DESC
  `;
  
  // Primero obtener el total
  db.execute(countQuery, [user_id], (countErr, countResults) => {
    if (countErr) {
      console.error("❌ Error en count query:", countErr);
      return res.status(500).json({ error: "Error al contar emociones" });
    }
    
    const totalEmotions = countResults[0].total || 0;
    console.log("📈 Total de emociones:", totalEmotions);
    
    // Luego obtener las estadísticas
    db.execute(statsQuery, [user_id], (statsErr, statsResults) => {
      if (statsErr) {
        console.error("❌ Error en stats query:", statsErr);
        return res.status(500).json({ error: "Error al obtener estadísticas" });
      }
      
      console.log("✅ Estadísticas obtenidas:", statsResults);
      
      // Calcular porcentajes
      const summaryWithPercentage = statsResults.map(item => ({
        ...item,
        percentage: totalEmotions > 0 ? 
          Math.round((item.count / totalEmotions) * 100 * 100) / 100 : 0
      }));
      
      const mostFrequent = summaryWithPercentage.length > 0 ? summaryWithPercentage[0] : { mood: "Ninguna", count: 0 };
      
      res.json({
        summary: summaryWithPercentage,
        mostFrequent,
        totalEmotions,
        uniqueMoods: summaryWithPercentage.length
      });
    });
  });
});

// Estadísticas diarias (últimos 7 días)
app.get("/stats/daily/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  
  const query = `
    SELECT 
      fecha as date,
      emocion as mood,
      COUNT(*) as count
    FROM emociones 
    WHERE usuario_id = ? 
      AND fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY fecha, emocion 
    ORDER BY fecha DESC, count DESC
  `;
  
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error en estadísticas diarias:", err);
      return res.status(500).json({ error: "Error al obtener estadísticas diarias" });
    }
    
    res.json(results);
  });
});

// Estadísticas semanales (últimas 4 semanas)
app.get("/stats/weekly/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  
  const query = `
    SELECT 
      YEARWEEK(fecha) as week,
      emocion as mood,
      COUNT(*) as count
    FROM emociones 
    WHERE usuario_id = ? 
      AND fecha >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
    GROUP BY week, emocion 
    ORDER BY week DESC, count DESC
  `;
  
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error en estadísticas semanales:", err);
      return res.status(500).json({ error: "Error al obtener estadísticas semanales" });
    }
    
    res.json(results);
  });
});

// Estadísticas mensuales (últimos 6 meses)
app.get("/stats/monthly/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  
  const query = `
    SELECT 
      DATE_FORMAT(fecha, '%Y-%m') as month,
      emocion as mood,
      COUNT(*) as count
    FROM emociones 
    WHERE usuario_id = ? 
      AND fecha >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY month, emocion 
    ORDER BY month DESC, count DESC
  `;
  
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error en estadísticas mensuales:", err);
      return res.status(500).json({ error: "Error al obtener estadísticas mensuales" });
    }
    
    res.json(results);
  });
});

// Tendencia de ánimo (promedio semanal)
app.get("/stats/trend/:user_id", verifyToken, (req, res) => {
  const { user_id } = req.params;
  
  const query = `
    SELECT 
      YEARWEEK(fecha) as week,
      COUNT(*) as total_emotions,
      SUM(CASE WHEN emocion = '😊' THEN 1 ELSE 0 END) as happy_count,
      SUM(CASE WHEN emocion = '😐' THEN 1 ELSE 0 END) as neutral_count,
      SUM(CASE WHEN emocion = '😔' THEN 1 ELSE 0 END) as sad_count,
      SUM(CASE WHEN emocion = '😠' THEN 1 ELSE 0 END) as angry_count,
      ROUND((SUM(CASE WHEN emocion = '😊' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) as happiness_rate
    FROM emociones 
    WHERE usuario_id = ?
    GROUP BY week
    ORDER BY week DESC
    LIMIT 8
  `;
  
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error en tendencias:", err);
      return res.status(500).json({ error: "Error al obtener tendencias" });
    }
    
    res.json(results);
  });
});

// ========================
// 🏠 RUTA DE PRUEBA
// ========================
app.get("/", (req, res) => {
  res.json({
    message: "Servidor backend de Kairo funcionando correctamente 🚀",
    seguridad: "JWT y contraseñas cifradas",
    endpoints: {
      auth: ["POST /register", "POST /login"],
      emotions: [
        "POST /emotions (protegida)",
        "GET /emotions/:user_id (protegida)",
        "DELETE /emotions/:id (protegida)",
      ],
      stats: "GET /emotions/stats/:user_id (protegida)",
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Servidor corriendo en http://localhost:${PORT}');
  console.log('📡 Conectado a BD remota: ${process.env.DB_HOST}');
});

app.post("/emotions", verifyToken, (req, res) => {
  console.log("=== DEBUG EMOCIONES ===");
  console.log("🔐 Usuario del token:", req.user);
  console.log("📦 Body recibido:", req.body);
  console.log("📦 Headers:", req.headers);
  
  // Validar campos requeridos
  const { mood, note, date } = req.body;
  
  if (!mood) {
    console.log("❌ FALTA: mood");
    return res.status(400).json({ error: "El campo 'mood' es requerido" });
  }
  
  if (!date) {
    console.log("❌ FALTA: date");
    return res.status(400).json({ error: "El campo 'date' es requerido" });
  }
  
  const user_id = req.user.id;
  
  console.log("✅ Datos validados - Guardando...");
  
  const query = "INSERT INTO emociones (usuario_id, fecha, emocion, comentario) VALUES (?, ?, ?, ?)";
  db.execute(query, [user_id, date, mood, note || ''], (err, result) => {
    if (err) {
      console.error("❌ Error en BD:", err);
      return res.status(500).json({ error: "Error al guardar emoción en BD" });
    }
    
    console.log("✅ Emoción guardada con ID:", result.insertId);
    res.json({
      message: "Emoción guardada exitosamente",
      emotion: { id: result.insertId, mood, note, date, usuario_id: user_id },
    });
  });
});