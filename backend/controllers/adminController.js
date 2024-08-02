const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.fetchCode = async (req, res) => {
    try {
        const code = Admin.findAll()
        if (code.length > 1){
            console.log("Error: Too many admin codes found. Contact Database Admin")
            res.status(500).json({error:"Too many admin codes found. Contact Database Admin"})
        } 
        else if (code.length == 0) {
            console.log("Error: No admin code found. Contact Database Admin")
            res.status(500).json({error:"No admin code found. Contact Database Admin"})
        } 
        else {
            res.status(200).json({code:code[0].dataValues.code})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};