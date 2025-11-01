const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../grpc/protos/products.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef).products;

const client = new grpcObj.Products('localhost:50051', grpc.credentials.createInsecure());
const router = express.Router();

router.get('/grpc/products', (req, res) => {
  client.GetProducts({}, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response.products);
  });
});

router.get('/grpc/products/:id', (req, res) => {
  client.GetProductById({ id: req.params.id }, (err, response) => {
    if (err) return res.status(404).json({ error: err.message });
    res.json(response.product);
  });
});

module.exports = router;
