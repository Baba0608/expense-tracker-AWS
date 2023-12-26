require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./utils/database");

const User = require("./models/users");
const Expense = require("./models/expenses");
const Order = require("./models/order");
const ForgotPassword = require("./models/forgotpassword");
const Downloadfiles = require("./models/downloadfiles");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const leaderBoardRoutes = require("./routes/leaderboard");
const forgotPasswordRoutes = require("./routes/forgotpassword");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/leaderboard", leaderBoardRoutes);
app.use("/forgotpassword", forgotPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(Downloadfiles);
Downloadfiles.belongsTo(User);

const PORT = process.env.PORT || 4000;

console.log("Hiii");

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log("CONNECTED TO DATABASE");
    app.listen(PORT);
  })
  .catch((err) => console.log(err));

//   app.listen(4000); //

console.log("End");
