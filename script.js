/* =============================================
   script.js — NewsFlow JavaScript Logic
   =============================================
   How it works:
   1. On page load, fetch "general" news from NewsAPI.
   2. Render each article as a card in the grid.
   3. Category buttons → fetch news for that category.
   4. Search bar → fetch news matching the search query.
   5. "Load More" button → fetch the next page of results.
   ============================================= */

// --- CONFIG ---

// Replace with your own free API key from https://newsapi.org
const API_KEY = "7254577503394770a3adb2ad765fa109";

// Base URL for NewsAPI top-headlines endpoint
const BASE_URL = "https://newsapi.org/v2/top-headlines";

// Country code for the news (you can change to "us", "gb", "au", etc.)
const COUNTRY = "us";

// Number of articles to fetch per request
const PAGE_SIZE = 9;

// --- STATE ---

let currentCategory = "general"; // currently selected category
let currentQuery    = "";         // current search query (empty = no search)
let currentPage     = 1;         // current pagination page
let totalResults    = 0;         // total results returned by API


// --- DOM ELEMENTS ---

const newsGrid    = document.getElementById("newsGrid");
const statusMsg   = document.getElementById("statusMsg");
const searchInput = document.getElementById("searchInput");
const searchBtn   = document.getElementById("searchBtn");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const catButtons  = document.querySelectorAll(".cat-btn");


// =============================================
// FETCH NEWS FROM API
// =============================================

/**
 * fetchNews(category, query, page)
 * Calls NewsAPI and returns an array of articles.
 *
 * @param {string} category - News category (general, tech, etc.)
 * @param {string} query    - Optional search term
 * @param {number} page     - Page number for pagination
 */
async function fetchNews(category = "general", query = "", page = 1) {

  // Show loading message
  statusMsg.textContent = "Loading news...";

  // Build the API URL with parameters
  let url = `${BASE_URL}?country=${COUNTRY}&category=${category}&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`;

  // If there's a search query, add it to the URL
  if (query.trim()) {
    url += `&q=${encodeURIComponent(query.trim())}`;
  }

  try {
    // Make the network request
    const response = await fetch(url);

    // Parse the JSON response
    const data = await response.json();

    // Check if the API returned an error
    if (data.status !== "ok") {
      throw new Error(data.message || "Something went wrong.");
    }

    // Store total results for "Load More" logic
    totalResults = data.totalResults;

    // Clear the loading message
    statusMsg.textContent = data.articles.length === 0
      ? "No articles found. Try a different search."
      : `Showing ${Math.min(page * PAGE_SIZE, totalResults)} of ${totalResults} articles`;

    return data.articles;

  } catch (error) {
    // Show an error if the fetch fails
    statusMsg.textContent = `⚠️ ${error.message}`;
    console.error("API Error:", error);
    return [];
  }
}


// =============================================
// CREATE A SINGLE NEWS CARD
// =============================================

/**
 * createCard(article)
 * Takes one article object and returns an HTML card element.
 *
 * @param {object} article - A single news article from the API
 * @returns {HTMLElement}  - A fully built card element
 */
function createCard(article) {
  // Create the card container
  const card = document.createElement("div");
  card.className = "news-card";

  // Format the publish date (e.g. "Apr 1, 2026")
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
      })
    : "";

  // Use a placeholder image if the article has no image
  const imgSrc = article.urlToImage || "https://placehold.co/600x180/1a1a1a/888?text=No+Image";

  // Source name (e.g. "BBC News")
  const source = article.source?.name || "Unknown";

  // Description fallback
  const desc = article.description || "No description available.";

  // Build the inner HTML for the card
  card.innerHTML = `
    <img class="card-img" src="${imgSrc}" alt="${article.title}" 
         onerror="this.src='https://placehold.co/600x180/1a1a1a/888?text=No+Image'" />
    <div class="card-body">
      <div class="card-meta">
        <span class="card-source">${source}</span>
        <span>${date}</span>
      </div>
      <h2 class="card-title">${article.title || "Untitled"}</h2>
      <p class="card-desc">${desc}</p>
      <a class="card-link" href="${article.url}" target="_blank" rel="noopener">
        Read Full Article →
      </a>
    </div>
  `;

  return card;
}


// =============================================
// RENDER ARTICLES INTO THE GRID
// =============================================

/**
 * renderArticles(articles, append)
 * Displays articles as cards.
 *
 * @param {Array}   articles - Array of article objects
 * @param {boolean} append   - If true, add to existing cards; else clear the grid first
 */
function renderArticles(articles, append = false) {
  // If not appending, clear the grid
  if (!append) {
    newsGrid.innerHTML = "";
  }

  // Create and add a card for each article
  articles.forEach(article => {
    // Skip articles without a title or URL
    if (!article.title || article.title === "[Removed]") return;

    const card = createCard(article);
    newsGrid.appendChild(card);
  });

  // Show/hide "Load More" button
  // Show it only if there are more results to load
  const loadedCount = currentPage * PAGE_SIZE;
  if (loadedCount < totalResults) {
    loadMoreBtn.style.display = "inline-block";
  } else {
    loadMoreBtn.style.display = "none";
  }
}


// =============================================
// LOAD NEWS (main function)
// =============================================

/**
 * loadNews(reset)
 * Fetches and renders news. Resets page to 1 if reset=true.
 *
 * @param {boolean} reset - Whether to reset to page 1
 */
async function loadNews(reset = true) {
  if (reset) {
    currentPage = 1; // go back to first page
  }

  const articles = await fetchNews(currentCategory, currentQuery, currentPage);
  renderArticles(articles, !reset); // append only if NOT resetting
}


// =============================================
// EVENT: CATEGORY BUTTONS
// =============================================

catButtons.forEach(button => {
  button.addEventListener("click", () => {

    // Remove "active" class from all buttons
    catButtons.forEach(btn => btn.classList.remove("active"));

    // Add "active" to the clicked button
    button.classList.add("active");

    // Update the current category
    currentCategory = button.dataset.category;

    // Clear any search query when switching categories
    currentQuery = "";
    searchInput.value = "";

    // Load news for the new category
    loadNews(true);
  });
});


// =============================================
// EVENT: SEARCH
// =============================================

// Search when the button is clicked
searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value;
  loadNews(true);
});

// Search when Enter key is pressed in the input
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    currentQuery = searchInput.value;
    loadNews(true);
  }
});


// =============================================
// EVENT: LOAD MORE
// =============================================

loadMoreBtn.addEventListener("click", () => {
  currentPage++;            // go to the next page
  loadNews(false);          // don't reset, just append new cards
});


// =============================================
// DARK / LIGHT MODE TOGGLE
// =============================================

const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");

// Check if user previously chose light mode (saved in localStorage)
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  themeIcon.textContent = "🌙"; // show moon icon when in light mode
}

themeToggle.addEventListener("click", () => {
  // Toggle the light-mode class on the body
  document.body.classList.toggle("light-mode");

  // Check which mode is now active and update icon + localStorage
  if (document.body.classList.contains("light-mode")) {
    themeIcon.textContent = "🌙";           // moon = switch back to dark
    localStorage.setItem("theme", "light"); // remember the choice
  } else {
    themeIcon.textContent = "☀️";           // sun = switch back to light
    localStorage.setItem("theme", "dark");
  }
});


// =============================================
// INITIALISE: Load news when the page opens
// =============================================

loadNews(true);