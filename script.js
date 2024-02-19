const apikey = "gXx0RxmTxZTYOiCxun7hVWFk3ttLngxx8s9AwTcDwKuyON5rR5b1JKyn";

const imgcontainer = document.querySelector(".images");
const loadmore = document.querySelector(".load-more");
const searchinput = document.querySelector(".searchinput");
const lightbox = document.querySelector(".lightbox");
const lightboxclosebtn = lightbox.querySelector(".uil-times");
const lightboxdownloadbtn = lightbox.querySelector(".uil-import");

const perpage = 15;
let currentpage = 1;
let searchtext = null;

const downloadimg = (imgurl,id)=>{
    // console.log(imgurl)
    fetch(imgurl).then(res => res.blob()).then(file=>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download =id;
        a.click();
        console.log(a)
        console.log(file)
    }).catch(()=>alert("failed to download image!"))
}
lightboxdownloadbtn.addEventListener("click",(e)=>{
    downloadimg(e.target.dataset.img,e.target.dataset.id)
})

const showlightbox = (photographer,imageurl,id)=>{
    lightbox.querySelector('img').src = imageurl;
    lightbox.querySelector(".author").innerText = photographer;
    lightboxdownloadbtn.setAttribute("data-img",imageurl);
    lightboxdownloadbtn.setAttribute("data-id",id);
    lightbox.classList.add("show")
}

const generateHtml = (images) => {
  console.log(images);
  imgcontainer.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick = "showlightbox('${img.photographer}','${img.src.large2x}','${img.id}')">
         <img src=${img.src.large2x} alt="" />
         <div class="details">
           <div class="photographer">
             <i class="uil uil-camera"></i>
             <span>${img.photographer}</span>
           </div>
           <button onclick = "downloadimg('${img.src.large2x}',${img.id})"><i class="uil uil-import"></i></button>
         </div>
       </li>`
    )
    .join("");
};
const getImages = (apiurl) => {
  loadmore.innerText = "Loading...";
  loadmore.classList.add("disabled");
  fetch(apiurl, {
    headers: { Authorization: apikey },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      generateHtml(data.photos);
      loadmore.innerText = "Load More";
      loadmore.classList.remove("disabled");
    }).catch(()=>alert("failed to load images!"))
};

getImages(
  `https://api.pexels.com/v1/curated??page=${currentpage}per_page=${perpage}`
);

loadmore.addEventListener("click", () => {
  currentpage++;
  let apiurl = `https://api.pexels.com/v1/curated??page=${currentpage}per_page=${perpage}`;
  apiurl = searchtext
    ? `https://api.pexels.com/v1/search?query=${searchtext}&page=${currentpage}per_page=${perpage}`
    : `https://api.pexels.com/v1/curated??page=${currentpage}per_page=${perpage}`;
  getImages(apiurl);
});

searchinput.addEventListener("keyup", (e) => {
  //   if (e.key === "Enter") {
  currentpage = 1;
  searchtext = e.target.value;
  if (searchtext === "") {
    getImages(
      `https://api.pexels.com/v1/curated??page=${currentpage}per_page=${perpage}`
    );
  } else {
    imgcontainer.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchtext}&page=${currentpage}per_page=${perpage}`
    );
  }
  //   }
});

lightboxclosebtn.addEventListener("click",()=>{
    lightbox.classList.remove("show")
})



// come back title
let doctitle = document.title;
window.addEventListener("blur",()=>{
    document.title = "come back explore more !";
})
window.addEventListener("focus",()=>{
    document.title = doctitle;
})