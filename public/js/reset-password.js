const newPassword = document.getElementById("new-password");
const conformPassword = document.getElementById("conform-password");
const uniqueId = document.getElementById("unique-id");
const msg = document.getElementById("msg");
const submitButton = document.getElementById("submit");
const resetPasswordContainer = document.getElementById("reset-password");
const resultMsg = document.getElementById("result-msg-para");
const resultMsgContainer = document.getElementById("result-msg");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  conformPassword.classList.remove("error");
  msg.style.display = "none";

  if (
    newPassword.value != "" &&
    conformPassword.value != "" &&
    uniqueId.value != ""
  ) {
    if (newPassword.value != conformPassword.value) {
      conformPassword.classList.add("error");
      msg.style.display = "block";
    } else {
      const id = uniqueId.value;
      const obj = {
        id: id,
        password: newPassword.value,
      };

      try {
        const result = await axios.post(
          "http://localhost:4000/forgotpassword/updatepassword",
          obj
        );

        console.log(result);

        resultMsg.textContent =
          "Your Password Updated successfully. You can login using new Password.";
      } catch (err) {
        console.log(err);
        resultMsg.textContent = "Something went wrong.";
      }

      resetPasswordContainer.style.display = "none";
      resultMsgContainer.style.display = "block";
    }
  }
});
