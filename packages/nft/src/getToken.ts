import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Get Token details of a Collection
///
/// https://docs.unique.network/build/sdk/tokens.html#get-token
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
    baseUrl: CHAIN_CONFIG.quartz.restUrl, 
    signer: account,
  })
  console.log('sdk', sdk)

  ////////////////////////////////////
  // Add the collection ID and token ID below 
  ////////////////////////////////////
  // const collectionId = 2691 as number
  // const tokenId = 3
  const nft = { collectionId: 827, tokenId: 1 };

  ////////////////////////////////////
  // Get token 
  ////////////////////////////////////
  const txGetToken = await sdk.token.get({
    collectionId: nft.collectionId,
    tokenId: nft.tokenId,
  })

  const { owner } = await sdk.token.owner(nft);
  console.log(`signer: ${address}, actual owner: ${owner}`)
  if (address !== owner) throw Error("The signer is not the owner");

  if (txGetToken) {
    console.log(`Token: `, JSON.stringify(txGetToken, null, 2))
    console.log(`Token # ${txGetToken.tokenId} is owned by this address: ${txGetToken.owner}`)
  } else {
    console.log(`No token found`)
    process.exit()
  }

  // Example output:
  /*
    Token:  {
      tokenId: 1,
      collectionId: 2677,
      owner: '5G7Jb5JeGV9SN9TUXLqWpxgmEt3o7bQtTNt1FMYgERTdULMf',
      attributes: {},
      image: { ipfsCid: '', fullUrl: '' },
      properties: [ { key: 'foo', value: 'bar', valueHex: '0x626172' } ],
      collection: {
        "mode": "NFT",
        "decimals": 0,
        "name": "Luke test collection",
        "description": "My test collection",
        "tokenPrefix": "TST",
        "sponsorship": null,
        "limits": {
          "accountTokenOwnershipLimit": null,
          "sponsoredDataSize": null,
          "sponsoredDataRateLimit": null,
          "tokenLimit": null,
          "sponsorTransferTimeout": null,
          "sponsorApproveTimeout": null,
          "ownerCanTransfer": null,
          "ownerCanDestroy": null,
          "transfersEnabled": true
        },
        "readOnly": false,
        "permissions": {
          "access": "Normal",
          "mintMode": false,
          "nesting": {
            "tokenOwner": false,
            "collectionAdmin": false,
            "restricted": null
          }
        },
        "id": 2677,
        "owner": "5G7Jb5JeGV9SN9TUXLqWpxgmEt3o7bQtTNt1FMYgERTdULMf",
        "properties": [],
        "flags": {
          "foreign": false,
          "erc721metadata": false
        },
        "tokenPropertyPermissions": [
          {
            "key": "foo",
            "permission": {
              "mutable": true,
              "tokenOwner": true,
              "collectionAdmin": true
            }
          }
        ]
      },
      decodingError: null
    }
   */

  process.exit()
}

main().catch((error) => {
  console.error(error)
})