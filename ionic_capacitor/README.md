# Ionic Capacitor Docker Builder

This directory contains the Docker configuration for building the ionic-capacitor Docker image.

## Docker Hub Repository

The Docker image is hosted on Docker Hub:
[endykaufman/ionic-capacitor](https://hub.docker.com/repository/docker/endykaufman/ionic-capacitor/tags/latest)

## Community

Join our Telegram developer community for discussions, updates, and support:
- [Telegram Developer Chat](https://t.me/site15_community)

## Release Notifications

Release information and updates are automatically posted to our Telegram community chat:
- [Telegram Release Notifications](https://t.me/site15_community/3)

## Building the Docker Image

To build the Docker image locally:

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
   docker tag endykaufman/ionic-capacitor your-dockerhub-username/ionic-capacitor:latest
   ```

3. Push the image to Docker Hub:
   ```bash
   docker push your-dockerhub-username/ionic-capacitor:latest
   ```

For automated builds, you can also use Docker Hub's automated build feature by connecting your GitHub repository.

## Docker Image Details

This Docker image contains all the necessary tools and dependencies to build Ionic Capacitor Android applications:
- Ubuntu 22.04 base image
- OpenJDK 21
- Android SDK and build tools
- Node.js 24.11.1
- Ionic CLI and Capacitor CLI
- Gradle 8.2.1

The image is designed to be used with volume mounting to build Android applications in the mobile directory.

For instructions on how to use this container to build Android applications, please refer to the mobile project documentation:
- [English Documentation](../mobile/README.md)
- [Russian Documentation](../mobile/README_RU.md)