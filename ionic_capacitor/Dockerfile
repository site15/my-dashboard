FROM ubuntu:22.04

LABEL MAINTAINER="Ilshat Khamitov <ilshat.m.khamitov@gmail.com>"

ARG JAVA_VERSION=21
# See https://developer.android.com/studio/index.html#command-tools
ARG ANDROID_SDK_VERSION=11076708
# See https://developer.android.com/tools/releases/build-tools
ARG ANDROID_BUILD_TOOLS_VERSION=34.0.0
# See https://developer.android.com/studio/releases/platforms
ARG ANDROID_PLATFORMS_VERSION=34
# See https://gradle.org/releases/
ARG GRADLE_VERSION=8.2.1
# See https://www.npmjs.com/package/@ionic/cli
ARG IONIC_VERSION=7.2.0
# See https://www.npmjs.com/package/@capacitor/cli
ARG CAPACITOR_VERSION=6.0.0

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=en_US.UTF-8
ENV NODE_VERSION=23.11.0
ENV PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma

WORKDIR /tmp

RUN apt-get update -q

# General packages
RUN apt-get install -qy \
    apt-utils \
    locales \
    gnupg2 \
    build-essential \
    curl \
    usbutils \
    git \
    unzip \
    p7zip p7zip-full \
    python3 \
    openjdk-${JAVA_VERSION}-jre \
    openjdk-${JAVA_VERSION}-jdk

# Set locale
RUN locale-gen en_US.UTF-8 && update-locale

# Install Gradle
ENV GRADLE_HOME=/opt/gradle
RUN mkdir $GRADLE_HOME \
    && curl -sL https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -o gradle-${GRADLE_VERSION}-bin.zip \
    && unzip -d $GRADLE_HOME gradle-${GRADLE_VERSION}-bin.zip
ENV PATH=$PATH:/opt/gradle/gradle-${GRADLE_VERSION}/bin

# Install Android SDK tools
ENV ANDROID_HOME=/opt/android-sdk
RUN curl -sL https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip -o commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip \
    && unzip commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip \
    && mkdir $ANDROID_HOME && mv cmdline-tools $ANDROID_HOME \
    && yes | $ANDROID_HOME/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME --licenses \
    && $ANDROID_HOME/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "build-tools;${ANDROID_BUILD_TOOLS_VERSION}" "platforms;android-${ANDROID_PLATFORMS_VERSION}"
ENV PATH=$PATH:${ANDROID_HOME}/cmdline-tools:${ANDROID_HOME}/platform-tools

ENV NVM_DIR=/root/.nvm

# Install NodeJS
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && ln -s $NVM_DIR/versions/node/v$NODE_VERSION/bin/node /usr/bin/node \
    && ln -s $NVM_DIR/versions/node/v$NODE_VERSION/bin/npm /usr/bin/npm \
    && ln -s $NVM_DIR/versions/node/v$NODE_VERSION/bin/npx /usr/bin/npx

# Install Ionic CLI and Capacitor CLI
RUN npm install -g @ionic/cli@${IONIC_VERSION} \
    && npm install -g @capacitor/cli@${CAPACITOR_VERSION}

# Create app directory
RUN mkdir -p /app

# Copy the build script
COPY ./build-android.sh /usr/local/bin/build-android.sh
RUN chmod +x /usr/local/bin/build-android.sh

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*

WORKDIR /app

# Default command
ENTRYPOINT ["/usr/local/bin/build-android.sh"]