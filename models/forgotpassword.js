const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const ForgotPassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },

  isactive: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = ForgotPassword;

//
