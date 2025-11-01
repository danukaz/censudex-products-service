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

// Endpoint para crear un nuevo producto (POST /products)
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

// Endpoint para obtener todos los productos (GET /products)
const Product = require('./models/Product');
app.get('/products', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';  // Parámetro opcional para ver productos desactivados (GET /products?includeInactive=true)
    const filter = includeInactive ? {} : { isActive: true };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener un producto por su ID (GET /products/:id)
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Endpoint para actualizar un producto por su ID (PUT /products/:id)
app.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const existing = await Product.findOne({ id: req.params.id });

    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si viene nueva imagen, subirla a Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'censudex/products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      existing.imageUrl = result.secure_url;
    }

    // Actualizar campos de texto
    if (name) existing.name = name;
    if (description) existing.description = description;
    if (price) existing.price = price;
    if (category) existing.category = category;
    existing.updatedAt = new Date();

    await existing.save();
    res.json(existing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para desactivar (soft delete) un producto por su ID (DELETE /products/:id)
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    product.isActive = false;
    product.deletedAt = new Date();
    await product.save();

    res.json({ message: 'Producto desactivado correctamente' });
  } catch (err) {
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