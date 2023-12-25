require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const userAuthentication = async (req, res, next) => {
  try {
    // const token = req.headers.token;

    const token = req.headers.authorization;
    const itemsPerPage = +req.headers.itemsperpage;

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, userObj) => {
      if (err) {
        // console.log(err);
        throw new Error("Something went wrong.");
      }

      const user = await User.findOne({ where: { id: userObj.userId } });

      if (user) {
        req.user = user;
        req.itemsPerPage = itemsPerPage;
        next();
      } else {
        return res.status(404).json({ message: "User not found." });
      }

      //   console.log(user);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err });
  }
};

module.exports = userAuthentication;

//
