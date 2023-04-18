const form = document.querySelector(".site-form");
const name = document.querySelector("#usernameInput");
const password = document.querySelector("#passwordInput");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log({
    username: name.value,
    password: password.value,
  });

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    body: JSON.stringify({
      username: name.value,
      password: password.value,
    }),
    headers: {
      "Content-type": "Application/json",
    },
  });

  const data = await res.json();
  console.log(data);
  if (data.status === 200) {
    localStorage.setItem("token", JSON.stringify(data.token));
    window.location = "/";
  } else {
    alert(data.msg || data.message);
  }
});
