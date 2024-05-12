import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { TransferCollectionArguments } from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Transfer Collection
///
/// https://docs.unique.network/reference/sdk-methods.html#overview-12
///
/// Instructions:
///   - Change `collectionId` value to the collection id that you deployed
///   - Change `tokenId` value to the token id in that collection (initial token id is 1)
///
/// For example, in this URL, https://uniquescan.io/opal/tokens/2677/1
/// the 2677 is the `collectionId` value and `1` is the `tokenId` value.
////////////////////////////////////
async function main() {
  const mnemonic = process.env.WALLET_SEED ?? ""
  const keyringOptions: KeyringOptions = {
    /** The ss58Format to use for address encoding (defaults to 42) */
    ss58Format: CHAIN_CONFIG.quartz.ss58Prefix, // Quartz network https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fus-ws-quartz.unique.network#/settings/metadata
    /** The type of keyring to create (defaults to ed25519) */
    type: 'sr25519',
  }
  const account = await KeyringProvider.fromMnemonic(mnemonic, keyringOptions);
  const address = account.address

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.opal.restUrl, 
    signer: account,
  })
  console.log('sdk', sdk)

  ////////////////////////////////////
  // Add the collection ID and token ID below 
  ////////////////////////////////////
  const collectionId = 2677 as number
  const tokenId = 1

  ////////////////////////////////////
  // Transfer collection from collection owner
  ////////////////////////////////////
  const args: TransferCollectionArguments = {
    collectionId,
    address,
    to: address,
  };
  const txTransfer = await sdk.collection.transfer.submitWaitResult(args)

  const parsedTransfer = txTransfer.parsed

  console.log(`${parsedTransfer?.owner} is the new owner of collection ${parsedTransfer?.collectionId}`)

  const txGetCollection = await sdk.collection.get({
    collectionId,
  })
  if (txGetCollection) {
    console.log('txGetCollection: ', JSON.stringify(txGetCollection, null, 2))
    console.log(`Collection # ${txGetCollection.id} is owned by this address: ${txGetCollection.owner}`)
  } else {
    console.log(`No collection found`)
    process.exit()
  }

  process.exit()
}

main().catch((error) => {
  console.error(error)
})