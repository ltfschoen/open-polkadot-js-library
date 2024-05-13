require('dotenv').config();
const { ApiPromise, WsProvider } = require('@polkadot/api');

// Replace with an account address that is actively nominating on Polkadot
const ACCOUNT = process.env.ACCOUNT ?? "";

async function main () {
  const url = 'wss://rpc.polkadot.io';
  const provider = new WsProvider(url);

  // Create the API and wait until ready (optional provider passed through)
  const api = await ApiPromise.create({
    provider,
  });

  // https://polkadot.js.org/docs/api/examples/promise/listen-to-balance-change

  // Retrieve the initial balance. Since the call has no callback, it is simply a promise
  // that resolves to the current on-chain value
  let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(ACCOUNT);

  console.log(`${ACCOUNT} has a balance of ${previousFree}, nonce ${previousNonce}`);

  // Here we subscribe to any balance changes and update the on-screen value
  api.query.system.account(ACCOUNT, ({ data: { free: currentFree }, nonce: currentNonce }) => {
    // Calculate the delta
    const change = currentFree.sub(previousFree);

    // Only display positive value changes (Since we are pulling `previous` above already,
    // the initial balance change will also be zero)
    if (!change.isZero()) {
      console.log(`New balance change of ${change}, nonce ${currentNonce}`);

      previousFree = currentFree;
      previousNonce = currentNonce;
    }
  });

  process.exit()
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
