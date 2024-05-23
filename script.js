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
const preview = document.querySelector(".preview");
const pic = document.querySelector(".pic");
const pics = document.querySelector(".pics");
const imgPreview = document.querySelector(".preview img");
const downVid = document.querySelector(".downVid");
const downAudio = document.querySelector(".downAudio");

function getData(api, url) {
  axios.get(`${api}${url}`).then((res) => {
    const data = res.data.data;

    if (res.data.code == 0) {
      console.log(data);
      const durationInMinutes = Math.floor(data.duration / 60);
      const remainingSeconds = data.duration % 60;
      const formattedDuration = `${durationInMinutes} phút ${remainingSeconds} giây`;

      size.innerHTML =
        "Dung lượng: " +
        (data.size
          ? (data.size / 1000000).toFixed(3) + "MB"
          : "Mỗi ảnh kích thước khác nhau!");

      ID.innerHTML = "UserID: " + data.author.unique_id;
      nickname.innerHTML = "Tên tài khoản: " + data.author.nickname;
      title.innerHTML = "Tiêu đề bài viết: " + data.title;
      comment_count.innerHTML = "Số bình luận: " + data.comment_count;
      digg_count.innerHTML = "Số tim: " + data.digg_count;
      download_count.innerHTML = "Số lượt tải xuống: " + data.download_count;
      duration.innerHTML = "Thời gian bài viết: " + formattedDuration;
      play.innerHTML = "Số lượt xem: " + data.play_count;
      imgPreview.src = data.ai_dynamic_cover;
      test(downVid, data.play);
      test(downAudio, data.music);

      if (data.images) {
        if (preview) {
          preview.remove();
        } else {
          console.log("ok");
          pic.remove();
        }
        const picsElement = document.querySelector(".pics");
        for (let i = 0; i < data.images.length; i++) {
          const picsCLass = document.createElement("div");
          picsCLass.classList.add("pic");
          const pic = document.createElement("img");
          pic.src = data.images[i];
          pic.alt = `Preview ${i}`;
          picsCLass.appendChild(pic);
          picsElement.appendChild(picsCLass);
        }
      } else {
        pic.remove();
        document.getElementById("t").innerHTML = "LINK NAY DELL CO ANH";
      }
    } else {
      console.log(res.data.code);
      alert(
        "Vui lòng nhập link cần lấy dữ liệu!!\nNếu không được bạn vui lòng kiểm tra lại link <3"
      );
    }
  });
}

function test(element, data) {
  fetch(data)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], "image", { type: blob.type });
      const url = URL.createObjectURL(file);
      element.href = url;
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
