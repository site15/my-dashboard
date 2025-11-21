import { createHash, createHmac } from 'crypto';

import { ENVIRONMENTS } from '../env';

// Properly type the function parameters instead of using any
interface TelegramUserData {
  hash?: string;
  [key: string]: string | number | undefined;
}

export const checkSignature = ({ hash, ...userData }: TelegramUserData) => {
  // create a hash of a secret that both you and Telegram know. In this case, it is your bot token
  const secretKey = createHash('sha256')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .update(ENVIRONMENTS.MY_DASHBOARD_TELEGRAM_AUTH_BOT_TOKEN!)
    .digest();

  // this is the data to be authenticated i.e. telegram user id, first_name, last_name etc.
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key]}`)
    .join('\n');

  // run a cryptographic hash function over the data to be authenticated and the secret
  const hmac = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // compare the hash that you calculate on your side (hmac) with what Telegram sends you (hash) and return the result
  return hmac === hash;
};
