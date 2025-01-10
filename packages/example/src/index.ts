require('dotenv').config();
import{ ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

if (!PRIVATE_KEY) {
  console.error("Please update values in .env file");
}

async function main () {
  const url = 'wss://westend-coretime-rpc.polkadot.io';
  const provider = new WsProvider(url);

  // Create the API and wait until ready (optional provider passed through)
  const api = await ApiPromise.create({
    provider,
  });

  // Construct the keyring after the API (crypto has an async init)
  const keyring = new Keyring({ type: 'sr25519' });

  // Add account to our keyring
  const account = keyring.addFromUri(PRIVATE_KEY);
  console.log('Added account to keyring: ', account.address);

  // https://polkadot.js.org/docs/api/examples/promise/listen-to-balance-change
  // Retrieve the initial balance. Since the call has no callback, it is simply a promise
  // that resolves to the current on-chain value
  // let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(account.address);
  let res = await api.query.system.account(account.address);
  if (!res) {
    console.log("Error retrieving balance");
  }
  let { data: { free: previousFree }, nonce: previousNonce } = JSON.parse(res.toString());
  console.log(`Balance of ${previousFree}, nonce ${previousNonce}`);

  

  process.exit()
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
