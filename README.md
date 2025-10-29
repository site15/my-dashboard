# My Dashboard

## Building the Web App

```bash
ionic build
```

## Generating Keystore for Android Build

```bash
keytool -genkey -v -keystore my-dashboard.jks -alias my-dashboard -keyalg RSA -keysize 2048 -validity 10000
```

## Building Android APK with Docker

### Using Pre-built Docker Image

```bash
cd mobile
docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor:latest
```

### Building and Using Custom Docker Image

```bash
cd mobile
docker build -t endykaufman/ionic-capacitor .
docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor
```

The APK will be generated at: `mobile/android/app/build/outputs/apk/release/app-release.apk`

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow that automatically builds the Android APK and uploads it as an artifact.

## Running the Web App Locally

- Go to your project directory: `cd ./mobile`
- Run `ionic serve` within the app directory to see your app in the browser
- Run `ionic capacitor add` to add a native iOS or Android project using Capacitor
- Generate your app icon and splash screens using `cordova-res --skip-config --copy`
- Explore the Ionic docs for components, tutorials, and more: https://ion.link/docs
- Building an enterprise app? Ionic has Enterprise Support and Features: https://ion.link/enterprise-edition