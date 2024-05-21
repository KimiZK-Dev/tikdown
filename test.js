// fetch(
//   "https://www.tikwm.com/api/?url=https://www.tiktok.com/@shinwibu208/photo/735433289311351937"
// )
//   .then((res) => res.json())
//   .then((data) => {
//     var t = data;
//     console.log(t);
//     if (t.code == 0) {
//       console.log("ok");
//     } else {
//       console.log("error");
//     }
//   });

var link = "";
fetch(link)
  .then((res) => res.blob())
  .then((blob) => {
    const file = new File([blob], "image", { type: blob.type });
    const url = URL.createObjectURL(file);
    console.log(url);
  });
