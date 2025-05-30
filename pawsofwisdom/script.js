// Stoic quotes with authors
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

// Get today's quote based on date
function getTodaysQuote() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
}

// Update card colors based on the cat emoji (simulating image colors)
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
  cardFront.style.background = `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 50%, ${scheme.accent} 100%)`;
}

// Initialize today's card
function initializeTodaysCard() {
  const todaysQuote = getTodaysQuote();
  currentQuoteIndex = quotes.indexOf(todaysQuote);

  document.getElementById("quote").textContent = `"${todaysQuote.text}"`;
  document.getElementById("author").textContent = `— ${todaysQuote.author}`;
  document.getElementById("catImage").textContent = todaysQuote.catEmoji;
  document.getElementById(
    "hoverQuote"
  ).textContent = `"${todaysQuote.text}" — ${todaysQuote.author}`;

  updateCardColors(todaysQuote.catEmoji);
}

// Flip card functionality
function flipCard() {
  const card = document.getElementById("todayCard");
  const announcements = document.getElementById("announcements");

  card.classList.toggle("flipped");
  isCardFlipped = !isCardFlipped;

  if (isCardFlipped) {
    announcements.textContent = "Card flipped to reveal wisdom";
  } else {
    announcements.textContent = "Card flipped back to front";
  }
}

// Shuffle deck functionality
function shuffleDeck() {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  const newQuote = quotes[currentQuoteIndex];

  document.getElementById("quote").textContent = `"${newQuote.text}"`;
  document.getElementById("author").textContent = `— ${newQuote.author}`;
  document.getElementById("catImage").textContent = newQuote.catEmoji;
  document.getElementById(
    "hoverQuote"
  ).textContent = `"${newQuote.text}" — ${newQuote.author}`;

  updateCardColors(newQuote.catEmoji);

  // Auto-flip to show new card
  const card = document.getElementById("todayCard");
  if (!isCardFlipped) {
    flipCard();
  }

  document.getElementById("announcements").textContent =
    "Deck shuffled, new wisdom revealed";
}

// Drag and drop functionality
let draggedElement = null;

function handleDragStart(e) {
  draggedElement = e.target;
  e.target.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  document.getElementById("announcements").textContent =
    "Card picked up for dragging";
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
  draggedElement = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.target.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  e.target.classList.remove("drag-over");

  if (draggedElement && e.target.id === "shuffleZone") {
    shuffleDeck();
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  initializeTodaysCard();

  // Today's card flip
  const todayCard = document.getElementById("todayCard");
  todayCard.addEventListener("click", flipCard);
  todayCard.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipCard();
    }
  });

  // Deck card drag
  const deckCard = document.getElementById("deckCard");
  deckCard.addEventListener("dragstart", handleDragStart);
  deckCard.addEventListener("dragend", handleDragEnd);

  // Keyboard support for deck card
  deckCard.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      shuffleDeck();
    }
  });

  // Shuffle zone
  const shuffleZone = document.getElementById("shuffleZone");
  shuffleZone.addEventListener("dragover", handleDragOver);
  shuffleZone.addEventListener("dragenter", handleDragEnter);
  shuffleZone.addEventListener("dragleave", handleDragLeave);
  shuffleZone.addEventListener("drop", handleDrop);

  // Click shuffle zone as alternative
  shuffleZone.addEventListener("click", shuffleDeck);
});

// Reduced motion support
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.style.setProperty("--animation-duration", "0s");
}
