require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { randomUUID } = require('crypto');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/censudex_products';

const products = [
  {
    id: randomUUID(),
    name: 'Notebook Dell Inspiron',
    description: 'Notebook Intel i5 16GB RAM 512GB SSD',
    price: 850000,
    category: 'Electronics',
    imageUrl: 'https://placehold.co/600x400',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Mouse Logitech G203',
    description: 'Mouse gamer RGB con 8000 DPI',
    price: 19990,
    category: 'Peripherals',
    imageUrl: 'https://placehold.co/600x400',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Monitor Samsung 24"',
    description: 'Full HD 75Hz HDMI',
    price: 120000,
    category: 'Monitors',
    imageUrl: 'https://placehold.co/600x400',
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    await Product.deleteMany({});
    console.log('🗑️ Productos anteriores eliminados');

    await Product.insertMany(products);
    console.log(`🌱 ${products.length} productos insertados correctamente`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error al insertar productos:', err);
    process.exit(1);
  }
}

seed();
