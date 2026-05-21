# QR Code App

A modern, feature-rich QR Code application built with Angular. Generate and scan QR codes with ease.

## Features

### QR Code Generator
- **Multiple Content Types**: Text, URL, WiFi, Email, Phone
- **Customization Options**:
  - Foreground and background colors
  - Adjustable size (128px - 512px)
  - Custom margin
- **Actions**:
  - Download as PNG
  - Copy to clipboard
- **History**: Automatically saves generated QR codes

### QR Code Scanner
- **Camera Integration**: Uses device camera to scan QR codes
- **Multiple Camera Support**: Switch between front/back cameras
- **Smart Detection**: Automatically detects content type
- **Quick Actions**:
  - Copy scanned content
  - Open URLs directly
  - Scan again

## Tech Stack

- **Framework**: Angular 19
- **Language**: TypeScript
- **Styling**: SCSS
- **QR Generation**: qrcode library
- **QR Scanning**: html5-qrcode
- **Mobile**: Capacitor (iOS/Android)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Angular CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd QRCodeApp

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`

### Building for Production

```bash
# Build for web
npm run build

# The built files will be in dist/qr-code-app/
```

## Mobile Deployment

### Using Capacitor

```bash
# Install Capacitor dependencies (already installed)
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Build the web assets
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Sync and open in Android Studio
npx cap sync android
npx cap open android

# Sync and open in Xcode
npx cap sync ios
npx cap open ios
```

### Publishing to App Stores

#### Google Play Store
1. Build signed APK/AAB in Android Studio
2. Create developer account ($25 one-time)
3. Upload and publish

#### Apple App Store
1. Build archive in Xcode
2. Create developer account ($99/year)
3. Submit for review

## Project Structure

```
QRCodeApp/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── qr-generator/    # QR code generation component
│   │   │   └── qr-scanner/      # QR code scanning component
│   │   ├── services/
│   │   │   └── qr.service.ts    # QR code service
│   │   ├── app.component.*      # Main app component
│   │   └── app.config.ts        # App configuration
│   ├── styles.scss              # Global styles
│   ├── index.html               # Main HTML
│   └── main.ts                  # Entry point
├── public/                      # Static assets
├── angular.json                 # Angular configuration
├── package.json                 # Dependencies
└── capacitor.config.ts          # Capacitor configuration
```

## Monetization Ideas

- **Ad-Supported**: Integrate Google AdMob for banner/interstitial ads
- **Premium Version**: Remove ads with a one-time purchase
- **Pro Features**: 
  - Batch QR code generation
  - Custom QR code logos
  - Cloud sync for history
  - Analytics dashboard

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ using Angular