const cards = [
  {
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=640&q=80",
    quote:
      "Art enables us to find ourselves and lose ourselves at the same time.",
    author: "Thomas Merton",
  },
  {
    img: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=640&q=80",
    quote: "Music in the soul can be heard by the universe.",
    author: "Lao Tzu",
  },
  {
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=640&q=80",
    quote: "Creativity takes courage.",
    author: "Henri Matisse",
  },
  {
    img: "https://images.unsplash.com/photo-1511974035430-5de47d3b95da?auto=format&fit=crop&w=640&q=80",
    quote: "Where words fail, music speaks.",
    author: "Hans Christian Andersen",
  },
  {
    img: "https://images.unsplash.com/photo-1476503627822-9dfe4ec40b17?auto=format&fit=crop&w=640&q=80",
    quote:
      "Every child is an artist. The problem is how to remain an artist once he grows up.",
    author: "Pablo Picasso",
  },
  {
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=640&q=80",
    quote: "Music is the poetry of the air.",
    author: "Richter",
  },
  {
    img: "https://images.unsplash.com/photo-1508606572321-901ea443707f?auto=format&fit=crop&w=640&q=80",
    quote: "You need chaos in your soul to give birth to a dancing star.",
    author: "F. Nietzsche",
  },
  {
    img: "https://images.unsplash.com/photo-1496318447583-f524534e9ce1?auto=format&fit=crop&w=640&q=80",
    quote: "Painting is just another way of keeping a diary.",
    author: "Pablo Picasso",
  },
  {
    img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=640&q=80",
    quote: "One good thing about music, when it hits you, you feel no pain.",
    author: "Bob Marley",
  },
  {
    img: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=640&q=80",
    quote:
      "The purpose of art is washing the dust of daily life off our souls.",
    author: "Pablo Picasso",
  },
];

/* ---------- 2. Element references ---------- */
const front = document.getElementById("front");
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const card = document.querySelector(".card");
const nextBtn = document.getElementById("nextBtn");

/* ---------- 3. Initialise with today’s card ---------- */
let idx = dayOfYearIndex();
render(idx);

/* Helper: get zero‑based day‑of‑year */
function dayOfYearIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start; // ms difference
  return Math.floor(diff / 864e5) % cards.length;
}

/* ---------- 4. Render given card index ---------- */
function render(i) {
  const today = new Date();
  front.dataset.date = today.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const data = cards[i];
  front.style.backgroundImage = `url(${data.img})`;
  quoteEl.textContent = `“${data.quote}”`;
  authorEl.textContent = `— ${data.author}`;

  /* Update accent colours via simple palette extraction */
  extractPalette(data.img).then(([c1, c2]) => {
    document.documentElement.style.setProperty("--accent", c1);
    document.documentElement.style.setProperty("--accent-light", c2 + "33"); // add alpha
    document.body.style.background = "var(--accent-light)";
  });
}

/* ---------- 5. Quick‑n‑dirty two‑colour palette ---------- */
function extractPalette(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Unsplash hot‑link safe
    img.src = src;

    img.onload = () => {
      const size = 50; // downsample for speed
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);

      const data = ctx.getImageData(0, 0, size, size).data;
      const map = {};

      for (let i = 0; i < data.length; i += 16) {
        // sample every 4th pixel
        const rgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
        map[rgb] = (map[rgb] || 0) + 1;
      }

      /* Sort by frequency */
      const sorted = Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);

      /* Utility: rgb string → hex */
      const toHex = (rgb) =>
        "#" +
        rgb
          .split(",")
          .map((x) => (+x).toString(16).padStart(2, "0"))
          .join("");

      resolve([toHex(sorted[0]), toHex(sorted[1])]);
    };
  });
}

/* ---------- 6. Interaction handlers ---------- */
/* Flip on click */
card.addEventListener("click", () => card.classList.toggle("flipped"));

/* Keyboard flip (Space / Enter) */
card.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault();
    card.click();
  }
});

/* Next‑quote button cycles forward */
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // don’t trigger flip
  idx = (idx + 1) % cards.length;
  render(idx);
  card.classList.remove("flipped"); // reset view to front
  card.focus(); // maintain a11y focus
});
