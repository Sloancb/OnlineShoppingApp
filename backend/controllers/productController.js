const { Product } = require('../models');

exports.createProduct = async (req, res) => {
    const { name, category, brand, size, description, price, warehouse_id } = req.body;
    try {
        //const userId = req.user.id; // Access user ID from token
        const product = await Product.create({ name, category, brand, size, description, price, warehouse_id });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Product.destroy({ where: {} })
        res.json({ message: "All products deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}