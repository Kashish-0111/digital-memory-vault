# 🔐 Digital Memory Vault

A secure, offline-first personal memory management app built with React + Firebase.

![Digital Memory Vault](https://digital-memory-vault.web.app)

## 🌐 Live Demo

👉 **[https://digital-memory-vault.web.app](https://digital-memory-vault.web.app)**

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

- 🔐 **PIN Protection** — Secure local PIN-based authentication
- 📧 **Firebase Auth** — Email/Password cloud login
- 📝 **Smart Notes** — Rich notes with categories, tags, pin & privacy toggle
- 🔔 **Reminders** — Birthdays, bills, anniversaries with yearly repeat
- 🗂️ **Categories** — Custom categories with emoji icons and color coding
- ☁️ **Cloud Sync** — Firestore real-time sync for Firebase users
- 🌙 **Dark/Light Mode** — Theme toggle on every page
- 🎙️ **Voice Input** — Voice-to-text for note descriptions
- 📤 **Export CSV** — Download reminders as CSV
- 💾 **Local First** — Works offline with localStorage fallback
- ⚡ **Lightning Fast** — No server latency, instant everything

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| React 18 | Frontend UI |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Firebase Auth | Authentication |
| Cloud Firestore | Database |
| Firebase Hosting | Deployment |
| React Router v6 | Navigation |
| Lucide React | Icons |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
  ### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/digital-memory-vault.git

# Go into the project
cd digital-memory-vault

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
npm run dev
```

### Build & Deploy

```bash
# Build
npm run build

# Deploy to Firebase
firebase deploy
```
---

## 🔒 Security

- PIN is hashed and stored locally
- Firebase API keys stored in `.env` (never committed)
- Firestore rules restrict data access per user
- No sensitive data exposed in repository

---

## 📱 PWA Ready

The app is fully responsive and works on:
- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use and modify.

---

## 👨‍💻 Author

**Kashish Dhankar**

Made with ❤️ and lots of ☕
