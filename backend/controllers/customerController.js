const { Customer, Address, CreditCard, Staff} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await Customer.create({ name, email, password:hashedPassword });
        return res.status(201).json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { name, password } = req.body;
    let isStaff = false;
    
    try {
        let user = await Customer.findOne({where : {name : name}})
        if (!user) {
            user = await Staff.findOne({where : {name : name}})
            isStaff = true
            if (! user)
                return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) { 
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const adminToken  = jwt.sign({ id: user.id }, process.env.ADMIN_SECRET, { expiresIn: '1h' });
        if (isStaff)
            res.json({ token, adminToken, user})
        else  
            res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCreditCard = async (req, res) => {
    const { customer_id, card_number, expiry_date, billing_address } = req.body;
    try {
        const creditCard = await CreditCard.create({ customer_id, card_number, expiry_date, billing_address });
        res.status(201).json(creditCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.fetchByName = async (req, res) => {
    const { name } = req.body;
    try {
        // Address.create({ customer_id: 2, address: '123 Main St' }); <-- Just for testing/Getting one in system
        // CreditCard.create({ customer_id: 2, card_number: '123456789012', expiry_date: '2023-12-31', billing_address: '123 Main St' }); // <-- Just for testing/Getting one in system
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


exports.update = async (req, res) => {
    console.log('Update Customer');
    const { customer_id, name, email, address, creditCards} = req.body;
    try {
        const customer = await Customer.findOne({ where: { id: customer_id } });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Updates Customer name/email
        await Customer.update({ name, email }, { where: { id: customer_id } });

        // Updates Address
        await Address.update({ address }, { where: { customer_id: customer_id } });
        address1 = await Address.findOne({ where: { customer_id: customer_id } });
        console.log('Address: ', address1);
        if (address1 === null) {
            await Address.create({ customer_id, address });
            console.log('Address created');
        }

        // Deletes all old credit cards and creates new ones
        await CreditCard.destroy({ where: { customer_id: customer_id } });
        creditCards.forEach(async (card) => {
            await CreditCard.create({ customer_id, ...card });
        });

        res.json({ message: 'Customer updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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