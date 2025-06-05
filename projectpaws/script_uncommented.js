let quotes = [];

async function loadDataFromJson() {
  let quotesTwo = await fetch("./quote-data.json");
  let toReturn = await quotesTwo.json();
  return toReturn;
}

const TILT_LEVEL = () => (0.5 - Math.random()) * 8;
const SHUFFLE_DELAY = 0.04;

let currentQuoteIndex = 0;
let isCardFlipped = false;

let offsetX = null;
let offsetY = null;

function getTodaysQuote() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
}

function updateCardColors(catEmoji) {
  const colorSchemes = {
    "🐱": { primary: "#FF6B6B", secondary: "#FF4757", accent: "#FF3838" },
    "😺": { primary: "#4ECDC4", secondary: "#45B7AF", accent: "#3CA29C" },
    "🙀": { primary: "#FFA726", secondary: "#FF9800", accent: "#F57C00" },
    "😸": { primary: "#AB47BC", secondary: "#9C27B0", accent: "#7B1FA2" },
    "😿": { primary: "#5C6BC0", secondary: "#3F51B5", accent: "#303F9F" },
    "🐈": { primary: "#66BB6A", secondary: "#4CAF50", accent: "#388E3C" },
    "😻": { primary: "#EF5350", secondary: "#F44336", accent: "#D32F2F" },
  };

  const scheme = colorSchemes[catEmoji] || colorSchemes["🐱"];
  const cardFront = document.querySelector(".card-front");
  if (cardFront) {
    cardFront.style.background = `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 50%, ${scheme.accent} 100%)`;
  }
}

function initializeTodaysCard() {
  const quoteData = getTodaysQuote();
  currentQuoteIndex = quotes.indexOf(quoteData);

  const cardFront = document.querySelector(".card-front");
  if (cardFront) {
    cardFront.innerHTML = `
        <div style="padding: 1rem; color: white; text-align: center;">
          <p style="font-size: 3rem; margin: 0;">${quoteData.catEmoji}</p>
          <p style="font-size: 1.1rem;">"${quoteData.text}"</p>
          <p style="margin-top: 0.5rem;">— ${quoteData.author}</p>
        </div>
      `;
  }

  updateCardColors(quoteData.catEmoji);
}

function shuffleDeck() {
  tiltShuffleCards(
    document.querySelectorAll(".card-empty .card-face"),
    TILT_LEVEL(),
    false
  );
  // console.log("Cards shuffled");
  if (!isCardFlipped) {
    // currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    currentQuoteIndex = Math.min(
      Math.floor(Math.random() * quotes.length),
      quotes.length - 1
    );
    const quoteData = quotes[currentQuoteIndex];

    const cardFront = document.querySelector(".card-front");
    if (cardFront) {
      cardFront.innerHTML = `
          <div style="padding: 1rem; color: white; text-align: center;">
            <p style="font-size: 3rem; margin: 0;">${quoteData.catEmoji}</p>
            <p style="font-size: 1.1rem;">"${quoteData.text}"</p>
            <p style="margin-top: 0.5rem;">— ${quoteData.author}</p>
          </div>
        `;
    }

    updateCardColors(quoteData.catEmoji);

    setTimeout(() => {
      tiltShuffleCards(
        document.querySelectorAll(".card-empty .card-face"),
        TILT_LEVEL(),
        true
      );
    }, SHUFFLE_DELAY * 10000);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  quotes = await loadDataFromJson();
  initializeTodaysCard();
  flipCard();

  document
    .querySelector(".num-indicator")
    .appendChild(document.createTextNode(quotes.length));

  const todayCardFront = document.querySelector(".card-flip .card-front");
  const todayCardBack = document.querySelector(".card-flip .card-back");
  const firstCard = document.querySelector(".card-empty .card-back");
  const timeshow = document.querySelector(".current-time");
  // Optional drag/drop support if needed
  const deckCard = document.querySelector(".card-inner[draggable='true']");

  setInterval(() => {
    let now = new Date();
    timeshow.textContent = `
      ${String(
        now.getHours() - 12 > 0 ? now.getHours() - 12 : now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}${now.getHours() >= 12 ? "pm" : "am"}
    `;
  }, 1000);

  let throttleFlip = false;

  // Spawn (x) amount of cards to the shuffle pile for (x) quotes
  quotes.slice(0, Math.min(6, quotes.length - 1)).forEach((_, i) => {
    let deepFirstCard = firstCard.cloneNode(true);
    deepFirstCard.setAttribute(
      "style",
      `--transition-bias: ${i * SHUFFLE_DELAY}s;`
    );
    document.querySelector(".card-empty").append(deepFirstCard);
  });

  let allStackedCards = document.querySelectorAll(".card-empty .card-face");

  if (todayCardFront) {
    todayCardFront.addEventListener("mouseover", () => {
      if (!throttleFlip) {
        flipCard();
        throttleFlip = true;

        setTimeout(() => {
          throttleFlip = false;
        }, 250);
      }
    });
  }

  if (todayCardBack) {
    todayCardBack.addEventListener("mouseout", () => {
      if (!throttleFlip) {
        flipCard();
        throttleFlip = true;

        setTimeout(() => {
          throttleFlip = false;
        }, 250);
      }
    });

    todayCardBack.addEventListener("click", () => {
      handleClickShuffle(shuffleZone, deckCard);
    });
  }

  const shuffleZone = document.querySelector(".card-empty");
  if (shuffleZone) {
    // shuffleZone.addEventListener("click", shuffleDeck);
    shuffleZone.setAttribute("tabindex", "0");
    shuffleZone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        shuffleDeck();
      }
    });
  }

  // const dropDeck = document.querySelector(".card-empty");
  // const cardContainer = document.querySelector(".card:has(.card-face[draggable='true'])");

  if (deckCard) {
    deckCard.addEventListener("drag", (e) => {
      isCardFlipped ? flipCard() : null;
      let parentBound = deckCard.parentElement.getBoundingClientRect();
      let dragCardBound = deckCard.getBoundingClientRect();
      // console.log(dragCardBound, e.clientX, e.clientY);
      if (offsetX == null && offsetY == null) {
        offsetX = e.clientX - dragCardBound.x;
        offsetY = e.clientY - dragCardBound.y;
      }

      let newX = e.clientX - parentBound.x - offsetX;
      let newY = e.clientY - parentBound.y - offsetY;
      // console.log(e.clientX, e.clientY);
      deckCard.setAttribute(
        "style",
        `transform: translate(${newX}px, ${newY}px)`
      );
    });

    deckCard.addEventListener("dragstart", (e) => {
      deckCard.classList.add("dragging");
    });

    deckCard.addEventListener("dragend", (e) => {
      handleDragShuffle(deckCard, e);
    });

    if (shuffleZone) {
      shuffleZone.addEventListener("dragover", (e) => e.preventDefault());

      shuffleZone.addEventListener("drop", () => {
        shuffleDeck();
        // Apply incremental hover styles dynamically
      });
    }
  }

  let shuffleText = document.querySelector(".shuffle-text");

  shuffleText.addEventListener("mouseenter", () => {
    tiltShuffleCards(allStackedCards, TILT_LEVEL(), false);
    // console.log(allStackedCards);
  });

  shuffleText.addEventListener("mouseleave", () => {
    if (allStackedCards) {
      tiltShuffleCards(allStackedCards, 0, true);
    }
  });

  // Reduced motion support
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.style.setProperty("--animation-duration", "0s");
  }
});

function handleClickShuffle(shuffleZone, deckCard) {
  let shuffleZoneRect = shuffleZone.getBoundingClientRect();
  handleDragShuffle(deckCard, {
    clientX: shuffleZoneRect.x,
    clientY: shuffleZoneRect.y,
  });
  shuffleDeck();
}

function handleDragShuffle(deckCard, e) {
  deckCard.classList.remove("dragging");

  let parentBound = deckCard.parentElement.getBoundingClientRect();
  let newX = e.clientX - parentBound.x - offsetX;
  let newY = e.clientY - parentBound.y - offsetY;

  // First, instantly move card to mouse position (no transition)
  deckCard.setAttribute(
    "style",
    `transform: translate(${newX}px, ${newY}px); opacity: 0.2;`
  );

  // Then after another small delay, transition back to original position
  setTimeout(() => {
    deckCard.setAttribute(
      "style",
      `transform: translate(0, 0); 
      transition: transform 0.2s ease-in-out;`
    );
  }, SHUFFLE_DELAY * 10000);

  // Reset everything after transition completes
  setTimeout(() => {
    deckCard.removeAttribute("style");
    offsetX = null;
    offsetY = null;
  }, 200 + SHUFFLE_DELAY * 10000); // Match transition duration + delays
}

function tiltShuffleCards(stackedCards, tiltValue, reset = false) {
  if (reset) {
    stackedCards.forEach((element, key) => {
      element.setAttribute(
        "style",
        `--rotation-bias: 0deg; --transition-bias: ${key * SHUFFLE_DELAY}s;`
      );
    });
  } else {
    stackedCards.forEach((element, key) => {
      if (key != stackedCards.length - 1) {
        element.setAttribute(
          "style",
          `
            --rotation-bias: ${
              (key % 2 == 0 ? tiltValue : Math.abs(tiltValue * 2)) * key
            }deg;
            --transition-bias: ${key * SHUFFLE_DELAY}s;
          `
        );
      } else {
        element.setAttribute(
          "style",
          `--rotation-bias: ${15 * tiltValue}deg; --transition-bias: ${
            key * SHUFFLE_DELAY
          }s;`
        );
      }
    });
  }
}

function flipCard() {
  const cardInner = document.querySelector(".card-inner");

  cardInner.classList.toggle("flipped");
  isCardFlipped = !isCardFlipped;

  const endingScene = document.getElementById("ending-scene");
  // Show the ending scene after flip
  if (isCardFlipped) {
    setTimeout(() => {
      endingScene.classList.add("visible");
    }, SHUFFLE_DELAY * 10000); // match card flip duration
  } else {
    endingScene.classList.remove("visible");
  }
}
