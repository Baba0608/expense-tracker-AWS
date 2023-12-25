const express = require("express");

const expenseControllers = require("../controllers/expense");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.get(
  "/monthlydata",
  userAuthentication,
  expenseControllers.getMonthlyData
);

router.get(
  "/dailydata/:pageno",
  userAuthentication,
  expenseControllers.getDailyData
);

router.get("/yearlydata", userAuthentication, expenseControllers.getYearlyData);

router.post("/addexpense", userAuthentication, expenseControllers.postExpense);

router.post("/addincome", userAuthentication, expenseControllers.postIncome);

router.get("/download", userAuthentication, expenseControllers.downloadReport);

router.get(
  "/downloadedfiles",
  userAuthentication,
  expenseControllers.DownloadedFiles
);

module.exports = router;

//
