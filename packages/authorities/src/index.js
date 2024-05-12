const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main () {
  const url = 'wss://rpc.polkadot.io';
  const provider = new WsProvider(url);

  // Create the API and wait until ready (optional provider passed through)
  const api = await ApiPromise.create({
    provider,
  });

  let authorities = await api.call.authorityDiscoveryApi.authorities();
  console.log('authorities: ', authorities.toHuman());

  process.exit()
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
