import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { SetTransfersEnabledArguments } from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Set Transfers Enabled Flag for a Collection
///
/// https://docs.unique.network/reference/sdk-methods.html#overview-11
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
  // Set transfers enabled flag for a collection
  //////////////////////////////////// 
  const args: SetTransfersEnabledArguments = {
    address,
    collectionId,
    isEnabled: true,
  };
  
  const result = await sdk.collection.setTransfersEnabled.submitWaitResult(args);
  
  if (result.parsed?.success) {
    console.log(`Successfully set transfers enabled`)
  } else {
    console.log(`Unable to set transfers enabled`)
    process.exit()
  }

  process.exit()
}

main().catch((error) => {
  console.error(error)
})