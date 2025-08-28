# Progressive Web App (PWA) Configuration

## Overview

VAYRA is configured as a Progressive Web App with the following features:
- Service Worker for offline functionality
- Web App Manifest for installation
- Automatic updates and caching

## Configuration

### Service Worker Registration
- **Production**: Service worker is automatically registered for offline functionality
- **Development**: Service worker registration is disabled to prevent development conflicts

### PWA Manifest
- Located at `/public/manifest.json`
- Includes app icons, theme colors, and installation metadata
- Supports maskable icons for better Android integration

## Troubleshooting

### Network Errors in Development
If you encounter network errors or resource loading issues during development:

1. **Unregister Old Service Worker**:
   - Open Chrome DevTools
   - Go to Application tab → Service Workers
   - Click "Unregister" for any existing service workers
   - Refresh the page

2. **Clear Browser Cache**:
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
   - Or clear browser cache completely

3. **Check Vite Configuration**:
   - Ensure `vite-plugin-pwa` is properly configured
   - Verify PWA manifest path is correct

### Production Deployment
- Service worker is automatically registered in production builds
- PWA features are fully functional on deployed versions
- Users can install the app on supported devices

## Icons and Assets

The PWA includes the following icon sizes:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

All icons support maskable format for better Android integration.
