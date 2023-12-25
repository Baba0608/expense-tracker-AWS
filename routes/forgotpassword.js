const express = require("express");

const forgotPasswordControllers = require("../controllers/forgotpassword");

const router = express.Router();

router.post("/", forgotPasswordControllers.forgotPassword);

router.get(
  "/resetpasswordmail/:id",
  forgotPasswordControllers.resetPasswordMail
);

router.post("/updatepassword", forgotPasswordControllers.updatePassword);

module.exports = router;

//
