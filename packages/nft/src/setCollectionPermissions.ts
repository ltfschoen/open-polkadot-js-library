import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import {
  SetCollectionPermissionsArguments,
  CollectionAccess,
} from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Set Permissions of a Collection
///
/// https://docs.unique.network/build/sdk/tokens.html#set-token-properties
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
  // Set permissions for a collection
  ////////////////////////////////////

  // https://docs.unique.network/reference/sdk-methods.html#arguments-8
  const args: SetCollectionPermissionsArguments = {
    address,
    collectionId,
    permissions: {
      access: CollectionAccess.Normal, // e.g. "Normal" or "Whitelist"
      mintMode: false,
      nesting: {
        tokenOwner: true,
        collectionAdmin: true,
        // You can set collection ids allowed for nesting:
        restricted: [1] 
      },
    },
  }
  const txSetPermissions = await sdk.collection.setPermissions.submitWaitResult(args)

  ////////////////////////////////////
  // Show collection permissions that were set
  ////////////////////////////////////
  if (txSetPermissions) {
    console.log(`The value of the [ ${JSON.stringify(txSetPermissions, null, 2)} ] are set`)
  } else {
    console.log(`No permissions were set`)
    process.exit()
  }

  console.log(`View the collection at https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`)
  console.log(`View the extrinsic tx at https://opal.subscan.io/account/${address}`)

  process.exit()
}

main().catch((error) => {
  console.error(error)
})