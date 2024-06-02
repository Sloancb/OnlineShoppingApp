const { Staff, Product, Stock } = require('../models');

exports.createProduct = async (req, res) => {
    const { name, category, brand, size, description, price } = req.body;
    try {
        const product = await Product.create({ name, category, brand, size, description, price });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStock = async (req, res) => {
    const { product_id, warehouse_id, quantity } = req.body;
    try {
        const stock = await Stock.create({ product_id, warehouse_id, quantity });
        res.status(201).json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
