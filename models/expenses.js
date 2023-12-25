const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Expense = sequelize.define("expense", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },

  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  income: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  expense: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = Expense;

//
