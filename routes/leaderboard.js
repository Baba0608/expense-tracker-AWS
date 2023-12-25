const express = require("express");

const leaderBoardControllers = require("../controllers/leaderboard");

const router = express.Router();

router.get("/", leaderBoardControllers.getLeaderBoard);

module.exports = router;

//
