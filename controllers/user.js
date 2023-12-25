const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

function generateToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.JWT_SECRET_KEY);
}

const postSignupData = async (req, res, next) => {
  try {
    const { username, gmail, password } = req.body;
    console.log(gmail, password);

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw new Error("Something went wrong.");
      }

      const user = await User.create({
        username: username,
        gmail: gmail,
        password: hash,
        total_expense: 0,
      });

      return res
        .status(201)
        .json({ success: true, message: "User created successfully.", user });
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ success: false, message: err });
  }
};

const checkUser = async (req, res, next) => {
  try {
    const { gmail, password } = req.body;

    const user = await User.findOne({ where: { gmail: gmail } });
    // console.log(user);
    if (user === null) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    bcrypt.compare(password, user.dataValues.password, (err, result) => {
      if (err) {
        throw new Error("Something went wrong.");
      }

      if (result) {
        return res.status(200).json({
          success: true,
          message: "User logged in successfully.",
          token: generateToken(user.dataValues.id, user.dataValues.username),
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Password is incorrect." });
      }
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ success: false, message: err });
  }
};

exports.postSignupData = postSignupData;
exports.checkUser = checkUser;

//
