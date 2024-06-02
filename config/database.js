const { Sequelize } = require('sequelize');

require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;
const port = process.env.DB_PORT;

const db = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  port: port
});

module.exports = db;