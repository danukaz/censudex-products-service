require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongo');

const app = express();
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ message: '🧠 Products Service funcionando correctamente' });
});

// Conexión a la base de datos y arranque del servidor
const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});