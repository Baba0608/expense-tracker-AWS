const sequelize = require("../utils/database");

const User = require("../models/users");
const Expense = require("../models/expenses");

const getLeaderBoard = async (req, res, next) => {
  const result = await User.findAll({
    attributes: [
      "id",
      "username",
      [sequelize.fn("SUM", sequelize.col("income")), "TOTAL_INCOME"],
      [sequelize.fn("SUM", sequelize.col("expense")), "TOTAL_EXPENSE"],
    ],
    include: [
      {
        model: Expense,
        attributes: [],
      },
    ],
    group: [["id", "username"]],
    order: [["TOTAL_EXPENSE"]],
  });
  return res.status(200).json({ result });
};

exports.getLeaderBoard = getLeaderBoard;

//
