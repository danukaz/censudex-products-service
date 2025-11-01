const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const Product = require('../models/Product');
const { randomUUID } = require('crypto');

const PROTO_PATH = path.join(__dirname, 'protos', 'products.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef).products;

async function CreateProduct(call, callback) {
  try {
    const prod = call.request.product;
    const exists = await Product.findOne({ name: prod.name });
    if (exists) {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: 'El producto ya existe'
      });
    }
    const newProd = new Product({
      id: prod.id || randomUUID(),
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      imageUrl: prod.imageUrl,
      isActive: true
    });
    await newProd.save();
    callback(null, { product: newProd });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function GetProducts(call, callback) {
  try {
    const products = await Product.find({ isActive: true }).lean();
    callback(null, { products });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function GetProductById(call, callback) {
  try {
    const product = await Product.findOne({ id: call.request.id });
    if (!product) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'No encontrado' });
    }
    callback(null, { product });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function UpdateProduct(call, callback) {
  try {
    const prod = call.request.product;
    const updated = await Product.findOneAndUpdate(
      { id: prod.id },
      { $set: prod },
      { new: true }
    );
    if (!updated) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'No encontrado' });
    }
    callback(null, { product: updated });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function SoftDeleteProduct(call, callback) {
  try {
    const { id } = call.request;
    const deleted = await Product.findOneAndUpdate(
      { id },
      { $set: { isActive: false, deletedAt: new Date() } },
      { new: true }
    );
    if (!deleted) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'No encontrado' });
    }
    callback(null, { success: true });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

function getServer() {
  const server = new grpc.Server();
  server.addService(grpcObj.Products.service, {
    CreateProduct,
    GetProducts,
    GetProductById,
    UpdateProduct,
    SoftDeleteProduct
  });
  return server;
}

module.exports = { getServer };
