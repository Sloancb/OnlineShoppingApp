const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Customer = require('./customer')(sequelize, Sequelize);
const Product = require('./product')(sequelize, Sequelize);
const Order = require('./order')(sequelize, Sequelize);
const Stock = require('./stock')(sequelize, Sequelize);
const Warehouse = require('./warehouse')(sequelize, Sequelize);
const CreditCard = require('./creditCard')(sequelize, Sequelize);
const Address = require('./address')(sequelize, Sequelize);

Customer.hasMany(Order);
Customer.hasMany(CreditCard);
Order.belongsTo(Customer);

Product.belongsToMany(Warehouse, { through: Stock });
Warehouse.belongsToMany(Product, { through: Stock });

Order.belongsToMany(Product, { through: 'OrderItems' });
Product.belongsToMany(Order, { through: 'OrderItems' });

module.exports = {
    sequelize,
    Customer,
    Product,
    Order,
    Stock,
    Warehouse,
    CreditCard,
    Address
};
