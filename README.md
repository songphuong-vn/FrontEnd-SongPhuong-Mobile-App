# 📱 Song Phương Mobile - Frontend Application

A specialized Single Page Application (SPA) focusing on the frontend experience for Song Phương Mobile's customer management and e-commerce platform.

> **Note**: This project is currently in a **Frontend-First** phase. Due to backend instability, the application is optimized to run with **Mock Data** by default to ensure a smooth UI/UX development and testing experience.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (recommended for development tools)
- Any modern web browser (Chrome, Edge, Firefox, Safari)

### Installation & Running

Since this is a frontend-focused codebase, you can simply serve the static files:

```bash
# Clone the repository
git clone <repository-url>
cd SP-MOBILE-APP

# Install dev dependencies (for linting/formatting)
npm install

# Serve locally (Recommended)
npx serve -s . -p 8080
```

Open `http://localhost:8080` in your browser.

### 🔑 Login Credentials (Mock Mode)
When running in Mock Data mode (default for localhost), use:
- **Username**: `user`
- **Password**: `123456`

## � Tech Stack & Structure

The project is built using standard web technologies without heavy framework overhead to ensure maximum performance and easy debugging:

- **Core**: HTML5, CSS3, JavaScript (ES6 Modules)
- **State Management**: Custom observable patterns/services
- **Styling**: Native CSS Variables & Flexbox/Grid
- **Build Tooling**: Minimal (Prettier/ESLint)

```
SP-MOBILE-APP/
├── index.html          # Main Entry Point
├── css/                # Global Styles & Variables
├── js/                 # Application Logic
│   ├── config.js       # configuration (Mock Data toggle)
│   ├── services/       # Data handling (switches between API/Mock)
│   ├── components/     # UI Components
│   └── app.js          # Core initialization
├── pages/              # Static page templates
└── icons/              # SVG & Image Assets
```

## 🛠️ Key Features (Frontend)

- **Mock-First Architecture**: Designed to function seamlessly without a live backend.
- **Responsive Implementation**: Mobile-first design that scales up to desktop.
- **Product Catalog UI**: Optimized rendering for large lists (virtualization/pagination concepts).
- **Shopping Cart State**: Client-side cart management with local storage persistence.
- **Interactive UI**: Custom alerts, toast notifications, and modals (no external huge libraries).

## ⚙️ Configuration

The application behavior is controlled via `js/config.js`.

### Forcing Mock Data
If you encounter API issues, ensure Mock Data is enabled:

```javascript
// js/config.js
export const CONFIG = {
    // ...
    ENABLE_MOCK_DATA: true, // Set to true to bypass backend
    // ...
};
```

## 🐛 Troubleshooting

### API Connection Errors?
The backend is currently unstable. If you see connection refused or 500 errors:
1.  Open `js/config.js`.
2.  Set `ENABLE_MOCK_DATA = true`.
3.  Refresh the page.

### Layout Issues on Mobile?
- Hard refresh the browser (`Ctrl + Shift + R` or Clear Cache) to ensure latest CSS is loaded.

## 🤝 Contributing

Focus is currently on **UI Polish** and **Frontend Logic**.

1.  Create a feature branch.
2.  Ensure code is formatted: `npm run format`.
3.  Check for lint errors: `npm run lint`.
4.  Submit a Pull Request.
