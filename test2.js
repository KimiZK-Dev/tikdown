// const link =
//   "https://www.tiktok.com/@huymecosplay.03/video/7364636879498628360";
// const link2 = "https://www.tiktok.com/@hp.12th5/photo/7358837722028510471";
const apiLink = "https://www.tikwm.com/api/?url=";
const size = document.querySelector(".size");
const ID = document.querySelector(".authorID");
const nickname = document.querySelector(".authorName");
const title = document.querySelector(".title");
const comment_count = document.querySelector(".comment_count");
const digg_count = document.querySelector(".digg_count");
const download_count = document.querySelector(".download_count");
const play = document.querySelector(".play_count");
const duration = document.querySelector(".duration");
const video = document.querySelector(".video");
const music = document.querySelector(".music");

function getData(api, url) {
  axios.get(`${api}${url}`).then((res) => {
    const data = res.data.data;
    const durationInMinutes = Math.floor(data.duration / 60);
    const remainingSeconds = data.duration % 60;
    const formattedDuration = `${durationInMinutes} phút ${remainingSeconds} giây`;

    size.innerHTML = "Dung lượng: " + (data.size / 1000000).toFixed(3) + "MB";
    ID.innerHTML = "UserID: " + data.author.unique_id;
    nickname.innerHTML = "Tên tài khoản: " + data.author.nickname;
    title.innerHTML = "Tiêu đề bài viết: " + data.title;
    comment_count.innerHTML = "Số bình luận: " + data.comment_count;
    digg_count.innerHTML = "Số tim: " + data.digg_count;
    download_count.innerHTML = "Số lượt tải xuống: " + data.download_count;
    duration.innerHTML = "Thời gian bài viết: " + formattedDuration;
    play.innerHTML = "Số lượt xem: " + data.play_count;
    video.href = data.play;
    createTag(music, data.music);
    createTag(video, data.play);
    console.log(data);
  });
}

function createTag(element, data) {
  const link = document.createElement("a");
  link.textContent = "Nhấp vào đây!";
  link.href = data;
  link.target = "_blank";
  element.appendChild(link);
}

const submitButton = document.querySelector(".enter-btn");
const submitButton2 = document.querySelector(".input-btn");
function search() {
  const input = document.querySelector(".input-btn").value;
  getData(apiLink, input);
  document.querySelector(".input-btn").value = "";
}

submitButton.addEventListener("click", search);
submitButton2.addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    search();
  }
});

const pasteBtn = document.querySelector(".paste-btn");
const clearBtn = document.querySelector(".clear-btn");
pasteBtn.addEventListener("click", async () => {
  const paste = await navigator.clipboard.readText();
  document.querySelector(".input-btn").value = paste;
  console.log(paste);
});
clearBtn.addEventListener("click", async () => {
  document.querySelector(".input-btn").value = " ";
});
