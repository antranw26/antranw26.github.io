const leftCard = document.getElementById("left-card");
const centerCard = document.getElementById("center-card");
const shuffleColumn = document.getElementById("shuffle-column");
const catImage = document.getElementById("cat-image");
const quote = document.getElementById("quote");

const quotes = [
  {
    image: "cat1.png",
    text: '"To be calm is the highest achievement of the self."',
  },
  { image: "cat2.png", text: '"Sometimes the best response is silence."' },
  { image: "cat3.png", text: '"Wisdom begins in wonder."' },
];

// Drag start event
leftCard.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "left-card");
});

// Allow drop
shuffleColumn.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// Drop event: shuffle the deck
shuffleColumn.addEventListener("drop", (e) => {
  const data = e.dataTransfer.getData("text/plain");
  if (data === "left-card") {
    centerCard.querySelector(".card-inner").style.transform = "rotateY(180deg)";
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    catImage.src = randomQuote.image;
    quote.textContent = randomQuote.text;
  }
});

// Click to flip
centerCard.addEventListener("click", () => {
  centerCard.querySelector(".card-inner").style.transform = "rotateY(180deg)";
});

// Keyboard accessibility
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    centerCard.querySelector(".card-inner").style.transform = "rotateY(180deg)";
  }
});
