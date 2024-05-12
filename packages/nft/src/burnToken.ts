import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { BurnTokenArguments } from '@unique-nft/substrate-client/tokens'
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Burn Token
///
/// https://docs.unique.network/reference/sdk-methods.html#overview-38
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
  const account = await KeyringProvider.fromMnemonic(mnemonic, keyringOptions)
  const address = account.address

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.opal.restUrl, 
    signer: account,
  })
  console.log('sdk', sdk)

  ////////////////////////////////////
  // Add the collection ID and token ID below 
  ////////////////////////////////////
  const collectionId = 2708 as number
  const tokenId = 1

  ////////////////////////////////////
  // Burn token 
  ////////////////////////////////////
  const burnItemArgs: BurnTokenArguments = {
    address,
    tokenId,
    collectionId,
  };
  const setResult = await sdk.token.burn.submitWaitResult(burnItemArgs);
  console.log('setResult', setResult)
  const parsed = setResult.parsed;
  console.log('parsed', parsed)

  if (parsed) {
    console.log(`Token: `, JSON.stringify(parsed, null, 2))
    console.log(`Token # ${parsed.tokenId} was burned`)
  } else {
    console.log(`Unable to burn token`)
    process.exit()
  }

  process.exit()
}

main().catch((error) => {
  console.error(error)
})