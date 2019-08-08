function checkStatus(response) {
  if (Math.floor(response.status / 100 === 2)) return Promise.resolve(response);
  else return Promise.reject(`Error. Status code: ${response.status}`);
}

const json = response => response.json();


//Custom HTTP Module
function myHttp() {
  return {
    get(url) {
      fetch(url)
        .then(checkStatus)
        .then(json)
        .catch(err => console.log(err));
      },
    post(url, body, headers) {
      fetch(url, {
        method: 'POST',
        body,
        headers
      })
      .then(checkStatus)
      .then(json)
      .catch(err => console.log(err));
    }
  };
}


const http = myHttp();
const newsServise = (function() {
  const apiKey = "2c0f1ee00f8f46f5916226f221bf3858";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ua", category = "technology") {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`);
    },
    everything(text) {
      http.get(`${apiUrl}/everything?q=${text}&apiKey=${apiKey}`);
    }
  };
})();

//Elements
const newsContainer = document.querySelector(".news-container .row");
const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const categorySelect = form.elements["category"];
const searchEverythingNews = form.elements["autocomplete-input"];

document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  loadNews();
});


const getNews = new Promise ((resolve, reject) => {
  loadNews()
});

function loadNews() {
  const countrySelectValue = countrySelect.value;
  const categorySelectValue = categorySelect.value;
  const searchEverythingNewsValue = searchEverythingNews.value;

  if (!searchEverythingNewsValue) {
    newsServise.topHeadlines(
      countrySelectValue,
      categorySelectValue);
  } else newsServise.everything(searchEverythingNewsValue);
}

function onGetResponse(err, res) {
  if (err) {
    alert(err);
    return;
  }

  if (!res.articles.length) {
    alert("Новостей не найдено");
    return;
  }

  renderNews(res.articles);
}

function renderNews(newsItems) {
  let fragment = "";

  newsItems.forEach(item => {
    const el = newsTemplate(item);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function newsTemplate({ url, title, description, urlToImage } = {}) {
  return `
  <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}">
          <span class="card-title">${title || ""}</span>
        </div>
        <div class="card-content">
          <p>${description || ""}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div>
  `;
}

form.addEventListener("submit", onSubmitHandler);

function onSubmitHandler(e) {
  e.preventDefault();
  while (newsContainer.firstChild) {
    newsContainer.removeChild(newsContainer.firstChild);
  }

  loadNews();
}