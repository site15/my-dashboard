const fs = require('fs');

// Get environment variables or use defaults
const keystorePassword = process.env.KEYSTORE_PASSWORD || '12345678';
const keystoreAlias = process.env.KEYSTORE_ALIAS || 'my-dashboard';
const keystoreAliasPassword = process.env.KEYSTORE_ALIAS_PASSWORD || '12345678';

// Read the template file
const configTemplate = `
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.site15.MyDashboard',
  appName: 'MyDashboard',
  webDir: 'www',
  "android": {
    "buildOptions": {
      "releaseType": "APK",
      "keystorePath": "../my-dashboard.jks",
      "keystorePassword": "${keystorePassword}",
      "keystoreAlias": "${keystoreAlias}",
      "keystoreAliasPassword": "${keystoreAliasPassword}"
    }
  }
};

export default config;
`;

// Write the updated config file
fs.writeFileSync('capacitor.config.ts', configTemplate.trim());
console.log('capacitor.config.ts has been updated with environment variables');