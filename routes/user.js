const express = require("express");

const signupControllers = require("../controllers/user");

const router = express.Router();

router.post("/signup", signupControllers.postSignupData);

router.post("/login", signupControllers.checkUser);

module.exports = router;

//
