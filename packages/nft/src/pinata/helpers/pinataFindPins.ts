const { IS_PROD } = require('../constants');

// Find the current Pinata IPFS hashes that are Pinned and associated with the
// nft-coretime of a given Pinata instance
const findPinsForEnv = async (pinata: any) => {
  console.log('findPinsForEnv');
  const metadataFilter = {
    keyvalues: {
      // Check the value of the key `chain` matches
      chain: {
        value: 'kusama-coretime',
        op: 'eq'
      },
      // Check the value of the key `tradition` since we do not want those that are true
      // as they are meant for a different task.
      traditional: {
        value: 'true',
        op: 'ne' // Not Equal
      }
    }
  };
  const filters = {
    status: 'pinned',
    metadata: metadataFilter
  };
  const result = await pinata.pinList(filters);

  return result;
}

export {
  findPinsForEnv
}
