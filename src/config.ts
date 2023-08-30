import 'dotenv/config';

if (!(process.env.TENANT_ID && process.env.USERNAME && process.env.PASSWORD)) {
  throw new Error('Missing environment variables');
}

const tenant_id = process.env.KLARA_TENANT_ID as string;
const username = process.env.KLARA_USERNAME as string;
const password = process.env.KLARA_PASSWORD as string;

export {tenant_id, username, password};
