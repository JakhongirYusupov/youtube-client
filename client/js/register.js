const form = document.querySelector(".site-form");
const name = document.querySelector("#usernameInput");
const password = document.querySelector("#passwordInput");
const img = document.querySelector("#uploadInput");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formdata = new FormData();

  formdata.append("username", name.value);
  formdata.append("password", password.value);
  formdata.append("profile_img", img.files[0]);

  const res = await fetch(`http://localhost:5000/register`, {
    method: "POST",
    body: formdata,
  });
  const data = await res.json();

  if (data.status === 200) {
    alert(data.message);
    window.location = "/login.html";
  } else {
    alert(data.message ? data.message : data.msg);
  }
});
