let cards = [];
let filteredCards = [];

fetch("cards.json")
  .then(res => res.json())
  .then(data => {
    cards = data;
    filteredCards = cards;
    renderCards();
  });

const grid = document.getElementById("card-grid");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-image");
const colSelect = document.getElementById("columns");

function renderCards() {
  grid.innerHTML = "";
  filteredCards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    const img = document.createElement("img");
    img.src = card.IMG_URL;
    img.loading = "lazy";
    img.onclick = () => openModal(card.IMG_URL);

    div.appendChild(img);
    grid.appendChild(div);
  });
}

function openModal(src) {
  modalImg.src = src;
  modal.classList.remove("hidden");
}

modal.onclick = () => {
  modal.classList.add("hidden");
};

colSelect.addEventListener("change", (e) => {
  const numCols = e.target.value;
  // This updates the CSS variable directly on the grid element
  grid.style.setProperty('--cols', numCols);
});

/* SEARCH */
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  filteredCards = cards.filter(c =>
    c.CRDNME.toLowerCase().includes(value)
  );
  renderCards();
});

/* SORT & FILTER */
sortSelect.addEventListener("change", e => {
  const mode = e.target.value;
  const searchTerm = searchInput.value.toLowerCase();

  // 1. Start with the search-filtered list first (so search persists)
  let result = cards.filter(c => c.CRDNME.toLowerCase().includes(searchTerm));

  if (mode === "evo") {
    result.sort((a, b) => (a.EVO || 0) - (b.EVO || 0));
  } 
  else if (mode === "lp") {
    // 2. Filter OUT cards where LP is null, undefined, or an empty string
    result = result.filter(c => c.LP !== undefined && c.LP !== null && c.LP !== "");
    // 3. Sort by Weight (Highest to Lowest)
    result.sort((a, b) => b.LP - a.LP);
  } 
  else if (mode === "name") {
    result.sort((a, b) => a.CRDNME.localeCompare(b.CRDNME));
  }

  filteredCards = result;
  renderCards();
});
