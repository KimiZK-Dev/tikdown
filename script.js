// const ePreVid = document.createElement("div");
const title = document.querySelector(".pagePreview .title");
// ePreVid.className = "preVid";
// ePreVid.innerHTML =
//   '<img src="https://i.ibb.co/8dGJs8h/image.png" alt="Pic-Preview">';
// title.insertAdjacentElement("afterend", ePreVid);

const apiLink = "https://www.tikwm.com/api/?url=";
const e = {
  des: document.querySelector(".des"),
  info: document.querySelector(".info"),
  container: document.querySelector("#s2 .container"),

  ID: document.querySelector(".authorID"),
  nickname: document.querySelector(".authorName"),
  title: document.querySelector(".title"),
  comment_count: document.querySelector(".comment_count"),
  digg_count: document.querySelector(".digg_count"),
  download_count: document.querySelector(".download_count"),
  duration: document.querySelector(".duration"),
  play: document.querySelector(".play_count"),
  size: document.querySelector(".size"),

  pagePre: document.querySelector(".pagePreview"),
  preview: document.querySelector(".preVid"),
  preVid: document.querySelector(".preVid img"),
  prePics: document.querySelector(".prePics"),
  pic: document.querySelectorAll(".pic"),
  pageDown: document.querySelector(".pageDown"),
  downPics: document.querySelector(".downPics"),
  downVid: document.querySelector(".downVid"),
  downAudio: document.querySelector(".downAudio"),
};

async function fetchData(api, url) {
  try {
    const res = await axios.get(`${api}${url}`);
    if (res.data.code === 0) {
      e.des.remove();
      return res.data.data;
    } else {
      console.error(`Error code: ${res.data.code}`);
      alert(
        "Vui lòng nhập link cần lấy dữ liệu!!\nNếu không được bạn vui lòng kiểm tra lại link <3"
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Có lỗi xảy ra khi lấy dữ liệu!");
    return null;
  }
}

function formatDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes} phút ${seconds} giây`;
}

async function getData(api, url) {
  const data = await fetchData(api, url);
  console.log(data);
  if (!data) return;

  const fields = [
    {
      icon: "fa-duotone fa-id-badge",
      className: "authorID",
      text: `UserID: ${data.author.unique_id}`,
    },
    {
      icon: "fa-duotone fa-user",
      className: "authorName",
      text: `Tên tài khoản: ${data.author.nickname}`,
    },
    {
      icon: "fa-duotone fa-subtitles",
      className: "title",
      text: `Tiêu đề bài viết: ${data.title}`,
    },
    {
      icon: "fa-duotone fa-comments",
      className: "comment_count",
      text: `Số bình luận: ${data.comment_count}`,
    },
    {
      icon: "fa-duotone fa-circle-heart",
      className: "digg_count",
      text: `Số tim: ${data.digg_count}`,
    },
    {
      icon: "fa-duotone fa-circle-down",
      className: "download_count",
      text: `Số lượt tải xuống: ${data.download_count}`,
    },
    {
      icon: "fa-duotone fa-timer",
      className: "duration",
      text: `Thời gian bài viết: ${formatDuration(data.duration)}`,
    },
    {
      icon: "fa-duotone fa-circle-play",
      className: "play_count",
      text: `Số lượt xem: ${data.play_count}`,
    },
    {
      icon: "fa-duotone fa-file",
      className: "size",
      text: `Dung lượng: ${
        data.size
          ? (data.size / 1000000).toFixed(3) + "MB"
          : "Mỗi ảnh kích thước khác nhau!"
      }`,
    },
  ];

  if (!e.info) {
    const infoDiv = document.createElement("div");
    infoDiv.className = "info";

    fields.forEach((field) => {
      const div = document.createElement("div");
      const icon = document.createElement("i");
      const span = document.createElement("span");

      div.className = "infoThis";
      icon.className = field.icon;
      span.className = field.className;
      span.innerHTML = field.text;

      div.appendChild(icon);
      div.appendChild(span);
      infoDiv.appendChild(div);
    });

    e.container.appendChild(infoDiv);
    e.info = true;
  } else {
    fields.forEach((field) => {
      document.querySelector("." + field.className).innerHTML = field.text;
    });
  }

  if (data.images) {
    async function processImages() {
      if (e.pic || e.pageDown || e.pagePre) {
        if (e.pic) {
          e.prePics
            .querySelectorAll(".pic")
            .forEach((picElement) => picElement.remove());
        }

        if (e.pageDown) {
          e.pageDown
            .querySelectorAll(".downPics")
            .forEach((downElement) => downElement.remove());
        }

        if (e.pagePre) {
          const pre = e.pagePre.querySelectorAll(".preVid");
          const downBtn = e.pagePre.querySelectorAll(".downVid");
          pre.forEach((el) => el.remove());
          downBtn.forEach((el) => el.remove());
        }
      }

      getDataForVid(e.downAudio, data.music);
      const zip = new JSZip();
      const folder = zip.folder("images");

      data.images.forEach(async (imageUrl, i) => {
        const imageDiv = document.createElement("div");
        const img = document.createElement("img");
        const downLink = document.createElement("a");

        imageDiv.className = "pic";
        img.src = imageUrl;

        const { url, file } = await getDataForPic(imageUrl);

        if (url && file) {
          downLink.href = url;
          downLink.download = `Ảnh ${i + 1}`;
          downLink.className = "downPic";
          downLink.textContent = "Tải về";

          folder.file(`image${i + 1}.${file.type.split("/")[1]}`, file);

          imageDiv.appendChild(img);
          imageDiv.appendChild(downLink);
          e.prePics.appendChild(imageDiv);
        } else {
          console.error("Failed to create download URL for image", imageUrl);
        }
      });

      const zipButton = document.createElement("a");
      const icon = document.createElement("i");

      zipButton.className = "downPics";
      icon.className = "fa-duotone fa-download";

      zipButton.appendChild(icon);
      zipButton.appendChild(document.createTextNode("ALBUM"));

      zipButton.addEventListener("click", async () => {
        const content = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(content);
        const downLink = document.createElement("a");
        downLink.href = zipUrl;
        downLink.download = "images.zip";
        downLink.click();
        URL.revokeObjectURL(zipUrl);
      });

      e.pageDown.insertBefore(zipButton, e.pageDown.firstChild);
    }
    processImages();
  } else {
    if (e.pic || e.pageDown) {
      if (e.pic) {
        e.prePics
          .querySelectorAll(".pic")
          .forEach((picElement) => picElement.remove());
      }

      if (e.pageDown) {
        e.pageDown
          .querySelectorAll(".downPics")
          .forEach((downElement) => downElement.remove());
      } else {
        console.log("no");
      }
    }

    if (e.pagePre) {
      const pre = e.pagePre.querySelectorAll(".preVid");
      const downBtn = e.pagePre.querySelectorAll(".downVid");
      pre.forEach((el) => el.remove());
      downBtn.forEach((el) => el.remove());
    }

    const createPre = document.createElement("div");
    const createDownVid = document.createElement("a");
    const icon = document.createElement("i");
    const preVid = document.createElement("img");

    createPre.className = "preVid";
    preVid.src = data.ai_dynamic_cover;
    preVid.alt = "";
    e.preVid.src = data.ai_dynamic_cover;

    icon.className = "fa-duotone fa-download";
    createDownVid.appendChild(icon);
    createDownVid.appendChild(document.createTextNode("VIDEO"));
    createDownVid.className = "downVid";
    createDownVid.download = "Tiktok Download by KimiZK";
    createDownVid.href = "";

    e.pagePre.appendChild(createPre);
    createPre.appendChild(preVid);
    title.insertAdjacentElement("afterend", createPre);
    e.pageDown.insertBefore(createDownVid, e.pageDown.firstChild);

    getDataForVid(createDownVid, data.play);
    getDataForVid(e.downAudio, data.music);
  }
}

function getDataForVid(element, data) {
  fetch(data)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], "image", { type: blob.type });
      const url = URL.createObjectURL(file);
      element.href = url;
    });
}

async function getDataForPic(data) {
  try {
    const res = await fetch(data);
    const blob = await res.blob();
    const file = new File([blob], "image", { type: blob.type });
    const url = URL.createObjectURL(file);
    return { url, file };
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
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
