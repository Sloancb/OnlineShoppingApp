const { Stock, Product, Warehouse } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function checkCapacity(warehouseId, quantity, productId){
    const warehouse = await Warehouse.findAll({where : {id : warehouseId}})
    const stocks = await Stock.findAll({where : {warehouseId :warehouseId}})
    console.log(productId)
    currentCapacity = stocks.reduce((a,b)=>{
        console.log(b.dataValues.productId, b.dataValues.quantity)
        if( b.dataValues.productId == productId)
            return a
        return a+b.dataValues.quantity
    }, 0)
    capacity = warehouse[0].dataValues.capacity
    console.log('cap:', capacity)
    console.log('comp:', currentCapacity + quantity)
    console.log('ret:', capacity <= currentCapacity + quantity)
    // console.log(capacity )
    return capacity >= currentCapacity + quantity
}

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
    try {
        if (! await checkCapacity(warehouseId, +quantity, false)){
            return res.status(403).json({ error: "Not enough space in warehouse!" })
        }
        const stock = await Stock.create({ warehouseId, productId, quantity });
        res.status(201).json(stock)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

exports.editStock = async (req, res) => {
    let {quantity, warehouseId, productId } = req.body
    try {
        if (!await checkCapacity(warehouseId, +quantity, productId)){
            return res.status(403).json({ error: "Not enough space in warehouse!" })
        }
        const stock = await Stock.findOne({where : {warehouseId:warehouseId, productId:productId}})
        await stock.update({...stock, quantity:+quantity})
        await stock.save()
        res.json({ message: "Stock edited" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}