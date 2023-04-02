let allQuotes = [];
let Quote = document.getElementById("quote");
let Author = document.getElementById("author");
let Generator = document.getElementById("gen-quote");
let TwitterBtn = document.getElementById("twitter");
let Container = document.getElementById('container');
let Loader = document.getElementById('loader');
let LoaderContainer = document.getElementById('loader-container');

const showLoader = () =>{
  Container.classList.add('hide');
  Loader.classList.add('loader');
  Loader.classList.remove('hide');
  LoaderContainer.classList.add('loader-container');
}
const hideLoader = () =>{
Loader.classList.remove('loader');
Loader.classList.add('hide');
LoaderContainer.classList.remove('loader-container');
Container.classList.remove('hide');
}
const updater = () => {
  let text = allQuotes[Date.now() % allQuotes.length]["text"];
  let author = allQuotes[Date.now() % allQuotes.length]["author"];
  Quote.textContent = text;
  // Long Quotes have to be written with different font size
  if (text.length > 110) {
    Quote.classList.add("long-quotes");
  } else {
    Quote.classList.remove("long-quotes");
  }
  // Check and replace author field if not exists replace with "Unknown" Author
  if (author) {
    Author.textContent = "- " + author;
  } else {
    Author.textContent = "- Unknown";
  }
  hideLoader();
};

const getOfflineQuotes = async () => {
  showLoader();
  const response = fetch("../assets/offlineQuotes.json");
  // Only update 'allQuotes' variable if it is available and then change DOM
  try {
    response.then((res) => {
      allQuotes = res.json();
      allQuotes.then((res) => {
        // Written separately again for easy-debugging -- has to rewrite here [ DRY is not followed ]
        allQuotes = res;
        updater();
      });
    });
  } catch (err) {
    console.log(`Error Local Quotes file cannot be Read ${err}`);
  }
};

const getQuotes = async () => {
  const url = "https://type.fit/api/quotes";
  showLoader();
  try {
    // Response is seen as array of json for this specific API
    const response = await fetch(url);
    allQuotes = response.json();
    allQuotes.then((res) => {
      allQuotes = res;
      updater();
    });
  } catch (err) {
    // Tries to open locally stored quotes generated from API (last updated local quotes in 2023 from the same API)
    console.log(
      `Error connect to server ${err}\nYou are offline\nTrying to open Local Quotes ...\n`
    );
    getOfflineQuotes();
  }
};

// Twitter Btn Function
const TwitterHandler = () => {
  const TwitterUrl = `https://twitter.com/intent/tweet?text=${Quote.textContent} - ${Author.textContent}`;
  open(TwitterUrl, "_blank");
};

// On Load
getQuotes();

// On Button Click Generate update Quotes (Event Bubbling only handled here)
Generator.addEventListener("click", getQuotes);
// Twitter Btn Handler
TwitterBtn.addEventListener("click", TwitterHandler);
