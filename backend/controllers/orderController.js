const { Order, Product, OrderItems, DeliveryPlan } = require('../models');

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
        
        // update the delivery plan
        const existingDeliveryPlan = await DeliveryPlan.findOne({ where: { id:delivery_plan_id } });
        existingDeliveryPlan.update({ order_id : order.id });

        for (const product of products) {
            await OrderItems.create({
                orderId: order.id,
                productId: product.product_id,
                quantity: product.quantity
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createDeliveryPlan = async (req, res) => {
    const { delivery_type, delivery_price, delivery_date, ship_date} = req.body;
    try {
        const deliveryPlan = await DeliveryPlan.create({
            order_id: 0,
            delivery_type,
            delivery_price,
            delivery_date,
            ship_date
        });

        res.status(201).json(deliveryPlan);
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
