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

    if (res.data.code == 0) {
      console.log(data);
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

      const srcMusic = document.querySelector(".music .previewURL");
      const srcVideo = document.querySelector(".video .previewURL");
      const downVideo = document.querySelector(".video .downURL");
      const downMusic = document.querySelector(".music .downURL");
      if (data.images) {
        for (let i = 0; i < data.images.length; i++) {
          const anchor = document.createElement("a");
          anchor.href = data.images[i];
          anchor.target = "_blank";
          anchor.textContent = `Ảnh ${i + 1}`;

          document.getElementById("t").appendChild(anchor);

          console.log(data.images[i]);
          video.innerHTML = "LINK NAY DELL CO VIDEO";
        }
      } else {
        document.getElementById("t").innerHTML = "LINK NAY DELL CO ANH";
      }

      if (!srcVideo) {
        createTag(music, data.music);
        createDownloadTag(video, data.play);
        createTag(video, data.play);
        createDownloadTag(music, data.music);
      } else {
        srcVideo.remove();
        downVideo.remove();
        srcMusic.remove();
        downMusic.remove();
        createTag(music, data.music);
        createDownloadTag(video, data.play);
        createTag(video, data.play);
        createDownloadTag(music, data.music);
      }
    } else {
      console.log(res.data.code);
      alert(
        "Vui lòng nhập link cần lấy dữ liệu!!\nNếu không được bạn vui lòng kiểm tra lại link <3"
      );
    }
  });
}

function createTag(element, data) {
  const createTag = document.createElement("a");
  createTag.textContent = "Nhấp vào đây để xem trước!";
  createTag.href = data;
  createTag.className = "previewURL";
  createTag.target = "_blank";
  element.appendChild(createTag);
}
function createDownloadTag(element, data) {
  fetch(data)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], "image", { type: blob.type });
      const url = URL.createObjectURL(file);
      console.log(url);
      const createTag = document.createElement("a");
      createTag.textContent = "Nhấp vào đây để tải!";
      createTag.className = "downURL";
      createTag.href = url;
      createTag.download = "Tiktok Download by KimiZK";
      element.appendChild(createTag);
    });
}

function clearSearch() {
  document.querySelector(".input-btn").value = "";
}

const submitButton = document.querySelector(".enter-btn");
const submitButton2 = document.querySelector(".input-btn");
function search() {
  const input = document.querySelector(".input-btn").value;
  getData(apiLink, input);
  clearSearch();
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
