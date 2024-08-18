FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    android-tools-adb \
    openjdk-8-jdk \
    wget \
    && apt-get clean

RUN ln -fs /usr/share/zoneinfo/Etc/UTC /etc/localtime && dpkg-reconfigure --frontend noninteractive tzdata

RUN apt-get update && apt-get install -y watchman && apt-get clean

RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-7302050_latest.zip -O /tmp/cmdline-tools.zip \
    && mkdir -p /sdk/cmdline-tools \
    && unzip -q /tmp/cmdline-tools.zip -d /sdk/cmdline-tools \
    && rm /tmp/cmdline-tools.zip

ENV ANDROID_HOME=/sdk
ENV PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH

RUN yes | $ANDROID_HOME/cmdline-tools/cmdline-tools/bin/sdkmanager --licenses \
    && $ANDROID_HOME/cmdline-tools/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "platforms;android-29" "emulator"

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

RUN npm install -g react-native-cli

CMD ["sleep", "infinity"]