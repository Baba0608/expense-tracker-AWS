require("dotenv").config();
const Sequelize = require("sequelize");

const DATABASE = process.env.DATABASE;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DB_HOST = process.env.DB_HOST;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: "mysql",
  host: DB_HOST,
});

module.exports = sequelize;

//
