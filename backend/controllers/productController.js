const { Product } = require('../models');

exports.createProduct = async (req, res) => {
    const { name, category, brand, size, description, price } = req.body;
    try {
        const product = await Product.create({ name, category, brand, size, description, price });
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editProduct = async (req, res) => {
    let id = req.body.id
    let data = req.body
    try {
        const product = await Product.findOne({ where: {id : id} })
        await product.update({...data})
        await product.save()
        res.json({ message: "Product edited" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.deleteProduct = async( req, res) =>{
    let id = req.body.id
    try {
        await Product.destroy({ where: {id:id} })
        res.json({ message: "product deleted:" + id })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
exports.deleteAll = async (req, res) => {
    try {
        await Product.destroy({ where: {} })
        res.json({ message: "All products deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}