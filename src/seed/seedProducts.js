require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { randomUUID } = require('crypto');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/censudex_products';

const products = [
  {
    id: "3f9a1b2c-8d4e-4b3f-9a2b-1c3d4e5f6a7b",
    name: 'Notebook Dell Inspiron',
    description: 'Notebook Intel i5 16GB RAM 512GB SSD',
    price: 850000,
    category: 'Electronics',
    imageUrl: 'https://placehold.co/600x400',
    isActive: true,
  },
  {
    id: "a7b6c5d4-3e2f-4a1b-8c9d-0e1f2a3b4c5d",
    name: 'Mouse Logitech G203',
    description: 'Mouse gamer RGB con 8000 DPI',
    price: 19990,
    category: 'Peripherals',
    imageUrl: 'https://placehold.co/600x400',
    isActive: true,
  },
  {
    id: "b1c2d3e4-5f6a-4b7c-8d9e-0f1a2b3c4d5e",
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
