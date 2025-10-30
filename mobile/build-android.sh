#!/bin/bash

# Navigate to the app directory
cd /app

# Disable telemetry
npx cap telemetry off

# Update capacitor config with environment variables if available
if [ -n "$KEYSTORE_PASSWORD" ] || [ -n "$KEYSTORE_ALIAS" ] || [ -n "$KEYSTORE_ALIAS_PASSWORD" ]; then
  echo "Updating capacitor.config.ts with environment variables..."
  node update-capacitor-config.js
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  npm install
fi

# Check if www directory exists, if not build the project
if [ ! -d "www" ] || [ -z "$(ls -A www)" ]; then
  echo "Building web assets..."
  ./node_modules/.bin/ionic build --prod
fi

echo "Adding Android platform..."
# Add Android platform (this is safe even if already added)
npx cap add android || echo "Android platform may already be added"

echo "Syncing web code to Android platform..."
# Sync the web code to the Android platform
npx cap sync android

# Check if keystore exists
if [ ! -f "my-dashboard.jks" ]; then
  echo "Warning: Keystore file not found. Building debug APK instead."
  echo "Building Android app (debug)..."
  npx cap build android
else
  echo "Building Android app (release)..."
  npx cap build android
fi

echo "Build process completed!"

# List the output files
echo "APK files generated:"
ls -la android/app/build/outputs/apk/release/