const { Order, Product, OrderItems } = require('../models');

exports.createOrder = async (req, res) => {
    const { customer_id, products, total_amount, delivery_plan_id, payment_method_id } = req.body;
    try {
        const order = await Order.create({
            customer_id,
            total_amount,
            delivery_plan_id,
            payment_method_id,
            status: 'issued'
        });

        for (const product of products) {
            await OrderItems.create({
                order_id: order.id,
                product_id: product.product_id,
                quantity: product.quantity
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
