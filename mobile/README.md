# Mobile App Docker Build

This directory contains the configuration for building the Android APK using Docker.

## Docker Hub Repository

The Docker image is hosted on Docker Hub:
[endykaufman/ionic-capacitor](https://hub.docker.com/repository/docker/endykaufman/ionic-capacitor/tags/latest)

## Building the Docker Image

```bash
docker build -t endykaufman/ionic-capacitor .
```

## Running the Build with Volume Mounting

To build the Android APK using Docker with volume mounting:

```bash
docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor:latest
```

## GitHub Actions Workflow

The GitHub Actions workflow automatically:
1. Builds the Docker image
2. Runs the Android build process
3. Uploads the APK files as artifacts

The APK files will be available in the GitHub Actions artifacts at:
`/app/android/app/build/outputs/apk/release/`

## Manual Build Process

1. Generate a keystore (if you don't have one):
   ```bash
   keytool -genkey -v -keystore my-dashboard.jks -keyalg RSA -keysize 2048 -storepass 12345678 -keypass 12345678 -validity 10000 -alias my-dashboard -dname "CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown"
   ```

2. Run the Docker container:
   ```bash
   docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor:latest /usr/local/bin/build-android.sh
   ```

3. The APK will be generated at:
   `android/app/build/outputs/apk/release/app-release.apk`