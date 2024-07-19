const { Staff, Product, Stock, Admin } = require('../models');
const bcrypt = require('bcryptjs');
const { adminController} = require('../controllers/adminController')
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, job_title, salary, adminCode } = req.body;
    try {
        // fetch admin code
        const code = await Admin.findAll()
        // const code  = await adminController.fetchCode()
        if (code.length > 1){
            console.log("Error: Too many staff codes found. Contact Database Admin")
            res.status(500).json({error:"Too many Staff codes found. Contact Database Admin"})
        } 
        else if (code.length == 0) {
            console.log("Error: No Staff code found. Contact Database Admin")
            res.status(500).json({error:"No Staff code found. Contact Database Admin"})
        }
        else {
            if(code[0].dataValues.code !=  adminCode){
                return res.status(500).json({error:"Incorrect Staff Code"})
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const staff = await Staff.create({ name, email, password:hashedPassword, job_title, salary});
            return res.status(201).json(staff);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};

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
