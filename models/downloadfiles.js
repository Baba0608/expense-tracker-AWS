const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Downloadfiles = sequelize.define("downloadfiles", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  fileurl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Downloadfiles;

//
