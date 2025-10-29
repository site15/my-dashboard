ionic build
keytool -genkey -v -keystore  my-dashboard.jks -alias my-dashboard -keyalg RSA -keysize 2048 -validity 10000

cd mobile
docker build -t endykaufman/ionic-capacitor .
docker run -v "$(pwd):/app" -it endykaufman/ionic-capacitor

---
- Go to your new project: cd ./mobile
- Run ionic serve within the app directory to see your app in the browser
- Run ionic capacitor add to add a native iOS or Android project using Capacitor
- Generate your app icon and splash screens using cordova-res --skip-config --copy
- Explore the Ionic docs for components, tutorials, and more: https://ion.link/docs
- Building an enterprise app? Ionic has Enterprise Support and Features:
https://ion.link/enterprise-edition