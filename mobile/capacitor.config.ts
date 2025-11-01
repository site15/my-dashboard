import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.site15.MyDashboard',
  appName: 'MyDashboard',
  webDir: 'www',
  "android": {
    "buildOptions": {
      "releaseType": "APK",
      "keystorePath": "../my-dashboard.jks",
      "keystorePassword": "12345678",
      "keystoreAlias": "my-dashboard",
      "keystoreAliasPassword": "12345678"
    }
  }
};

export default config;
// fake changes