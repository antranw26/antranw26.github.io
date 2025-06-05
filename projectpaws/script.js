// Global Variables
// ===========================================
let quotes = []; // Array to store all quote data loaded from JSON file

// Configuration Constants
// ===========================================
// Creates random tilt angle between -4 and +4 degrees for card shuffle animation
const TILT_LEVEL = () => (0.5 - Math.random()) * 8;
// Delay between each card animation in the shuffle stack (40ms)
const SHUFFLE_DELAY = 0.04;

// State Variables
// ===========================================
let currentQuoteIndex = 0; // Tracks which quote is currently displayed
let isCardFlipped = false; // Boolean to track if the main card is showing front or back

// Drag and Drop Variables
// ===========================================
let offsetX = null; // Mouse offset X position for smooth dragging
let offsetY = null; // Mouse offset Y position for smooth dragging

// ===========================================
// DATA LOADING FUNCTIONS
// ===========================================

/**
 * Asynchronously loads quote data from external JSON file
 * Uses fetch API to retrieve data and convert to JavaScript object
 * @returns {Promise<Array>} Array of quote objects from JSON file
 */
async function loadDataFromJson() {
  let quotesTwo = await fetch("./quote-data.json");
  let toReturn = await quotesTwo.json();
  return toReturn;
}

// ===========================================
// QUOTE SELECTION FUNCTIONS
// ===========================================

/**
 * Calculates today's quote based on day of year
 * Uses current date to determine which quote to show as "quote of the day"
 * Cycles through quotes array based on day number (365 days = full cycle)
 * @returns {Object} Quote object for today
 */
function getTodaysQuote() {
  const today = new Date();
  // Calculate day of year (1-365/366)
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  // Use modulo to cycle through quotes if we have fewer quotes than days
  return quotes[dayOfYear % quotes.length];
}

// ===========================================
// VISUAL STYLING FUNCTIONS
// ===========================================

/**
 * Updates card background colors based on the cat emoji
 * Each cat emoji has its own color scheme for visual variety
 * Uses CSS linear gradients for attractive card backgrounds
 * @param {string} catEmoji - The cat emoji character to determine color scheme
 */
function updateCardColors(catEmoji) {
  // Color scheme mapping - each cat emoji gets unique gradient colors
  const colorSchemes = {
    "🐱": { primary: "#FF6B6B", secondary: "#FF4757", accent: "#FF3838" }, // Red theme
    "😺": { primary: "#4ECDC4", secondary: "#45B7AF", accent: "#3CA29C" }, // Teal theme
    "🙀": { primary: "#FFA726", secondary: "#FF9800", accent: "#F57C00" }, // Orange theme
    "😸": { primary: "#AB47BC", secondary: "#9C27B0", accent: "#7B1FA2" }, // Purple theme
    "😿": { primary: "#5C6BC0", secondary: "#3F51B5", accent: "#303F9F" }, // Blue theme
    "🐈": { primary: "#66BB6A", secondary: "#4CAF50", accent: "#388E3C" }, // Green theme
    "😻": { primary: "#EF5350", secondary: "#F44336", accent: "#D32F2F" }, // Pink theme
  };

  // Get color scheme for current emoji, fallback to red theme if emoji not found
  const scheme = colorSchemes[catEmoji] || colorSchemes["🐱"];
  const cardFront = document.querySelector(".card-front");

  if (cardFront) {
    // Apply diagonal gradient background using CSS linear-gradient
    cardFront.style.background = `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 50%, ${scheme.accent} 100%)`;
  }
}

/**
 * Sets up the initial "today's quote" card on page load
 * Gets today's quote and displays it with proper formatting and colors
 */
function initializeTodaysCard() {
  const quoteData = getTodaysQuote();
  currentQuoteIndex = quotes.indexOf(quoteData);

  const cardFront = document.querySelector(".card-front");
  if (cardFront) {
    // Build HTML content for the card front with quote text, author, and emoji
    cardFront.innerHTML = `
        <div style="padding: 1rem; color: white; text-align: center;">
          <p style="font-size: 3rem; margin: 0;">${quoteData.catEmoji}</p>
          <p style="font-size: 1.1rem;">"${quoteData.text}"</p>
          <p style="margin-top: 0.5rem;">— ${quoteData.author}</p>
        </div>
      `;
  }

  // Apply color scheme based on the cat emoji
  updateCardColors(quoteData.catEmoji);
}

/**
 * Main shuffle function - creates the card shuffling animation and updates content
 * Tilts all cards in the deck, selects new random quote, updates display
 */
function shuffleDeck() {
  // Start shuffle animation by tilting all deck cards
  tiltShuffleCards(
    document.querySelectorAll(".card-empty .card-face"),
    TILT_LEVEL(),
    false
  );
  console.log("Cards shuffled"); // Debug log for testing

  // Only shuffle to new quote if card isn't currently flipped
  if (!isCardFlipped) {
    // Select random quote from available quotes
    // currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length; // Old sequential method
    currentQuoteIndex = Math.min(
      Math.floor(Math.random() * quotes.length),
      quotes.length - 1
    );
    const quoteData = quotes[currentQuoteIndex];

    // Update card front with new quote content
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

    // Update colors to match new quote's emoji
    updateCardColors(quoteData.catEmoji);

    // Reset card positions after animation completes
    setTimeout(() => {
      tiltShuffleCards(
        document.querySelectorAll(".card-empty .card-face"),
        TILT_LEVEL(),
        true // Reset parameter
      );
    }, SHUFFLE_DELAY * 10000); // Wait for shuffle animation to complete
  }
}

// ===========================================
// EVENT LISTENERS AND INITIALIZATION
// ===========================================

/**
 * Main initialization function - runs when DOM is fully loaded
 * Sets up all event listeners, loads data, and initializes the interface
 */
document.addEventListener("DOMContentLoaded", async function () {
  // Load quote data from JSON file
  quotes = await loadDataFromJson();

  // Set up today's initial card
  initializeTodaysCard();
  flipCard(); // Flip to show the quote

  // Display total number of quotes available
  document
    .querySelector(".num-indicator")
    .appendChild(document.createTextNode(quotes.length));

  // Get DOM elements for event listeners
  const todayCardFront = document.querySelector(".card-flip .card-front");
  const todayCardBack = document.querySelector(".card-flip .card-back");
  const firstCard = document.querySelector(".card-empty .card-back");
  const timeshow = document.querySelector(".current-time");
  const deckCard = document.querySelector(".card-inner[draggable='true']"); // Draggable card element

  // ===========================================
  // LIVE CLOCK FUNCTIONALITY
  // ===========================================

  /**
   * Updates the displayed time every second
   * Shows current time in 12-hour format with AM/PM
   */
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

  // ===========================================
  // CARD STACK GENERATION
  // ===========================================

  // Throttle variable to prevent rapid card flipping
  let throttleFlip = false;

  /**
   * Create visual card stack by cloning cards
   * Generates up to 6 cards for the shuffle pile, each with staggered animation timing
   */
  quotes.slice(0, Math.min(6, quotes.length - 1)).forEach((_, i) => {
    let deepFirstCard = firstCard.cloneNode(true); // Deep clone to copy all child elements
    // Set CSS custom property for staggered animation timing
    deepFirstCard.setAttribute(
      "style",
      `--transition-bias: ${i * SHUFFLE_DELAY}s;`
    );
    document.querySelector(".card-empty").append(deepFirstCard);
  });

  // Get all stacked cards for animation purposes
  let allStackedCards = document.querySelectorAll(".card-empty .card-face");

  // ===========================================
  // CARD FLIP EVENT LISTENERS
  // ===========================================

  /**
   * Card front hover event - flips card to show back
   * Uses throttling to prevent rapid flipping
   */
  if (todayCardFront) {
    todayCardFront.addEventListener("mouseover", () => {
      if (!throttleFlip) {
        flipCard();
        throttleFlip = true;

        // Reset throttle after 250ms
        setTimeout(() => {
          throttleFlip = false;
        }, 250);
      }
    });
  }

  /**
   * Card back events - flip back to front on mouse out, shuffle on click
   */
  if (todayCardBack) {
    // Mouse out event - flip back to front
    todayCardBack.addEventListener("mouseout", () => {
      if (!throttleFlip) {
        flipCard();
        throttleFlip = true;

        setTimeout(() => {
          throttleFlip = false;
        }, 250);
      }
    });

    // Click event - trigger shuffle
    todayCardBack.addEventListener("click", () => {
      handleClickShuffle(shuffleZone, deckCard);
    });
  }

  // ===========================================
  // SHUFFLE ZONE EVENT LISTENERS
  // ===========================================

  const shuffleZone = document.querySelector(".card-empty");
  if (shuffleZone) {
    // Make shuffle zone focusable for accessibility
    shuffleZone.setAttribute("tabindex", "0");

    // Keyboard accessibility - allow Enter or Space to shuffle
    shuffleZone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        shuffleDeck();
      }
    });
  }

  // ===========================================
  // DRAG AND DROP FUNCTIONALITY
  // ===========================================

  /**
   * Drag and drop implementation for card shuffling
   * Allows users to drag the main card to the shuffle pile
   */
  if (deckCard) {
    // During drag - update card position to follow mouse
    deckCard.addEventListener("drag", (e) => {
      // Auto-flip card if it's currently flipped
      isCardFlipped ? flipCard() : null;

      // Calculate relative positions for smooth dragging
      let parentBound = deckCard.parentElement.getBoundingClientRect();
      let dragCardBound = deckCard.getBoundingClientRect();

      // Set initial offset on first drag event
      if (offsetX == null && offsetY == null) {
        offsetX = e.clientX - dragCardBound.x;
        offsetY = e.clientY - dragCardBound.y;
      }

      // Calculate new position relative to parent container
      let newX = e.clientX - parentBound.x - offsetX;
      let newY = e.clientY - parentBound.y - offsetY;

      // Apply transform to move card with cursor
      deckCard.setAttribute(
        "style",
        `transform: translate(${newX}px, ${newY}px)`
      );
    });

    // Drag start - add visual feedback
    deckCard.addEventListener("dragstart", (e) => {
      deckCard.classList.add("dragging");
    });

    // Drag end - handle the drop and reset card position
    deckCard.addEventListener("dragend", (e) => {
      handleDragShuffle(deckCard, e);
    });

    // Shuffle zone drop events
    if (shuffleZone) {
      // Allow dropping on shuffle zone
      shuffleZone.addEventListener("dragover", (e) => e.preventDefault());

      // Handle successful drop
      shuffleZone.addEventListener("drop", () => {
        shuffleDeck();
      });
    }
  }

  // ===========================================
  // SHUFFLE TEXT HOVER EFFECTS
  // ===========================================

  /**
   * Interactive hover effects for shuffle text
   * Tilts cards when hovering over shuffle instruction text
   */
  let shuffleText = document.querySelector(".shuffle-text");

  shuffleText.addEventListener("mouseenter", () => {
    // Tilt cards on hover
    tiltShuffleCards(allStackedCards, TILT_LEVEL(), false);
  });

  shuffleText.addEventListener("mouseleave", () => {
    // Reset cards when mouse leaves
    if (allStackedCards) {
      tiltShuffleCards(allStackedCards, 0, true);
    }
  });

  // ===========================================
  // ACCESSIBILITY - REDUCED MOTION SUPPORT
  // ===========================================

  /**
   * Respect user's motion preferences
   * Disables animations if user has reduced motion enabled
   */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.style.setProperty("--animation-duration", "0s");
  }
});

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Handles click-based shuffling (non-drag method)
 * Simulates drag-and-drop by calculating shuffle zone position
 * @param {Element} shuffleZone - The target shuffle area
 * @param {Element} deckCard - The card being moved
 */
function handleClickShuffle(shuffleZone, deckCard) {
  let shuffleZoneRect = shuffleZone.getBoundingClientRect();
  // Simulate drag event with shuffle zone coordinates
  handleDragShuffle(deckCard, {
    clientX: shuffleZoneRect.x,
    clientY: shuffleZoneRect.y,
  });
  shuffleDeck();
}

/**
 * Handles the drag shuffle animation and card reset
 * Creates smooth transition effect when card is dropped
 * @param {Element} deckCard - The dragged card element
 * @param {Event} e - The drag/drop event containing mouse coordinates
 */
function handleDragShuffle(deckCard, e) {
  // Remove dragging visual state
  deckCard.classList.remove("dragging");

  // Calculate final drop position
  let parentBound = deckCard.parentElement.getBoundingClientRect();
  let newX = e.clientX - parentBound.x - offsetX;
  let newY = e.clientY - parentBound.y - offsetY;

  // First: Move card to drop position with fade effect (no transition)
  deckCard.setAttribute(
    "style",
    `transform: translate(${newX}px, ${newY}px); opacity: 0.2;`
  );

  // Then: Animate card back to original position
  setTimeout(() => {
    deckCard.setAttribute(
      "style",
      `transform: translate(0, 0); 
      transition: transform 0.2s ease-in-out;`
    );
  }, SHUFFLE_DELAY * 10000);

  // Finally: Clean up all styles and reset drag variables
  setTimeout(() => {
    deckCard.removeAttribute("style");
    offsetX = null;
    offsetY = null;
  }, 200 + SHUFFLE_DELAY * 10000); // Wait for all animations to complete
}

/**
 * Creates tilting animation effect for card stack
 * Used for shuffle effects and hover interactions
 * @param {NodeList} stackedCards - All cards in the stack to animate
 * @param {number} tiltValue - Degree of rotation to apply
 * @param {boolean} reset - Whether to reset cards to flat position
 */
function tiltShuffleCards(stackedCards, tiltValue, reset = false) {
  if (reset) {
    // Reset all cards to flat position with staggered timing
    stackedCards.forEach((element, key) => {
      element.setAttribute(
        "style",
        `--rotation-bias: 0deg; --transition-bias: ${key * SHUFFLE_DELAY}s;`
      );
    });
  } else {
    // Apply tilting effect with varied angles for each card
    stackedCards.forEach((element, key) => {
      if (key != stackedCards.length - 1) {
        // Regular cards get alternating tilt based on position
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
        // Top card gets extra dramatic tilt
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

/**
 * Main card flip function - toggles between front and back
 * Also controls the ending scene visibility
 */
function flipCard() {
  const cardInner = document.querySelector(".card-inner");

  // Toggle CSS class to trigger flip animation
  cardInner.classList.toggle("flipped");
  isCardFlipped = !isCardFlipped;

  // Handle ending scene display
  const endingScene = document.getElementById("ending-scene");
  if (isCardFlipped) {
    // Show ending scene after card flip completes
    setTimeout(() => {
      endingScene.classList.add("visible");
    }, SHUFFLE_DELAY * 10000); // Match card flip animation duration
  } else {
    // Hide ending scene immediately when flipping back
    endingScene.classList.remove("visible");
  }
}
