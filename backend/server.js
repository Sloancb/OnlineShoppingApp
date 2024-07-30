const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');

const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const staffRoutes = require('./routes/staffRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const adminRoutes = require('./routes/adminRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const stockRoutes = require('./routes/stockRoutes');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/stock', stockRoutes);

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => console.log(err));
