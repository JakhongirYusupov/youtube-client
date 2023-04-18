const videosList = document.querySelector(".videos-list");
const token = JSON.parse(window.localStorage.getItem("token"));
const form = document.querySelector(".site-form");
const title = document.querySelector("#videoInput");
const vidoeInput = document.querySelector("#uploadInput");

if (!token) {
  window.location = "/login.html";
}

async function getVideos() {
  const userVideos = await fetch("http://localhost:5000/own-video", {
    headers: { token },
  });
  const data = await userVideos.json();
  if (data.status === 404) {
    alert(data.message);
    window.location = "/login.html";
  } else if (data.status === 200) {
    renderVideos(data.data);
  } else {
    alert(data.message || data.msg);
  }
}
getVideos();

function renderVideos(videos) {
  videosList.innerHTML = "";
  for (let video of videos) {
    videosList.innerHTML += `
    <li class="video-item">
        <video src="http://localhost:5000/videos/${video.url}" controls=""></video>
        <p class="content" data-id="2" contenteditable="true">${video.title}</p>
        <img src="./img/delete.png" width="25px" alt="upload" class="delete-icon" data-id=${video.id}>
    </li>
    `;
  }
  deleteVideo();
}

function deleteVideo() {
  const delBtns = document.querySelectorAll(".delete-icon");
  for (let i of delBtns) {
    i.addEventListener("click", async (e) => {
      const id = i.getAttribute("data-id");
      const res = await fetch(`http://localhost:5000/video/${id}`, {
        method: "DELETE",
        headers: { token },
      });
      const data = await res.json();
      if (data.status === 404) {
        alert(data.message);
      } else if (data.status === 200) {
        alert(data.message);
        getVideos();
      } else {
        alert(data.message || data.msg);
      }
    });
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = vidoeInput.files[0];
  const formdata = new FormData();

  formdata.append("title", title.value);
  formdata.append("video", file);

  const res = await fetch(`http://localhost:5000/video`, {
    method: "POST",
    headers: {
      token,
    },
    body: formdata,
  });

  const data = await res.json();

  if (data.status === 200) {
    alert(data.message);
    getVideos();
  } else {
    alert(data.message || data.msg);
  }
});
