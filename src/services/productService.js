const Product = require('../models/Product');
const { randomUUID } = require('crypto');
const cloudinary = require('../config/cloudinary');

async function createProduct(data, fileBuffer) {
    // Validar nombre único
    const exists = await Product.findOne({ name: data.name });
    if (exists) {
        throw new Error('El nombre del producto ya existe');
    }

    // Subir imagen a Cloudinary si hay un archivo
    let imageUrl = '';
    if (fileBuffer) {
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'censudex/products' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(fileBuffer);
        });
        imageUrl = uploadResult.secure_url;
    }

    // Crear producto
    const product = new Product({
        id: randomUUID(),
        name: data.name,
        description: data.description || '',
        price: data.price,
        category: data.category || '',
        imageUrl
    });

    await product.save();
    return product;
}

module.exports = { createProduct };
