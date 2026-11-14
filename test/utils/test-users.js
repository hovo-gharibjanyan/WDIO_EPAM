
import { loadEnvFile } from 'node:process';

loadEnvFile();

export function getUserByAlias(alias) {
  const users = {
    standard_user: {
      email: process.env.STANDARD_USER_EMAIL,
      password: process.env.STANDARD_USER_PASSWORD
    }
  };

  const user = users[alias];

  if (!user) {
    throw new Error(`Unknown user alias: ${alias}`);
  }

  if (!user.email || !user.password) {
    throw new Error(
      `Missing credentials for ${alias} in .env`
    );
  }

  return user;
}
