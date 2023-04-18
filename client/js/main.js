const userList = document.querySelector(".navbar-list");
const videoList = document.querySelector("#videos-list");
const search = document.querySelector(".search-box");
const searchInput = document.querySelector(".search-input");
const profileimg = document.querySelector(".admin-profile-img");
const datalist = document.querySelector("#datalist");
const mic = document.querySelector(".speechMic");

window.SpeechRecognition =
  window.SPeechRecognition || window.webkitSpeechRecognition;

const speach = new SpeechRecognition();
speach.interimResults = true;

const token = JSON.parse(window.localStorage.getItem("token"));

mic.addEventListener("click", (e) => {
  speach.start();
  let text = null;
  speach.addEventListener("result", (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript);
    text = transcript;
  });
  speach.addEventListener("end", async (e) => {
    console.log(text[0]);
    searchInput.value = text[0];

    const searchData = await fetch(
      `http://localhost:5000/video?search=${text[0]}`,
      {
        headers: {
          token,
        },
      }
    );
    const data = await searchData.json();
    if ((data.status = 200)) {
      renderVideos(data.data);
    } else {
      alert(data.message);
    }
  });
});

if (!token) {
  window.location = "/login.html";
}

(async function () {
  const users = await fetch("http://localhost:5000/user", {
    headers: {
      "Content-type": "Application/json",
      token,
    },
  });
  const data = await users.json();
  if (data.status !== 200) {
    alert(data.message);
    window.location = "/login.html";
  } else {
    renderUsers(data.data);
  }
  const videos = await fetch("http://localhost:5000/video", {
    headers: {
      "Content-type": "Application/json",
      token,
    },
  });

  const videosData = await videos.json();
  if (videosData.status === 200) {
    renderVideos(videosData.data);
  } else {
    alert(videosData.message);
  }

  const user = await fetch(`http://localhost:5000/user?ownuser=true`, {
    headers: { token },
  });
  const userData = await user.json();
  if (userData.status === 200) {
    if (userData.data[0].profile_img) {
      profileimg.innerHTML = `
      <img class="avatar-img" src="http://localhost:5000/images/${userData.data[0].profile_img}" alt="avatar-img" width="32px" height="32px">
      `;
    } else {
      profileimg.innerHTML = `<img class="avatar-img" src="./img/avatar.jpg" alt="avatar-img" width="32px" height="32px">`;
    }
  }
})();

function renderUsers(users) {
  userList.innerHTML = "";
  userList.innerHTML = `
  <h1>YouTube Members</h1>
          <li class="channel active" data_id="main">
            <a href="#">
              <svg viewbox="0 0 24 24" focusable="false"
                style="pointer-events: none; display: block; width: 30px; height: 30px;">
                <g>
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8" class="style-scope yt-icon"></path>
                </g>
              </svg>
              <span>Home</span>
            </a>
          </li>
  `;
  users.map((el) => {
    const li = document.createElement("li");
    li.className = "channel member";
    li.innerHTML = `
    <li class="channel member">
            <a href="#">
              <img src="http://localhost:5000/images/${el.profile_img}" alt="channel-icon" width="30px"
                height="30px">
              <span>${el.username}</span>
            </a>
          </li>
    `;
    li.addEventListener("click", () => listenUser(el.id));
    userList.appendChild(li);
  });
}

function renderVideos(videos) {
  videoList.innerHTML = "";
  datalist.innerHTML = "";
  for (let el of videos) {
    videoList.innerHTML += `
    <li class="iframe">
            <video src="http://localhost:5000/videos/${
              el.url
            }" controls="true"></video>
            <div class="iframe-footer">
              <img src="https://cdn-icons-png.flaticon.com/512/146/146031.png" alt="channel-icon">
              <div class="iframe-footer-text">
                <h2 class="channel-name">${el.username}</h2>
                <h3 class="iframe-title">${el.title}</h3>
                <time class="uploaded-time">${el.create_at.split("T")[0]} | ${
      el.create_at.split("T")[1].split(".")[0]
    }</time>
                <a class="download" href="http://localhost:5000/videos/${
                  el.url
                }" download="true" >
                  <span>${(el.size / 1000).toFixed(1)} MB</span>
                  <img src="./img/download.png">
                </a>
              </div>
            </div>
          </li>
    `;

    datalist.innerHTML += `
    <option value="${el.title}">
    `;
  }
}

async function listenUser(userId) {
  const userVideos = await fetch(
    `http://localhost:5000/video?user_id=${userId}`,
    {
      method: "GET",
      headers: {
        token,
      },
    }
  );

  const data = await userVideos.json();
  if (data.status === 200) {
    renderVideos(data.data);
  } else {
    alert(data.message);
  }
}

search.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchData = await fetch(
    `http://localhost:5000/video?search=${searchInput.value}`,
    {
      headers: {
        token,
      },
    }
  );
  const data = await searchData.json();
  if ((data.status = 200)) {
    renderVideos(data.data);
  } else {
    alert(data.message);
  }
});
