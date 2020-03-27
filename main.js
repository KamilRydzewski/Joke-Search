const form = document.querySelector(".search-form");
const searchInput = document.querySelector(".search");
const searchButton = document.querySelector(".search-button");
const list = document.querySelector(".results");
const resetBtn = document.querySelector(".reset-btn");
const favouriteBtn = document.querySelector(".favourite-btn");
const quantityBtn = document.querySelectorAll(".qty-btn");
const favouriteInput = document.querySelectorAll(".favourite-input");
const favouriteList = JSON.parse(localStorage.getItem("favourite")) || [];

function handleForm(e) {
  e.preventDefault();
}
form.addEventListener("submit", handleForm);

function findJokes() {
  const limitNumber = checkLimit();
  const endpoint = `https://icanhazdadjoke.com/search?limit=${limitNumber}&term=${searchInput.value}`;

  if (searchInput.value.length >= 1) {
    fetch(endpoint, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(blob => blob.json())
      .then(data => displayJokes(data.results));
  } else {
    resetBook();
  }
}

function displayJokes(jokesList) {
  list.classList.add("active");
  if (jokesList === undefined || jokesList.length == 0) {
    list.innerHTML = `<div class="no-results">No results for "${searchInput.value}"</div>`;
  } else {
    list.innerHTML = jokesList
      .map((object, i) => {
        const checkFavObject = favouriteList.find(item => item.id === object.id);
        return `<li class="joke" id="${object.id}" data-index="${i}">
					${object.joke}
					<input  type="checkbox" id="${i}" ${checkFavObject ? "checked" : ""}/>
					<label class="favourite-input" for="${i}"><i class="${
          checkFavObject ? "icon-star" : "icon-star-empty"
        }"></i></label>
				  </li>`;
      })
      .join("");
  }
}

function resetBook() {
  list.classList.remove("active");
  form.reset();
  list.innerHTML = ``;
  quantityBtn.forEach(button => {
    if (button.classList.contains("active")) {
      button.classList.remove("active");
    }
  });
}

function checkLimit(event) {
  let limitNumber = 30;
  quantityBtn.forEach(button => {
    if (button.classList.contains("active")) {
      limitNumber = button.dataset.value;
    }
  });
  return limitNumber;
}

function setLimit() {
  quantityBtn.forEach(button => {
    if (button.classList.contains("active")) {
      button.classList.remove("active");
    }
  });
  this.classList.add("active");
  if (searchInput.value.length >= 1) {
    findJokes();
  } else {
    resetBook();
  }
}

function toggleFavourite(e) {
  if (!e.target.matches("input")) return;
  const targetElement = document.querySelector(`li[data-index="${e.target.id}"]`);
  if (favouriteList.find(object => object.id === targetElement.id)) {
    //////////// remove object
    const object = favouriteList.find(object => object.id === targetElement.id);
    const index = favouriteList.indexOf(object);
    favouriteList.splice(index, 1);
  } else {
    /////////// add object
    const favouriteJoke = {
      joke: targetElement.textContent,
      id: targetElement.id,
      done: true
    };
    favouriteList.push(favouriteJoke);
  }
  localStorage.setItem("favourite", JSON.stringify(favouriteList));
}

function displayFavourite() {
  if (favouriteBtn.classList.contains("active")) {
    favouriteBtn.classList.remove("active");
    findJokes();
  } else {
    favouriteBtn.classList.add("active");
    if (favouriteList === undefined || favouriteList.length == 0) {
      list.classList.add("active");
      list.innerHTML = `<div class="no-results">
      You don't have any favorite jokes yet.
      If you want to add a joke to the list of your favorite jokes, select the star next to the chosen joke.
      </div>`;
    } else {
      displayJokes(favouriteList);
    }
  }
}

function toggleStar(e) {
  if (!e.target.matches("i")) return;
  if (e.target.classList.contains("icon-star")) {
    e.target.classList.remove("icon-star");
    e.target.classList.add("icon-star-empty");
  } else {
    e.target.classList.remove("icon-star-empty");
    e.target.classList.add("icon-star");
  }
}

searchInput.addEventListener("submit", findJokes);

// -----LIVE FILTERING----- Is working but I need to change the display way for example
// as a suggestion not results because there is a conflict with search button and submit form - make them useless.
// searchInput.addEventListener("keyup", findJokes);

searchButton.addEventListener("click", findJokes);
searchInput.addEventListener("submit", () => favouriteBtn.classList.remove("active"));
searchInput.addEventListener("keyup", () => favouriteBtn.classList.remove("active"));
resetBtn.addEventListener("click", resetBook);
quantityBtn.forEach(button => button.addEventListener("click", setLimit));
list.addEventListener("click", toggleFavourite);
list.addEventListener("click", toggleStar);
favouriteBtn.addEventListener("click", displayFavourite);
