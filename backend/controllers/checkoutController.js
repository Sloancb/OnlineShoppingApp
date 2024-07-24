const { Checkout, Product, CheckoutItems } = require('../models');

exports.createCheckout = async (req, res) => {
    const { customer_id } = req.body;
    try {
        const cart = await Checkout.create({
            customer_id,
            total_amount: 0
        });

        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckout = async (req, res) => {
    const { customer_id } = req.body;
    try {
        const cart = await Checkout.findOne({where : {customer_id : customer_id}});
        const cartItems = await CheckoutItems.findAll({where : {checkout_id : cart.id}});
        res.status(201).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addCheckoutItem = async (req, res) => {
    const { customer_id, product, quantity } = req.body;
    try {
        const cart = await Checkout.findOne({where : {customer_id : customer_id}});

        const cartItem = await CheckoutItems.create({
            checkout_id: cart.id,
            product_id: product.id,
            product_price: product.price,
            quantity: quantity
        });

        cart.total_amount = parseFloat(cart.total_amount) + (product.price * quantity);
        await cart.save();

        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeCheckoutItem = async (req, res) => {
    const { customer_id, product } = req.body;
    try {
        const cart = await Checkout.findOne({where : {customer_id : customer_id}});

        const cartItem = await CheckoutItems.destroy({where : {checkout_id : cart.id, product_id: product.id}});

        cart.total_amount = cart.total_amount - (product.price * cartItem.quantity);
        await cart.save();

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearCheckout = async (req, res) => {
    const { customer_id } = req.body;
    try {
        const cart = await Checkout.destroy({where : {customer_id : customer_id}});
        const cartItems = await CheckoutItems.destroy({where : {checkout_id : cart.id}});
        res.status(201).json(cart, cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Checkout.destroy({ where: {} })
        await CheckoutItems.destroy({ where: {} })
        res.json({ message: "All carts and their products deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};