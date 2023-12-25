require("dotenv").config();
const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");

const sequelize = require("../utils/database");
const User = require("../models/users");
const Forgotpassword = require("../models/forgotpassword");

const forgotPassword = async (req, res, next) => {
  try {
    const { gmail } = req.body;

    const user = await User.findOne({ where: { gmail: gmail } });

    // console.log(user);

    if (user) {
      try {
        const result = await user.createForgotpassword({
          id: uuid.v4(),
          isactive: true,
        });

        return res.status(201).json({ success: true, result });
      } catch (err) {
        throw new Error("Something went wrong.");
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Gmail not found." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, err });
  }
};

const resetPasswordMail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const gmail = req.headers.gmail;

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SIB_API;
    const transactionalEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "babafakruddinnitturu@gmail.com",
    };

    const receivers = [
      {
        email: gmail,
      },
    ];

    transactionalEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "Reset password",
        htmlContent: `<p>Unique id : ${id}</p>
        <a href="http://127.0.0.1:5500/Frontend/reset-password.html">Reset password</a>`,
      })
      .then(() => {
        return res.status(200).json({ success: true, message: "Email sent." });
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err));
      });
  } catch (err) {
    // console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();

    const { id, password } = req.body;

    const forgotPassword = await Forgotpassword.findOne({ where: { id: id } });

    if (forgotPassword.isactive === "1") {
      const userId = forgotPassword.userId;

      // updating forgotpasswords table.
      async function updateActiveStatus(forgotPassword) {
        const result = await forgotPassword.update(
          { isactive: false },
          { transaction: t }
        );
        return result;
      }

      // updating password in user table
      async function updateNewPassword(userId, password) {
        let response;
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            throw new Error(JSON.stringify(err));
          }

          const result = await User.update(
            { password: hash },
            { where: { id: userId } },
            { transaction: t }
          );

          response = result;
        });

        return response;
      }

      Promise.all([
        updateActiveStatus(forgotPassword),
        updateNewPassword(userId, password),
      ])
        .then(async (result) => {
          await t.commit();
          return res.status(200).json({
            success: true,
            message: "Password Updated successfully.",
            result,
          });
        })
        .catch(async (err) => {
          await t.rollback();
          throw new Error("Something went wrong.");
        });
    } else {
      throw new Error("Session Expired");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, err });
  }
};

exports.forgotPassword = forgotPassword;
exports.resetPasswordMail = resetPasswordMail;
exports.updatePassword = updatePassword;

///
