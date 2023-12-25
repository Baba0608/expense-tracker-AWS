require("dotenv").config();
const sequelize = require("../utils/database");
const { Op } = require("sequelize");
const AWS = require("aws-sdk");

const Expense = require("../models/expenses");
const Downloadfiles = require("../models/downloadfiles");

// const incrementResult = await jane.increment('age', { by: 2 });
const postExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { description, category, expenseAmount } = req.body;

    const expense = await req.user.createExpense(
      {
        description: description,
        category: category,
        expense: expenseAmount,
        income: 0,
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({ success: true, expense });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const postIncome = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { description, income } = req.body;
    const user = req.user.dataValues;

    const result = await req.user.createExpense(
      {
        description: description,
        income: income,
        expense: 0,
        category: "---",
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(200).json({ success: true, result });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getMonthlyData = async (req, res, next) => {
  try {
    const d = new Date();
    const year = d.getFullYear();
    const result = await Expense.findAll({
      attributes: [
        [sequelize.fn("MONTHNAME", sequelize.col("createdAt")), "MONTH"],
        [sequelize.fn("SUM", sequelize.col("expense")), "TOTAL_EXPENSE"],
        [sequelize.fn("SUM", sequelize.col("income")), "TOTAL_INCOME"],
      ],

      where: {
        createdAt: {
          [Op.gt]: `${year}-01-01 00:00:00`,
        },
        userId: req.user.dataValues.id,
      },

      group: ["MONTH"],
    });
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getDailyData = async (req, res, next) => {
  const d = new Date();

  const year = d.getFullYear();
  const month = d.getMonth();
  const date = d.getDate();
  // console.log(`${year} - ${month + 1} - ${date}`);

  try {
    const user = req.user.dataValues;
    const pageNo = +req.params.pageno;
    const itemsPerPage = +req.itemsPerPage;

    const total = await Expense.count({
      where: {
        createdAt: {
          [Op.gt]: `${year}-${month + 1}-${date} 00:00:00`,
        },

        userId: user.id,
      },
    });

    const result = await Expense.findAll({
      where: {
        createdAt: {
          [Op.gt]: `${year}-${month + 1}-${date} 00:00:00`,
        },

        userId: user.id,
      },

      offset: (pageNo - 1) * itemsPerPage,
      limit: itemsPerPage,
    });

    const isPremium = user.ispremiumuser;

    return res.status(200).json({
      success: true,
      result,
      isPremium,
      hasNext: itemsPerPage * pageNo < total,
      currentPage: pageNo,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong." });
  }
};

const getYearlyData = async (req, res, next) => {
  try {
    const user = req.user.dataValues;

    const result = await Expense.findAll({
      attributes: [
        [sequelize.fn("YEAR", sequelize.col("createdAt")), "YEAR"],
        [sequelize.fn("SUM", sequelize.col("expense")), "TOTAL_EXPENSE"],
        [sequelize.fn("SUM", sequelize.col("income")), "TOTAL_INCOME"],
      ],

      where: {
        userId: user.id,
      },

      group: ["YEAR"],
    });

    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "Something went wrong." });
  }
};

const downloadReport = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const expenses = await req.user.getExpenses({ transaction: t });

    const name = req.user.dataValues.username;
    const id = req.user.dataValues.id;
    const fileName = `${name}${id} ${new Date()}.txt`;
    const data = JSON.stringify(expenses);

    const fileUrl = await uploadToS3(data, fileName);

    await Downloadfiles.create(
      {
        fileurl: fileUrl,
        userId: req.user.dataValues.id,
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

function uploadToS3(data, fileName) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_ACCESSKEY = process.env.IAM_USER_ACCESSKEY;
  const IAM_USER_SECRETKEY = process.env.IAM_USER_SECRETKEY;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_ACCESSKEY,
    secretAccessKey: IAM_USER_SECRETKEY,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
}

const DownloadedFiles = async (req, res, next) => {
  try {
    const fileLinks = await Downloadfiles.findAll({
      where: {
        userId: req.user.dataValues.id,
      },
    });

    // console.log(fileLinks);

    return res.status(200).json({ success: true, fileLinks });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

// exports.getExpenses = getExpenses;
exports.postExpense = postExpense;
exports.postIncome = postIncome;
exports.getMonthlyData = getMonthlyData;
exports.getDailyData = getDailyData;
exports.getYearlyData = getYearlyData;
exports.downloadReport = downloadReport;
exports.DownloadedFiles = DownloadedFiles;
