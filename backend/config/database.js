// const { Sequelize } = require('@sequelize/core');
// const { PostgresDialect } = require('@sequelize/postgres')+

// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: PostgresDialect,
//     logging: false,
// });

// sequelize.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log('Error: ' + err));

// module.exports = sequelize;

const { Sequelize } = require('@sequelize/core')
const { PostgresDialect } = require('@sequelize/postgres')

require('dotenv').config();

 const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    host: 'localhost',
    define: {
      timestamps: false
    },
    port: 5432,
    clientMinMessages: 'notice',
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;