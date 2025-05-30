const quotes = [
  {
    text: "Darling, the world may toss yarn at your paws, but composure means choosing which threads are worth the chase.",
    author: "Marcus Aurelius",
    catEmoji: "🐱",
  },
  {
    text: "A wise cat knows that the warmest sunbeam is not always where others gather.",
    author: "Epictetus",
    catEmoji: "😺",
  },
  {
    text: "The fishbowl you cannot reach teaches more than the treat you devour.",
    author: "Seneca",
    catEmoji: "🙀",
  },
  {
    text: "Purr not for applause, but for the contentment that comes from within.",
    author: "Marcus Aurelius",
    catEmoji: "😸",
  },
  {
    text: "Even the most comfortable windowsill cannot shield you from life's storms.",
    author: "Epictetus",
    catEmoji: "😿",
  },
  {
    text: "The mouse you chase is often less important than the peace you lose pursuing it.",
    author: "Seneca",
    catEmoji: "🐈",
  },
  {
    text: "Nine lives are not granted to waste on trivial concerns.",
    author: "Marcus Aurelius",
    catEmoji: "😻",
  },
];

let currentQuoteIndex = 0;
let isCardFlipped = false;

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
          <p style="font-size: 1rem;">${quoteData.catEmoji}</p>
          <p style="font-size: 1.1rem;">"${quoteData.text}"</p>
          <p style="margin-top: 0.5rem;">— ${quoteData.author}</p>
        </div>
      `;
  }

  updateCardColors(quoteData.catEmoji);
}

function flipCard() {
  const innerCard = document.querySelector(".card-inner");
  if (innerCard) {
    innerCard.classList.toggle("flipped");
    isCardFlipped = !isCardFlipped;
  }
}

function shuffleDeck() {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  const quoteData = quotes[currentQuoteIndex];

  const cardFront = document.querySelector(".card-front");
  if (cardFront) {
    cardFront.innerHTML = `
        <div style="padding: 1rem; color: white; text-align: center;">
          <p style="font-size: 1rem;">${quoteData.catEmoji}</p>
          <p style="font-size: 1.1rem;">"${quoteData.text}"</p>
          <p style="margin-top: 0.5rem;">— ${quoteData.author}</p>
        </div>
      `;
  }

  updateCardColors(quoteData.catEmoji);

  if (!isCardFlipped) {
    flipCard();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeTodaysCard();

  const todayCard = document.querySelector(".card-flip");
  if (todayCard) {
    todayCard.addEventListener("click", flipCard);
    todayCard.setAttribute("tabindex", "0");
    todayCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipCard();
      }
    });
  }

  const shuffleZone = document.querySelector(".card-empty");
  if (shuffleZone) {
    shuffleZone.addEventListener("click", shuffleDeck);
    shuffleZone.setAttribute("tabindex", "0");
    shuffleZone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        shuffleDeck();
      }
    });
  }

  // Optional drag/drop support if needed
  const deckCard = document.querySelector(".card-face[draggable='true']");
  if (deckCard) {
    deckCard.addEventListener("dragstart", () => {
      deckCard.classList.add("dragging");
    });
    deckCard.addEventListener("dragend", () => {
      deckCard.classList.remove("dragging");
    });

    if (shuffleZone) {
      shuffleZone.addEventListener("dragover", (e) => e.preventDefault());
      shuffleZone.addEventListener("drop", shuffleDeck);
    }
  }

  // Reduced motion support
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.style.setProperty("--animation-duration", "0s");
  }
});

function flipCard() {
  const cardInner = document.querySelector(".card-inner");
  const endingScene = document.getElementById("ending-scene");

  cardInner.classList.toggle("flipped");
  isCardFlipped = !isCardFlipped;

  // Show the ending scene after flip
  if (isCardFlipped) {
    setTimeout(() => {
      endingScene.classList.add("visible");
    }, 800); // match card flip duration
  } else {
    endingScene.classList.remove("visible");
  }
}
