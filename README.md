# 📰 Khabr

**Khabr** is a real-time news aggregator web app built with pure HTML, CSS, and JavaScript. It fetches live headlines using the NewsAPI and displays them in a clean, responsive card layout — with category filtering, keyword search, pagination, and a dark/light mode toggle.

> *"Khabr" (خبر) means "News" in Urdu/Hindi.*

---

## 🖥️ Live Demo

🔗 [View Live on GitHub Pages](https://atharvadhas.github.io/Khabr-/)

---

## ✨ Features

- 📡 **Real-time headlines** powered by [NewsAPI](https://newsapi.org)
- 🗂️ **7 Category filters** — General, Technology, Business, Sports, Health, Science, Entertainment
- 🔍 **Keyword search** with Enter key support
- 📄 **Pagination** via Load More button
- 🌙 **Dark / Light mode** toggle with localStorage persistence
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- 🃏 **Card layout** with image, source, date, headline, and description

---

## 📁 Project Structure

```
Khabr-/
│
├── index.html      # App structure — header, grid, footer
├── style.css       # All styling — dark theme, cards, responsive layout
├── script.js       # API logic, card rendering, search, filters
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AtharvaDhas/Khabr-.git
cd Khabr-
```

### 2. Get a free API key

- Sign up at [https://newsapi.org](https://newsapi.org)
- Copy your API key from the dashboard

### 3. Add your API key

Open `script.js` and replace the placeholder on line 14:

```js
const API_KEY = "7254577503394770a3adb2ad765fa109";
```

### 4. Open in browser

Just open `index.html` directly in your browser — no build tools or servers needed.

```bash
open index.html   # macOS
start index.html  # Windows
```

> ⚠️ **Note:** NewsAPI's free plan only works on `localhost`. It will not work on a live hosted domain unless you upgrade to a paid plan.

---

## 🛠️ Built With

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 | Styling, animations, responsive grid |
| JavaScript (ES6+) | API calls, DOM manipulation, logic |
| [NewsAPI](https://newsapi.org) | Live news data |
| Google Fonts | Typography (Playfair Display + Source Sans 3) |

---

## 📌 How It Works

1. On page load, `fetchNews()` calls the NewsAPI with the selected category and country.
2. Each article is passed to `createCard()` which builds an HTML card element.
3. Cards are injected into the news grid by `renderArticles()`.
4. Clicking a category button or searching re-calls `loadNews()` with updated parameters.
5. "Load More" increments the page number and appends new cards to the grid.
6. The theme toggle adds/removes a `light-mode` class on `<body>` and saves the preference in `localStorage`.

---

## 🤝 Contributing

Pull requests are welcome! If you'd like to suggest improvements or report a bug, feel free to open an issue.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Atharva Dhas**
- GitHub: [@AtharvaDhas](https://github.com/AtharvaDhas)
