const { Customer, Address, CreditCard } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await Customer.create({ name, email, password:hashedPassword });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { name, password } = req.body;
    try {
        const customer = await Customer.findOne({where : {name : name}})
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        } 
        const isMatch = await bcrypt.compare(password, customer.dataValues.password)
        if (!isMatch) { 
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.fetchByName = async (req, res) => {
    const { name } = req.body;
    try {
        // Address.create({ customer_id: 2, address: '123 Main St' }); <-- Just for testing/Getting one in system
        // CreditCard.create({ customer_id: 2, card_number: '123456789012', expiry_date: '2023-12-31', billing_address: '123 Main St' }); // <-- Just for testing/Getting one in system
        console.log('Credit Card Created');
        const customer = await Customer.findOne({ where: { name: name} });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const address = await Address.findOne({ where: { customer_id: customer.id } });
        const creditCards = await CreditCard.findAll({ where: { customer_id: customer.id } });
        console.log('credit Cards: ', creditCards);
        res.json({ customer, address, creditCards });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.fetchAll = async (req, res) => {
    try {
        const customer = await Customer.findAll()
        res.json({ customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Customer.destroy({ where: {} })
        res.json({ message: "All customers deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}