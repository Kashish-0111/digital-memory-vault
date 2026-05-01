# 🔐 Digital Memory Vault

A secure personal memory management app with smart notifications.

---

## ⚡ Quick Start

### Prerequisites
- **Node.js v18+** — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### 1. Install & Run Locally

```bash
# Step 1: Extract the ZIP
unzip digital-memory-vault.zip
cd digital-memory-vault

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

> **First time?** You'll be asked to create a 4-digit PIN. Remember it — it locks your vault!

---

## 🌐 Deploy to Netlify (Free)

### Option A: Drag & Drop (Easiest)

```bash
# Build the project
npm run build
```

1. Go to [netlify.com](https://netlify.com) → Sign up free
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag & drop the **`dist/`** folder
4. Done! Your app is live ✅

### Option B: GitHub + Netlify (Auto-deploy)

1. Push code to GitHub
2. Go to Netlify → **"Add new site"** → **"Import from Git"**
3. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy**

---

## 🔑 Default PIN

No default PIN — you set your own on first launch.

To reset PIN: Go to **Settings → Change PIN**

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/      # Reusable UI components
│   └── layout/      # App shell (Sidebar, Navbar)
├── context/         # Global state (AppContext)
├── hooks/           # Custom hooks
├── pages/           # Route pages
├── reducers/        # State reducers
├── services/        # Auth, Notifications
└── utils/           # Helpers, localStorage
```

---

## ✨ Features

- 🔐 PIN-based local authentication
- 📝 Notes with categories, tags, pin & private
- 🔔 Smart reminders with browser notifications
- 🎂 Birthday & anniversary tracking
- 💳 Bill due date reminders
- 🌙 Dark / Light mode
- 📤 Export / Import data as JSON
- 🎉 Confetti on birthdays
- 📱 Fully responsive (mobile + tablet + desktop)

---

## 🛠 Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Context API + useReducer
- Browser Notification API
- LocalStorage (no backend needed)
