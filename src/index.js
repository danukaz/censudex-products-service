require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongo');

const app = express();
app.use(express.json());

const upload = require('./middleware/upload');
const { createProduct } = require('./services/productService');


// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ message: '🧠 Products Service funcionando correctamente' });
});

// Ruta para crear un nuevo producto
app.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const product = await createProduct(
      { name, description, price, category },
      req.file ? req.file.buffer : null
    );

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
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