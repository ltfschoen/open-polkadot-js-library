import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Set Permissions for Properties of Token in a Collection
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
    baseUrl: CHAIN_CONFIG.quartz.restUrl, 
    signer: account,
  })
  console.log('sdk', sdk)

  ////////////////////////////////////
  // Add the collection ID and token ID below 
  ////////////////////////////////////
  const collectionId = 827 as number
  const tokenId = 1

  ////////////////////////////////////
  // Set permissions for each property of a token in a collection
  ////////////////////////////////////
  // const {hash, block, blockIndex} = await sdk.collection.setPropertyPermissions.submitWaitResult
  const txSetPermissions = await sdk.collection.setPropertyPermissions.submitWaitResult({
    address,
    collectionId,
    propertyPermissions: [
      {
        // the property Key to set the permissions for
        // we then need to set a property that has that Key
        key: 'royalties',
        permission: {
          mutable: true,
          collectionAdmin: true,
          tokenOwner: true,
        },
      },
    ],
  })
  // console.log(`${block.header.number} ${blockIndex} ${hash}`)

  ////////////////////////////////////
  // Show collection permissions that were set
  ////////////////////////////////////
  const propertiesPermissions = txSetPermissions.parsed?.propertyPermissions

  if (propertiesPermissions?.length) {
    console.log(`The values of the [ ${propertiesPermissions.map((t) => t.propertyKey).join()} ] keys are set`)
  } else {
    console.log(`No property permissions were set`)
    process.exit()
  }

  console.log(`View the collection at https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`)
  console.log(`View the extrinsic tx at https://opal.subscan.io/account/${address}`)

  process.exit()
}

main().catch((error) => {
  console.error(error)
})