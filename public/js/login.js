const WEBSITE_LINK = "http://localhost:4000";

const gmailEl = document.getElementById("gmail");
const passwordEl = document.getElementById("password");
const msgContainer = document.getElementById("msg-container");
const msgPara = document.getElementById("msg-para");

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (gmailEl.value != "" && passwordEl.value != "") {
    msgContainer.style.display = "none";
    const obj = {
      gmail: gmailEl.value,
      password: passwordEl.value,
    };
    try {
      const result = await axios.post(`${WEBSITE_LINK}/user/login`, obj);
      console.log(result);

      if (result.data.success) {
        gmailEl.value = "";
        passwordEl.value = "";

        localStorage.setItem("token", result.data.token);
        window.location.assign("./expense.html");
      }
    } catch (err) {
      msgPara.textContent = err.message;
      msgContainer.style.display = "block";
      // console.log(err.message);
    }
  } else {
    msgPara.textContent = "Please enter all fields.";
    msgContainer.style.display = "block";
  }
});
