const WEBSITE_LINK = "http://localhost:4000";

const nameEl = document.getElementById("username");
const gmailEl = document.getElementById("gmail");
const passwordEl = document.getElementById("password");
const msgEl = document.getElementById("msg");
const msgParaEl = document.getElementById("msg-para");

const signupButton = document.getElementById("signup-btn");

signupButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (nameEl.value != "" && gmailEl.value != "" && passwordEl.value != "") {
    msgEl.style.display = "none";

    obj = {
      username: nameEl.value,
      gmail: gmailEl.value,
      password: passwordEl.value,
    };

    try {
      const result = await axios.post(`${WEBSITE_LINK}/user/signup`, obj);
      console.log(result);

      nameEl.value = "";
      gmailEl.value = "";
      passwordEl.value = "";

      window.location.assign("./login.html");
    } catch (err) {
      msgParaEl.textContent = "Already having account with given gmail.";
      msgEl.style.display = "block";
      // console.log(err);
    }
  } else {
    msgParaEl.textContent = "Please enter all fields";
    msgEl.style.display = "block";
  }
});
