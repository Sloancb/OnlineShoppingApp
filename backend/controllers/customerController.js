const { Customer } = require('../models');
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
        const customer = await Customer.findOne({ where: { name : name } });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
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