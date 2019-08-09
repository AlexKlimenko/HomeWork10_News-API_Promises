//Elements
const newsContainer = document.querySelector(".news-container .row");
const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const categorySelect = form.elements["category"];
const searchEverythingNews = form.elements["autocomplete-input"];


//Custom HTTP Module

function myHttp() {
  return {
    request(url, options) {
      return Promise.resolve().then(() => {
        return fetch(url, options).then(response => {
          if (response.status / 100 !== 2) {
            return Promise.reject(response);
          }
        return response.json();
        });
      });
    },
  };
}


// Init http module
const http = myHttp();

function loadNews() {
  const country = countrySelect.value;
  const category = categorySelect.value;
  const search = searchEverythingNews.value;
  const apiKey = "2c0f1ee00f8f46f5916226f221bf3858";
  const apiUrl = "https://newsapi.org/v2";

  if (!search) {
    http.request(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`)
      .then(res => onGetResponse(res))
      .catch(err => alert(err));
  } else {
    http.request(`${apiUrl}/everything?q=${search}&apiKey=${apiKey}`)
      .then(res => onGetResponse(res))
      .catch(err => alert(err));
  }
}

function onGetResponse(res) {
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



//events
document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  loadNews();
});

form.addEventListener("submit", onSubmitHandler);

function onSubmitHandler(e) {
  e.preventDefault();
  while (newsContainer.firstChild) {
    newsContainer.removeChild(newsContainer.firstChild);
  }

  loadNews();
}



