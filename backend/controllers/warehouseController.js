const { Warehouse } = require('../models');
const { Stock } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.fetchAll = async (req, res) => {
    try {
        const warehouses = await Warehouse.findAll()
        let warehousesInfo = []
        for (let warehouse of warehouses) {
            const stock = await Stock.findAll({where : {warehouseId : warehouse.id}})
            warehousesInfo.push({...warehouse.dataValues, currentCapacity: stock.length})
        }
        res.json( warehousesInfo );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

