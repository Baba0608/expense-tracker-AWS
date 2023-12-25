const container = document.getElementById("container");
const leaderBoardContainer = document.getElementById("leaderboard-container");
const leaderBoardDisplay = document.getElementById("leaderboard-display");
const loginLogout = document.getElementById("login-logout");
const homeBtn = document.getElementById("home");

const generateReportAddExpense = document.getElementById(
  "generate-report-add-expense"
);
const addExpense = document.getElementById("add-expense");
const generatereport = document.getElementById("generate-report");

// filter elements
const expenseFilter = document.querySelectorAll(".filter");

const dailyEl = document.getElementById("daily");
const monthlyEl = document.getElementById("monthly");
const yearlyEl = document.getElementById("yearly");

// expense list container
const expenseListContainer = document.getElementById("expense-list-container");

const expenseIncome = document.getElementById("expense-income");
const expenseInput = document.getElementById("expense-input");
const incomeInput = document.getElementById("income-input");
const expenseButton = document.getElementById("expense-button");
const incomeButton = document.getElementById("income-button");
const addExpenseButton = document.getElementById("add-expense-btn");
const addIncomeButton = document.getElementById("add-income-btn");

const downloadReportContainer = document.getElementById(
  "download-report-container"
);
const downloadReport = document.getElementById("download-report");

const pageNumber = document.querySelectorAll(".page-no");
const pagination = document.getElementById("pagination");

//-------------------------------------
const buyPremium = document.getElementById("buy-premium");
const premiumUserItem = document.getElementById("premium-user-item");
const buyPremiumItem = document.getElementById("buy-premium-item");
const leaderBoard = document.getElementById("leaderboard");

const navList = document.getElementById("nav-list");

const itemsPerPage = 2;

const dailyTableTh = [
  "S.No",
  "Date",
  "Description",
  "Category",
  "Income",
  "Expense",
];

(async function displayExpenses() {
  loginLogout.textContent = "Logout";

  const dailyExpenseList = document.createElement("div");
  dailyExpenseList.className = `daily-expense-list`;
  dailyExpenseList.id = `daily-expense-list`;

  const table = document.createElement("table");
  table.id = "daily-table";
  createExpenseList(
    dailyTableTh,
    dailyExpenseList,
    expenseListContainer,
    table
  );

  const token = localStorage.getItem("token");
  const result = await axios.get(`http://localhost:4000/expense/dailydata/1`, {
    headers: { authorization: token, itemsPerPage: itemsPerPage },
  });

  console.log(result);

  if (result.data.isPremium) {
    buyPremiumItem.style.display = "none";
    premiumUserItem.style.display = "block";
    leaderBoard.style.display = "block";
    navList.style.width = "50%";
  }

  result.data.result.forEach((ele, i) => {
    const tr = document.createElement("tr");

    const serialNum = document.createElement("td");
    serialNum.textContent = i + 1 * (itemsPerPage - 1);
    tr.appendChild(serialNum);

    const date = document.createElement("td");
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    date.textContent = `${y}-${m + 1}-${day}`;
    tr.appendChild(date);

    const description = document.createElement("td");
    description.textContent = ele.description;
    tr.appendChild(description);

    const category = document.createElement("td");
    category.textContent = ele.category;
    tr.appendChild(category);

    const income = document.createElement("td");
    income.textContent = ele.income;
    tr.appendChild(income);

    const expense = document.createElement("td");
    expense.textContent = ele.expense;
    tr.appendChild(expense);

    table.appendChild(tr);
  });

  const previous = document.getElementById("previous");
  if (result.data.current > 1) {
    const previousPage = document.getElementById("previous-page");
    previousPage.textContent = +result.data.currentPage - 1;
    previous.style.display = "block";
  } else {
    previous.style.display = "none";
  }

  const next = document.getElementById("next");
  if (result.data.hasNext) {
    const nextPage = document.getElementById("next-page");
    nextPage.textContent = +result.data.currentPage + 1;
    next.style.display = "block";
  } else {
    next.style.display = "none";
  }
})();

pageNumber.forEach((page) => {
  page.addEventListener("click", async (e) => {
    e.preventDefault();

    const pageNo = e.target.textContent;

    const child = expenseListContainer.firstElementChild;
    // console.log(child);

    expenseListContainer.removeChild(child);

    const dailyExpenseList = document.createElement("div");
    dailyExpenseList.className = `daily-expense-list`;
    dailyExpenseList.id = `daily-expense-list`;

    const table = document.createElement("table");
    table.id = "daily-table";
    createExpenseList(
      dailyTableTh,
      dailyExpenseList,
      expenseListContainer,
      table
    );

    const token = localStorage.getItem("token");
    const result = await axios.get(
      `http://localhost:4000/expense/dailydata/${pageNo}`,
      { headers: { authorization: token, itemsPerPage: itemsPerPage } }
    );

    console.log(result);
    result.data.result.forEach((ele, i) => {
      const tr = document.createElement("tr");

      const serialNum = document.createElement("td");
      serialNum.textContent = i + (pageNo - 1) * itemsPerPage + 1;
      tr.appendChild(serialNum);

      const date = document.createElement("td");
      const d = new Date();
      const y = d.getFullYear();
      const m = d.getMonth();
      const day = d.getDate();
      date.textContent = `${y}-${m + 1}-${day}`;
      tr.appendChild(date);

      const description = document.createElement("td");
      description.textContent = ele.description;
      tr.appendChild(description);

      const category = document.createElement("td");
      category.textContent = ele.category;
      tr.appendChild(category);

      const income = document.createElement("td");
      income.textContent = ele.income;
      tr.appendChild(income);

      const expense = document.createElement("td");
      expense.textContent = ele.expense;
      tr.appendChild(expense);

      table.appendChild(tr);
    });

    const previous = document.getElementById("previous");
    if (+result.data.currentPage > 1) {
      const previousPage = document.getElementById("previous-page");
      previousPage.textContent = +result.data.currentPage - 1;
      previous.style.display = "block";
    } else {
      previous.style.display = "none";
    }

    const currentPageEl = document.getElementById("current-page");
    currentPageEl.textContent = +result.data.currentPage;

    const next = document.getElementById("next");
    if (result.data.hasNext) {
      const nextPage = document.getElementById("next-page");
      nextPage.textContent = +result.data.currentPage + 1;
      next.style.display = "block";
    } else {
      next.style.display = "none";
    }
  });
});

// filter elemenths event lister.

expenseFilter.forEach((filter) => {
  filter.addEventListener("click", (e) => {
    e.preventDefault();
    expenseFilter.forEach((filter) => {
      filter.classList.remove("active");
    });
    filter.classList.add("active");
  });
});

dailyEl.addEventListener("click", async (e) => {
  e.preventDefault();

  pagination.style.display = "flex";
  const child = expenseListContainer.firstElementChild;
  // console.log(child);

  expenseListContainer.removeChild(child);

  const dailyExpenseList = document.createElement("div");
  dailyExpenseList.className = `daily-expense-list`;
  dailyExpenseList.id = `daily-expense-list`;

  const table = document.createElement("table");
  table.id = "daily-table";
  createExpenseList(
    dailyTableTh,
    dailyExpenseList,
    expenseListContainer,
    table
  );

  // calling backend api for daily expenses

  const token = localStorage.getItem("token");
  const result = await axios.get("http://localhost:4000/expense/dailydata/1", {
    headers: { authorization: token, itemsPerPage: itemsPerPage },
  });

  // console.log(result);

  result.data.result.forEach((ele, i) => {
    const tr = document.createElement("tr");

    const serialNum = document.createElement("td");
    serialNum.textContent = i + 1;
    tr.appendChild(serialNum);

    const date = document.createElement("td");
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    date.textContent = `${y}-${m + 1}-${day}`;
    tr.appendChild(date);

    const description = document.createElement("td");
    description.textContent = ele.description;
    tr.appendChild(description);

    const category = document.createElement("td");
    category.textContent = ele.category;
    tr.appendChild(category);

    const income = document.createElement("td");
    income.textContent = ele.income;
    tr.appendChild(income);

    const expense = document.createElement("td");
    expense.textContent = ele.expense;
    tr.appendChild(expense);

    table.appendChild(tr);
  });

  const previous = document.getElementById("previous");
  if (+result.data.currentPage > 1) {
    const previousPage = document.getElementById("previous-page");
    previousPage.textContent = +result.data.currentPage - 1;
    previous.style.display = "block";
  } else {
    previous.style.display = "none";
  }

  const currentPageEl = document.getElementById("current-page");
  currentPageEl.textContent = +result.data.currentPage;

  const next = document.getElementById("next");
  if (result.data.hasNext) {
    const nextPage = document.getElementById("next-page");
    nextPage.textContent = +result.data.currentPage + 1;
    next.style.display = "block";
  } else {
    next.style.display = "none";
  }
});

function createExpenseList(arr, expenseList, expenseListContainer, table) {
  const tr = document.createElement("tr");

  arr.forEach((row) => {
    const th = document.createElement("th");
    th.textContent = row;
    tr.appendChild(th);
  });

  table.appendChild(tr);
  expenseList.appendChild(table);

  expenseListContainer.appendChild(expenseList);
}

// event listener for monthly expenses.
monthlyEl.addEventListener("click", async (e) => {
  e.preventDefault();

  pagination.style.display = "none";
  const child = expenseListContainer.firstElementChild;

  expenseListContainer.removeChild(child);

  const monthlyExpenseList = document.createElement("div");
  monthlyExpenseList.className = `monthly-expense-list`;
  monthlyExpenseList.id = `monthly-expense-list`;

  const table = document.createElement("table");

  const monthlyTableTh = ["S.No", "Month", "Income", "Expense"];

  createExpenseList(
    monthlyTableTh,
    monthlyExpenseList,
    expenseListContainer,
    table
  );

  // calling backend api to get data
  const token = localStorage.getItem("token");
  const result = await axios.get("http://localhost:4000/expense/monthlydata", {
    headers: { authorization: token },
  });

  // console.log(result);

  result.data.result.forEach((ele, i) => {
    const tr = document.createElement("tr");

    const serialNum = document.createElement("td");
    serialNum.textContent = i + 1;
    tr.appendChild(serialNum);

    const month = document.createElement("td");
    month.textContent = ele.MONTH;
    tr.appendChild(month);

    const income = document.createElement("td");
    income.textContent = ele.TOTAL_INCOME;
    tr.appendChild(income);

    const expense = document.createElement("td");
    expense.textContent = ele.TOTAL_EXPENSE;
    tr.appendChild(expense);

    table.appendChild(tr);
  });
});

yearlyEl.addEventListener("click", async (e) => {
  e.preventDefault();

  pagination.style.display = "none";
  const child = expenseListContainer.firstElementChild;

  expenseListContainer.removeChild(child);

  const yearlyTableTh = ["S.No", "Year", "Income", "Expense"];

  const yearlyExpenseList = document.createElement("div");
  yearlyExpenseList.className = `yearly-expense-list`;
  yearlyExpenseList.id = `yearly-expense-list`;

  const table = document.createElement("table");

  createExpenseList(
    yearlyTableTh,
    yearlyExpenseList,
    expenseListContainer,
    table
  );

  // calling backend api for yearly data
  const token = localStorage.getItem("token");
  const result = await axios.get("http://localhost:4000/expense/yearlydata", {
    headers: { authorization: token },
  });

  // console.log(result);

  result.data.result.forEach((ele, i) => {
    const tr = document.createElement("tr");

    const serialNum = document.createElement("td");
    serialNum.textContent = i + 1;
    tr.appendChild(serialNum);

    const year = document.createElement("td");
    year.textContent = ele.YEAR;
    tr.appendChild(year);

    const income = document.createElement("td");
    income.textContent = ele.TOTAL_INCOME;
    tr.appendChild(income);

    const expense = document.createElement("td");
    expense.textContent = ele.TOTAL_EXPENSE;
    tr.appendChild(expense);

    table.appendChild(tr);
  });
});

// -------------------------------------------------------

function premiumUserModifications() {
  buyPremiumItem.style.display = "none";
  premiumUserItem.style.display = "block";
  leaderBoard.style.display = "block";
  navList.style.width = "50%";
}

buyPremium.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:4000/purchase/buypremium",
      { headers: { authorization: token } }
    );
    console.log(response);
    const options = {
      key: response.data.key_id,
      order_id: response.data.result.orderid,
      handler: async function (response) {
        const result = await axios.post(
          "http://localhost:4000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { authorization: token },
          }
        );

        console.log(result);
        alert("You are a premium user now.");

        premiumUserModifications();
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    rzp1.preventDefault();

    rzp1.on("payment_failed", function (response) {
      console.log(response);
      alert("Something went wrong.");
    });
  } catch (err) {
    console.log(err);
  }
});

leaderBoard.addEventListener("click", async (e) => {
  e.preventDefault();

  const leaderBoardDisplayEl = document.getElementById("leaderboard-display");
  if (leaderBoardDisplayEl) {
    leaderBoardContainer.removeChild(leaderBoardDisplayEl);
  }
  leaderBoardContainer.style.display = "none";

  container.style.display = "none";
  downloadReportContainer.style.display = "none";

  leaderBoardContainer.style.display = "flex";
  const result = await axios.get("http://localhost:4000/leaderboard");
  console.log(result);

  const leaderBoardDisplay = document.createElement("div");
  leaderBoardDisplay.className = "leaderboard-display";
  leaderBoardDisplay.id = "leaderboard-display";

  const obj = {
    username: "Name",
    TOTAL_INCOME: "Total Income",
    TOTAL_EXPENSE: "Total Expense",
  };
  createLeaderBoardElement(obj, leaderBoardDisplay, "S.No");

  result.data.result.forEach((ele, i) => {
    createLeaderBoardElement(ele, leaderBoardDisplay, i + 1);
  });

  leaderBoardContainer.appendChild(leaderBoardDisplay);
});

function createLeaderBoardElement(ele, leaderBoardDisplay, i) {
  const userDiv = document.createElement("div");
  userDiv.className = "user-div";

  const sNo = document.createElement("div");
  sNo.className = "s-no";

  const pSNo = document.createElement("p");
  pSNo.textContent = i;
  sNo.appendChild(pSNo);

  const name = document.createElement("div");
  name.className = "name";

  const pName = document.createElement("p");
  pName.textContent = ele.username;
  name.appendChild(pName);

  const totalIncome = document.createElement("div");
  totalIncome.className = "total-income";

  const pTotalIncome = document.createElement("p");
  pTotalIncome.textContent = ele.TOTAL_INCOME;
  totalIncome.appendChild(pTotalIncome);

  const totalExpense = document.createElement("div");
  totalExpense.className = "total-expense";

  const pTotalExpense = document.createElement("p");
  pTotalExpense.textContent = ele.TOTAL_EXPENSE;
  totalExpense.appendChild(pTotalExpense);

  userDiv.appendChild(sNo);
  userDiv.appendChild(name);
  userDiv.appendChild(totalIncome);
  userDiv.appendChild(totalExpense);

  leaderBoardDisplay.appendChild(userDiv);
}

homeBtn.addEventListener("click", (e) => {
  e.preventDefault();

  leaderBoardContainer.style.display = "none";
  container.style.display = "block";
  generateReportAddExpense.style.display = "flex";
  expenseIncome.style.display = "none";
  location.reload();
});

addExpense.addEventListener("click", (e) => {
  e.preventDefault();
  container.style.display = "none";
  generateReportAddExpense.style.display = "none";
  expenseIncome.style.display = "flex";
  expenseInput.style.display = "block";
  incomeInput.style.display = "none";
  incomeButton.classList.remove("active");
  expenseButton.classList.add("active");
});

expenseButton.addEventListener("click", (e) => {
  e.preventDefault();
  incomeInput.style.display = "none";
  incomeButton.classList.remove("active");
  expenseButton.classList.add("active");
  expenseInput.style.display = "block";
});

incomeButton.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log("clicked");
  expenseInput.style.display = "none";
  expenseButton.classList.remove("active");
  incomeButton.classList.add("active");
  incomeInput.style.display = "block";
});

addExpenseButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const expense = document.getElementById("expense").value;

  if (description != "" && category != "" && expense != "") {
    const result = await axios.post(
      "http://localhost:4000/expense/addexpense",
      {
        description: description,
        category: category,
        expenseAmount: expense,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    // console.log(result);
    location.reload();
  }
});

addIncomeButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const description = document.getElementById("income-description").value;
  const income = document.getElementById("income-amount").value;

  if (description != "" && income != "") {
    const result = await axios.post(
      "http://localhost:4000/expense/addincome",
      {
        description: description,
        income: income,
      },
      { headers: { authorization: localStorage.getItem("token") } }
    );

    console.log(result);
    location.reload();
  }
});

generatereport.addEventListener("click", async (e) => {
  e.preventDefault();

  const downloadedFilesRemove = document.getElementById("downloaded-files");

  if (downloadedFilesRemove) {
    downloadReportContainer.removeChild(downloadedFilesRemove);
  }

  const downloadedFiles = document.createElement("div");
  downloadedFiles.className = "downloaded-files";
  downloadedFiles.id = "downloaded-files";

  // call api for links of already downloded files
  const token = localStorage.getItem("token");
  const result = await axios.get(
    "http://localhost:4000/expense/downloadedfiles",
    { headers: { authorization: token } }
  );

  console.log(result);
  result.data.fileLinks.forEach((file) => {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = file.fileurl;
    a.textContent = file.fileurl;

    p.appendChild(a);

    downloadedFiles.appendChild(p);
  });

  downloadReportContainer.appendChild(downloadedFiles);

  container.style.display = "none";

  downloadReportContainer.style.display = "flex";
});

downloadReport.addEventListener("click", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const result = await axios.get("http://localhost:4000/expense/download", {
    headers: { authorization: token },
  });

  // console.log(result);
  const a = document.createElement("a");
  a.href = result.data.fileUrl;
  a.click();
});
