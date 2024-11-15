const { Sequelize } = require('sequelize');
const config = require('../config.json');

//you can see that this sequalize are objects and classes
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: 'mysql',
});//this is a constructor

sequelize.authenticate()//these are the methods used in the classes
  .then(() => {
    console.log("MySQL Database connected successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the MySQL database:", err);
  });

module.exports = sequelize;