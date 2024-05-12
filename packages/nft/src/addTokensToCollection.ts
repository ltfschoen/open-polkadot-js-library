import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import {
  CreateMultipleTokensArguments,
} from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Add Tokens to Collection
///
/// https://docs.unique.network/reference/sdk-methods.html#overview-39
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
  const collectionId = 2697 as number
  const tokenId = 1

  ////////////////////////////////////
  // Add tokens to a collection
  ////////////////////////////////////
  const tokens = [ // array of tokens
    {
      data: {
        image: {
          urlTemplate: `https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}`,
          ipfsCid: 'QmTByhediQxwgZdnWgUkdFotnXAR3adhNLgoJyZ9dGsBEv', // animated gif
        },
        name: {
          _: 'video',
        },
        description: {
          _: 'video',
        },
      },
    },
    {
      data: {
        image: {
          // https://ipfs.unique.network/ipfs/QmUisSsrD9S4qhEfrmvxfxPATVH49LU8ov5Y4MBoawaZR6/cover.png
          urlTemplate: `https://ipfs.unique.network/ipfs/{infix}/cover.png`,
          ipfsCid: 'QmUisSsrD9S4qhEfrmvxfxPATVH49LU8ov5Y4MBoawaZR6', // valid IPFS CID
        },
        name: {
          _: 'cover',
        },
        description: {
          _: 'cover',
        },
      },
    },
    { // next
      data: {
        image: {
          // https://ipfs.unique.network/ipfs/QmUXVMZ9b2uaqyT4T3ExksnyebHysXUjeSPwtVjK9PHSSk/image.png
          urlTemplate: `https://ipfs.unique.network/ipfs/{infix}/image.png`,
          ipfsCid: 'QmUXVMZ9b2uaqyT4T3ExksnyebHysXUjeSPwtVjK9PHSSk', // valid IPFS CID
        },
        name: {
          _: 'image',
        },
        description: {
          _: 'image',
        },
      },
    },
  ];

  const args: CreateMultipleTokensArguments = {
    address,
    collectionId,
    tokens: tokens,
  };
  
  const result = await sdk.token.createMultiple.submitWaitResult(args);
  if (result) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log(`Unable to create tokens for collection`)
    process.exit()
  }

  process.exit()
}

main().catch((error) => {
  console.error(error)
})