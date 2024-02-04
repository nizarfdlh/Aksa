const { Sequelize } = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false
});


// const Sequelize = require('sequelize')

// require('dotenv').config();

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASS,
//     {
//         host: process.env.DB_HOST,
//         logging: false,
//         dialect: 'mysql'
//     }
// );

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully')
}).catch((error ) => {
    console.log('Unable to connect to the database', error);
});

module.exports = sequelize;