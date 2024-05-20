const { Sequelize } = require('sequelize');
const db = new Sequelize('db_sidewi_provbali','dbmasteruser','$?9e8SH)E>}21&]ln6}ke}M5<LK^y`X5',{
    host: "ls-662da47c0dd232d68a24961ebe6a6400a9738f01.cno8wo8uo4fl.ap-southeast-1.rds.amazonaws.com",
    dialect:"mysql"
});

module.exports = db;