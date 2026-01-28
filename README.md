# 📱 Song Phương Mobile - Customer Management App

Modern Single Page Application (SPA) for customer management and e-commerce.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for development tools)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SP-MOBILE-APP

# Install dev dependencies (optional)
npm install

# Serve locally
npx serve -s . -p 8080
# Or use Python
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

### Login (Localhost Only)
- Username: `user`
- Password: `123456`

## 📁 Project Structure

```
SP-MOBILE-APP/
├── index.html          # Main SPA entry
├── css/                # Stylesheets
├── js/                 # JavaScript modules
│   ├── config.js       # Environment configuration
│   ├── api-client.js   # API communication
│   ├── ui-helpers.js   # UI utility functions
│   ├── app.js          # Main application logic
│   └── ...
├── pages/              # Standalone pages
└── icons/              # Assets
```

## 🛠️ Development

### Code Quality

```bash
# Format code
npm run format

# Lint JavaScript
npm run lint
```

### Key Features

- ✅ **Auto Environment Detection**: Localhost vs Production
- ✅ **Mock Data Mode**: Enabled on localhost for testing
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Product Catalog**: 9,926 products with search & filter
- ✅ **Shopping Cart**: Full cart management
- ✅ **User Authentication**: Login/Register system
- ✅ **Warranty Tracking**: Product warranty information

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

1. Push to Git repository
2. Connect to Vercel/Netlify
3. Auto-deploy on push

## 📝 Configuration

Edit `js/config.js` to change:

- **API URL**: `API_BASE_URL`
- **Mock Data**: `ENABLE_MOCK_DATA` (auto-set based on environment)
- **Debug Mode**: `ENABLE_DEBUG`

## 🔧 Environment Variables

The app auto-detects environment:

| Environment | Hostname | Mock Data | Debug |
|------------|----------|-----------|-------|
| Development | localhost | ✅ | ✅ |
| Staging | *.vercel.app | ❌ | ✅ |
| Production | Custom domain | ❌ | ❌ |

## 📚 Documentation

- **CLEANUP_SUMMARY.md**: Recent code cleanup details
- **js/types.js**: JSDoc type definitions
- **js/ui-helpers.js**: Utility functions documentation

## 🐛 Troubleshooting

### Cannot scroll
- Clear browser cache (Ctrl + Shift + R)
- Check console for errors

### API errors
- Verify `API_BASE_URL` in `js/config.js`
- Check backend is running (localhost:5000)
- Check browser console for CORS errors

### Mock login not working
- Only works on localhost
- Use credentials: `user` / `123456`

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run `npm run lint` and `npm run format`
4. Commit with clear message
5. Create Pull Request
