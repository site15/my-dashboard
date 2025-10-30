# Mobile App Docker Build

## Live Demo

The web application is deployed and available at: https://site15-my-dashboard.vercel.app

## Docker Hub Repository

The Docker image is hosted on Docker Hub:
[endykaufman/ionic-capacitor](https://hub.docker.com/repository/docker/endykaufman/ionic-capacitor/tags/latest)

## Building the Docker Image

```bash
docker build -t endykaufman/ionic-capacitor .
```

## Publishing the Docker Image

To publish the Docker image to Docker Hub:

1. Login to Docker Hub:
   ```bash
   docker login
   ```

2. Tag the image with your Docker Hub username:
   ```bash
   docker tag endykaufman/ionic-capacitor
   ```

3. Push the image to Docker Hub:
   ```bash
   docker push endykaufman/ionic-capacitor:latest
   ```

For automated builds, you can also use Docker Hub's automated build feature by connecting your GitHub repository.

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

To use GitHub secrets for keystore parameters, you need to set the following secrets in your repository:
- `KEYSTORE` - Base64 encoded keystore file
- `KEYSTORE_PASSWORD` - Password for the keystore
- `KEYSTORE_ALIAS` - Alias for the keystore
- `KEYSTORE_ALIAS_PASSWORD` - Password for the keystore alias

To generate the base64 encoded keystore:
```bash
base64 my-dashboard.jks > keystore.txt
```

Then copy the contents of keystore.txt to the `KEYSTORE` secret in your GitHub repository settings.

## Manual Build Process

1. Generate a keystore (if you don't have one):
   ```bash
   keytool -genkey -v -keystore my-dashboard.jks -keyalg RSA -keysize 2048 -storepass 12345678 -keypass 12345678 -validity 10000 -alias my-dashboard -dname "CN=Ilshat Khamitov, OU=My Dashboard, O=Site15, L=Ufa, ST=Unknown, C=ru"
   ```

2. Run the Docker container:
   ```bash
   docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor:latest
   ```

3. The APK will be generated at:
   `android/app/build/outputs/apk/release/app-release.apk`

## Development

- Run `ionic serve` to see your app in the browser
- Run `ionic capacitor add` to add a native iOS or Android project using Capacitor
- Generate your app icon and splash screens using `cordova-res --skip-config --copy`
- Explore the Ionic docs for components, tutorials, and more: https://ion.link/docs
- Building an enterprise app? Ionic has Enterprise Support and Features: https://ion.link/enterprise-edition