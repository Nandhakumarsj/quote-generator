let allQuotes = [];
let Quote = document.getElementById("quote");
let Author = document.getElementById("author");
let Generator = document.getElementById("gen-quote");

const updater = () => {
  Quote.innerHTML = allQuotes[Date.now() % allQuotes.length]["text"];
  if (allQuotes[Date.now() % allQuotes.length]["author"]) {
    Author.innerHTML =
      "- " + allQuotes[Date.now() % allQuotes.length]["author"];
  } else {
    Author.innerHTML = "";
  }
};

const getOfflineQuotes = async () => {
  const response = fetch("offlineQuotes.json");
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

// On Load
getQuotes();

// On Button Click Generate update Quotes (Event Bubbling only handled here)
Generator.addEventListener("click", getQuotes);
