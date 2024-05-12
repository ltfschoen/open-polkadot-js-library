const { ApiPromise, WsProvider } = require('@polkadot/api');

// Replace with an account address that is actively nominating on Polkadot
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

async function main () {
  const url = 'wss://rpc.polkadot.io';
  const provider = new WsProvider(url);

  // Create the API and wait until ready (optional provider passed through)
  const api = await ApiPromise.create({
    provider,
  });

  const validators = await api.query.staking.nominators(ALICE);
  if (validators.toJSON() && validators.toJSON().hasOwnProperty("targets")) {
    console.log(`ALICE account ${ALICE} has nominated the following validators\n\n`,
      JSON.stringify(validators.toJSON()["targets"], null, 2));
  } else {
    console.log(`ALICE account ${ALICE} has not nominated any validators`);
  }

  process.exit()
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
