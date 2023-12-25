const WEBSITE_LINK = "http://localhost:4000";

const forgotPasswordDiv = document.getElementById("forgot-password-div");
const resultBox = document.getElementById("result-box");
const resultMsg = document.getElementById("result-msg");

const gmailEl = document.getElementById("gmail");

const submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (gmailEl.value != "") {
    const result = await axios.post(`${WEBSITE_LINK}/forgotpassword`, {
      gmail: gmailEl.value,
    });

    // console.log(result);

    if (result.data.success) {
      const id = result.data.result.id;

      // window.location.assign("./reset-password.html");

      try {
        const response = await axios.get(
          `${WEBSITE_LINK}/forgotpassword/resetpasswordmail/${id}`,
          { headers: { gmail: gmailEl.value } }
        );

        // console.log(response);

        resultMsg.textContent = "Reset Password link is sent to your gmail.";
      } catch (err) {
        console.log(err);
        resultMsg.textContent = "Something went wrong, try again.";
      }

      forgotPasswordDiv.style.display = "none";
      resultBox.style.display = "block";
    }
  }
});
