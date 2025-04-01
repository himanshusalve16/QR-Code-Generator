# Advanced QR Code Generator

A powerful, interactive QR code generator with advanced customization options, camera scanning, and more.

## Features

### 🎨 Customization Options
- **Color Picker**: Choose custom foreground and background colors
- **Shape Styles**: Multiple dot and corner styles (square, rounded, dot, etc.)
- **Sizing Controls**: Adjust QR code dimensions with a slider
- **Logo Integration**: Add your own logo to the center of the QR code

### 📱 Device Integration
- **Camera Scanning**: Scan QR codes using your device's camera
- **Multi-format Downloads**: Save QR codes as PNG, JPEG, SVG, or WEBP
- **Browser Storage**: Automatically saves your QR code history

### 🌈 Enhanced UX
- **Light & Dark Mode**: Toggle between themes for better viewing
- **Live Preview**: See QR code update as you type
- **Animation Effects**: Smooth transitions and visual feedback
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Tab Interface**: Easy switching between generation, scanning, and history

## How to Use

### Generating QR Codes
1. Enter any text or URL in the input field
2. Customize appearance using the color, style, and size options
3. Optionally upload a logo to appear in the center of the QR code
4. Click "Generate QR Code" or let live preview update it automatically
5. Download your QR code in your preferred format (PNG, JPEG, SVG, WEBP)

### Scanning QR Codes
1. Click the "Scan QR" tab
2. Click "Start Camera" to activate your device's camera
3. Point camera at any QR code to scan it
4. Use the scanned text directly in the generator

### Using QR History
1. Click the "History" tab to view previously generated QR codes
2. Click any saved QR code to load it with all its settings
3. History is saved in your browser's local storage

## Technologies Used

- HTML5 & CSS3
- JavaScript (ES6+)
- [QR Code Styling](https://github.com/kozakdenys/qr-code-styling) for QR generation
- [HTML5-QRCode](https://github.com/mebjas/html5-qrcode) for QR scanning
- Local Storage API for saving history
- CSS Variables for theming

## Running Locally

Simply clone this repository and open the `index.html` file in a web browser.

```bash
git clone <repository-url>
cd qr-code-generator
# Open index.html in your browser
```

No server or build process is required.

## Deployment

### Deploying to Vercel

This project is ready to be deployed on Vercel. Follow these steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy using Vercel CLI** (if installed)
   ```bash
   vercel
   ```

3. **Or deploy directly from the Vercel Dashboard**
   - Create an account on [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration and deploy

4. **Environment Setup**
   - No special environment variables are needed
   - Camera functionality requires HTTPS, which Vercel provides by default

### Important Notes for Deployment

- Camera functionality (QR scanning) requires HTTPS to work
- Vercel automatically provides HTTPS for all deployments
- The app is fully client-side, so no server configuration is needed

## Browser Compatibility

This application works best in modern browsers with camera access capabilities:
- Chrome/Edge (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (iOS 14+ and macOS)

Camera functionality requires HTTPS when deployed to the web (not required for local testing).

## Privacy

All data processing happens in your browser. No data is sent to any server. 