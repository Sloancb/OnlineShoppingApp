const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');

const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const staffRoutes = require('./routes/staffRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/carts', cartRoutes);




const { Customer, Product, Cart } = require('./models');
app.get('/', async (req, res) => {
    try {
      //const product = await Product.create({ name: 'pasdoifj', category: 'cataa', brand: 'braranr', size: 'sosid', description: 'dsesfee', price: 332.23 });
      const customers = await Customer.findAll();
      let html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tables</title>
            <style>
              table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
                padding: 5px;
              }
            </style>
          </head>
          <body>
            <h3>Customers</h3>
            <table>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>email</th>
                <th>password</th>
                <th>balance</th>
              </tr>`;
      customers.forEach(item => {
        html += `
              <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.password}</td>
                <td>${item.current_balance}</td>
              </tr>`;
      });
      html += `</table>`

      // ----- products
      const products = await Product.findAll();
      html += `</br>
      <h3>Products</h3>
      <table>
      <tr>
          <th>id</th>
          <th>name</th>
          <th>category</th>
          <th>brand</th>
          <th>size</th>
          <th>descr</th>
          <th>price</th>
          </tr>`;
      products.forEach(item => {
      html += `
          <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.brand}</td>
          <td>${item.size}</td>
          <td>${item.description}</td>
          <td>${item.price}</td>
          </tr>`;
          });
      html += `</table>`

        // ----- cart
        const carts = await Cart.findAll();
        html += `</br>
        <h3>Carts</h3>
        <table>
        <tr>
          <th>id</th>
          <th>customer id</th>
          <th>product id</th>
          <th>quantity</th>
        </tr>`;
        carts.forEach(item => {
        html += `
              <tr>
                <td>${item.id}</td>
                <td>${item.customer_id}</td>
                <td>${item.product_id}</td>
                <td>${item.quantity}</td>
              </tr>`;
        });
        html += `</table>`


      html += `
          </body>
        </html>
      `;
  
      res.send(html); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => console.log(err));
