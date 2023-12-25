require("dotenv").config();
const Razorpay = require("razorpay");

const Order = require("../models/order");

const buyPremium = async (req, res, next) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      const result = await req.user.createOrder({
        orderid: order.id,
        status: "PENDING",
      });

      return res
        .status(201)
        .json({ success: true, result, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, err });
  }
};

const updateTransactionstatus = async (req, res, next) => {
  try {
    const { order_id, payment_id } = req.body;

    const updateOrder = async () => {
      const result = await Order.update(
        { paymentid: payment_id, status: "SUCCESS" },
        {
          where: {
            orderid: order_id,
          },
        }
      );

      return result;
    };

    // update to premium
    const updateUser = async () => {
      const result = await req.user.update({ ispremiumuser: true });
      return result;
    };

    Promise.all([updateOrder(), updateUser()])
      .then((result) => {
        return res.status(202).json({ success: true, result });
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err));
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, err });
  }
};

exports.buyPremium = buyPremium;
exports.updateTransactionstatus = updateTransactionstatus;

//
