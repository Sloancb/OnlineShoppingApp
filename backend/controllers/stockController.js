const { Stock, Product } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.fetchAll = async (req, res) => {
    try {
        const stock = await Stock.findAll()
        res.json( stock );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.fetchStock = async (req, res) => {
    let warehouseId = req.query['warehouseId']
    try {
        const stocks = await Stock.findAll({where : {warehouseId : warehouseId}})
        let stocksInfo = []
        for (let stock of stocks){
            const product = await Product.findOne({where : {id : stock.productId}})
            stocksInfo.push({...stock.dataValues, name:product.name, description:product.description})
        }
        res.json( stocksInfo );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addStock = async (req, res) => {
    const {warehouseId, productId, quantity} = req.body
    console.log(req.body)
    try {
        const stock = await Stock.create({ warehouseId, productId, quantity });
        res.status(201).json(stock)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

exports.editStock = async (req, res) => {
    let {quantity, warehouseId, productId } = req.body
    let control = quantity
    try {
        const stock = await Stock.findOne({where : {warehouseId:warehouseId, productId:productId}})
        await stock.update({...stock, quantity:+control})
        await stock.save()
        res.json({ message: "Stock edited" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}