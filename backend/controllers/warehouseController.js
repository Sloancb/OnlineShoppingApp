const { Warehouse } = require('../models');
const { Stock } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.fetchAll = async (req, res) => {
    try {
        const warehouses = await Warehouse.findAll()
        let warehousesInfo = []
        for (let warehouse of warehouses) {
            const stocks = await Stock.findAll({where : {warehouseId : warehouse.id}})
            // console.log(stock)
            currentCapacity = stocks.reduce((a,b)=>{return a+b.dataValues.quantity}, 0)
            warehousesInfo.push({...warehouse.dataValues, currentCapacity: currentCapacity})
        }
        res.json( warehousesInfo );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

