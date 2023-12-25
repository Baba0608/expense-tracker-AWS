const express = require("express");

const userAuthentication = require("../middleware/auth");
const purchaseControllers = require("../controllers/purchase");

const router = express.Router();

router.get("/buypremium", userAuthentication, purchaseControllers.buyPremium);

router.post(
  "/updatetransactionstatus",
  userAuthentication,
  purchaseControllers.updateTransactionstatus
);

module.exports = router;

//
