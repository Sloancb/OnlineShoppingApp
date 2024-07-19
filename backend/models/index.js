const Sequelize = require('@sequelize/core');
const sequelize = require('../config/database');

const Customer = require('./customer')(sequelize, Sequelize);
const Product = require('./product')(sequelize, Sequelize);
const Order = require('./order')(sequelize, Sequelize);
const Stock = require('./stock')(sequelize, Sequelize);
const Warehouse = require('./warehouse')(sequelize, Sequelize);
const Staff = require('./staff')(sequelize, Sequelize);
const Admin = require('./admin')(sequelize, Sequelize);

Customer.hasMany(Order);
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
    Staff,
    Warehouse,
    Admin
};
