#!/bin/bash

# Navigate to the app directory
cd /app

# Disable telemetry
npx cap telemetry off

echo "Adding Android platform..."
# Add Android platform (this is safe even if already added)
npx cap add android || echo "Android platform may already be added"

echo "Syncing web code to Android platform..."
# Sync the web code to the Android platform
npx cap sync android

echo "Building Android app..."
# Build the Android app
npx cap build android

echo "Build process completed!"