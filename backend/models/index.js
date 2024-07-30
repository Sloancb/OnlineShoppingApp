const Sequelize = require('@sequelize/core');
const sequelize = require('../config/database');

const Customer = require('./customer')(sequelize, Sequelize);
const Checkout = require('./checkout')(sequelize, Sequelize);
const CheckoutItems = require('./checkoutItems')(sequelize, Sequelize);
const Product = require('./product')(sequelize, Sequelize);
const Order = require('./order')(sequelize, Sequelize);
const Stock = require('./stock')(sequelize, Sequelize);
const Warehouse = require('./warehouse')(sequelize, Sequelize);
const CreditCard = require('./creditCard')(sequelize, Sequelize);
const Address = require('./address')(sequelize, Sequelize);
const Cart = require('./cart')(sequelize, Sequelize);
const Staff = require('./staff')(sequelize, Sequelize);
const Admin = require('./admin')(sequelize, Sequelize);

Customer.hasMany(Order);
Customer.hasMany(CreditCard);
Order.belongsTo(Customer);

Product.belongsToMany(Warehouse, { through: Stock });
Warehouse.belongsToMany(Product, { through: Stock });

Order.belongsToMany(Product, { through: 'OrderItems' });
Product.belongsToMany(Order, { through: 'OrderItems' });

Customer.hasMany(Cart, { foreignKey: 'customer_id' });
Cart.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = {
    sequelize,
    Checkout,
    CheckoutItems,
    Customer,
    Product,
    Order,
    Stock,
    Warehouse,
    CreditCard,
    Address,
    Cart,
    Staff,
    Warehouse,
    Admin
};
