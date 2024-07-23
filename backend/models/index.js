const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Customer = require('./customer')(sequelize, Sequelize);
const Checkout = require('./checkout')(sequelize, Sequelize);
const CheckoutItems = require('./checkoutItems')(sequelize, Sequelize);
const Product = require('./product')(sequelize, Sequelize);
const Order = require('./order')(sequelize, Sequelize);
const Stock = require('./stock')(sequelize, Sequelize);
const Warehouse = require('./warehouse')(sequelize, Sequelize);

Customer.hasMany(Order);
Order.belongsTo(Customer);

Product.belongsToMany(Warehouse, { through: Stock });
Warehouse.belongsToMany(Product, { through: Stock });

Order.belongsToMany(Product, { through: 'OrderItems' });
Product.belongsToMany(Order, { through: 'OrderItems' });

//Customer.hasOne(Checkout);
//Checkout.belongsTo(Customer);
//Checkout.belongsToMany(Product, { through: CheckoutItems });
//Product.belongsToMany(Checkout, { through: CheckoutItems });

module.exports = {
    sequelize,
    Checkout,
    CheckoutItems,
    Customer,
    Product,
    Order,
    Stock,
    Warehouse
};
