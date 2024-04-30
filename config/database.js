const { Sequelize } = require('sequelize');
const db = new Sequelize('db_sidewi_provbali','root','',{
    host: "localhost",
    dialect:"mysql"
});

module.exports = db;