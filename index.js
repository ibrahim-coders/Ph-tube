//1 -fetch load and show catagores on html

//create LoadCategories

function getTimeString(time) {
  const day = parseInt(time / 86400);
  let remainingTime = time % 86400;

  const hour = parseInt(remainingTime / 3600);
  remainingTime = remainingTime % 3600;

  const minute = parseInt(remainingTime / 60);
  const second = remainingTime % 60;

  return `${day} day ${hour} hour ${minute} minute ${second} second ago`;
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName('category-btn');

  for (const btn of buttons) {
    btn.classList.remove('active');
  }
};
const loadCategories = () => {
  fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayCaregories(data.categories))
    .catch(error => console.log(error));
};

// video section

const loadVideos = (searchText = '') => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?titel= ${searchText}`
  )
    .then(res => res.json())
    .then(data => displayVideoes(data.videos))
    .catch(error => console.log(error));
};

const loadCatgoryVideos = id => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(data => {
      removeActiveClass();
      const activeBtn = document.getElementById(`btn${id}`);
      activeBtn.classList.add('active');
      displayVideoes(data.category);
    })
    .catch(error => console.log(error));
};

const loadDetails = async videoId => {
  console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(url);
  const data = await res.json();
  displayDetals(data.video);
};

const displayDetals = video => {
  console.log(video);
  const detalsConteniar = document.getElementById('modal-content');
  detalsConteniar.innerHTML = `
<img src="${video.thumbnail}" alt="">
<p class="p-2">${video.description}</p>
  `;
  document.getElementById('showModal').click();
};
const displayVideoes = videos => {
  const contenirVideo = document.getElementById('video');
  contenirVideo.innerHTML = '';

  if (videos.length == 0) {
    contenirVideo.classList.remove('grid');
    contenirVideo.innerHTML = `
    <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
    
      <img src="image/icon.png" /> 
      <h2 class="text-center text-xl font-bold"> No Content Here in this Categery </h2> 
    </div>`;
  } else {
    contenirVideo.classList.add('grid');
  }

  videos.forEach(video => {
    console.log(video);
    const cart = document.createElement('div');
    cart.classList.add('card', 'card-compact');
    cart.innerHTML = `
    <figure class="h-[200px] relative">
    <img  class=" w-full h-full  object-cover  "
      src="${video.thumbnail}
      alt="Shoes" />

      ${
        video.others.posted_date?.length == 0
          ? ''
          : `
       <span class="absolute text-sm right-2 bottom-2 text-white bg-gray-950 rounded p-1">${getTimeString(
         video.others.posted_date
       )}</span>
      `
      }
     
  </figure>
  <div class="px-0 py-2 flex gap-4">

   <div>
   <img class="w-8 h-8 rounded-full object-cover" src="${
     video.authors[0].profile_picture
   }" alt="">
   </div>
   <div>
   <h2 class="font-bold"> ${video.title}</h2>
<div class="flex gap-2 ">
<p class="text-geay-600">${video.authors[0].profile_name}</p>

${
  video.authors[0].verified === true
    ? `<img
      class="w-5 h-5"
      src="https://cdn-icons-png.flaticon.com/512/6364/6364343.png"
      alt="Verified Badge"
    />`
    : ''
}
</div>
  <button onclick="loadDetails('${
    video.video_id
  }')" class="btn bg-red-600 text-white">Detalls</button>
   </div>
  </div>
    `;
    contenirVideo.append(cart);
  });
};

const displayCaregories = categories => {
  const categoryContainer = document.getElementById('categories');

  categories.forEach(item => {
    const divButton = document.createElement('div');

    divButton.innerHTML = `
  <button id="btn${item.category_id}" onclick="loadCatgoryVideos(${item.category_id})" class="btn category-btn ">
  ${item.category}
  </button>
    `;
    categoryContainer.append(divButton);
  });
};
document.getElementById('search-input').addEventListener('keyup', e => {
  loadVideos(e.target.value);
});

loadCategories();
loadVideos();
