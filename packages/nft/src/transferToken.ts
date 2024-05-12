import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, MutationOptions, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import {
  TransferArguments,
} from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Transfer Token of a Collection
///
/// https://docs.unique.network/build/sdk/tokens.html#transfer-token
///
/// Instructions:
///   - Change `collectionId` value to the collection id that you deployed
///   - Change `tokenId` value to the token id in that collection (initial token id is 1)
///
/// For example, in this URL, https://uniquescan.io/quartz/tokens/827/1
/// the 827 is the `collectionId` value and `1` is the `tokenId` value.
////////////////////////////////////
async function main() {
  const mnemonic = process.env.WALLET_SEED ?? ""
  // Important: It is essential to use the correct `KeyringOptions` for the signed when initializing the SDK
  // otherwise it will say you do not have permission to transfer tokens
  // Note: Alternative approach is shown here: https://github.com/UniqueNetwork/unique_docs/issues/150
  const keyringOptions: KeyringOptions = {
    /** The ss58Format to use for address encoding (defaults to 42) */
    ss58Format: CHAIN_CONFIG.quartz.ss58Prefix, // Quartz network https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fus-ws-quartz.unique.network#/settings/metadata
    /** The type of keyring to create (defaults to ed25519) */
    type: 'sr25519',
  }
  const ownerAccount = await KeyringProvider.fromMnemonic(mnemonic, keyringOptions)
  const ownerAddress = ownerAccount.address
  console.log('ownerAddress: ' + ownerAddress)

  // Coretime Token 1
  const spenderAddress = "HTwmmHjH8ofGrHoKuJrFHciejdx4SRJw7vrqyUREDGeY7oF";

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.quartz.restUrl, 
    signer: ownerAccount,
  })
  console.log('sdk', sdk)

  ////////////////////////////////////
  // Add the collection ID and token ID below 
  ////////////////////////////////////
  const nft = {
    collectionId: 827,
    tokenId: 3
  };

  const { owner } = await sdk.token.owner(nft);
  console.log(`signer: ${ownerAddress}, actual owner: ${owner}`)
  if (ownerAddress !== owner) throw Error("The signer is not the owner");

  ////////////////////////////////////
  // Transfer token 
  //
  // To transfer a token from an owner to a new owner recipient.
  // - First approve the recipient as the spender of each token id by configuring and running `approveTokenSpender`
  //
  ////////////////////////////////////

  const argsTx: TransferArguments = {
    collectionId: nft.collectionId,
    tokenId: nft.tokenId,
    address: ownerAddress,
    to: spenderAddress,
    from: ownerAddress,
    // from: '', // optional `from` account
  };
  const options: MutationOptions = {
    signer: ownerAccount,
  }
  const txTransfer = await sdk.token.transfer.submitWaitResult(argsTx, options)

  const parsedTransfer = txTransfer.parsed

  console.log(`${parsedTransfer?.to} is the new owner of token ${parsedTransfer?.tokenId} 
    from collection ${parsedTransfer?.collectionId}`)

  const txGetToken = await sdk.token.get({
    collectionId: nft.collectionId,
    tokenId: nft.tokenId,
  })

  if (txGetToken) {
    console.log(`Token: `, txGetToken)
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
        mode: 'NFT',
        decimals: 0,
        name: 'Luke test collection',
        description: 'My test collection',
        tokenPrefix: 'TST',
        sponsorship: null,
        limits: {
          accountTokenOwnershipLimit: null,
          sponsoredDataSize: null,
          sponsoredDataRateLimit: null,
          tokenLimit: null,
          sponsorTransferTimeout: null,
          sponsorApproveTimeout: null,
          ownerCanTransfer: null,
          ownerCanDestroy: null,
          transfersEnabled: null
        },
        readOnly: false,
        permissions: { access: 'Normal', mintMode: false, nesting: [Object] },
        id: 2677,
        owner: '5G7Jb5JeGV9SN9TUXLqWpxgmEt3o7bQtTNt1FMYgERTdULMf',
        properties: [],
        flags: { foreign: false, erc721metadata: false },
        tokenPropertyPermissions: [ [Object] ]
      },
      decodingError: null
    }
   */

  process.exit()
}

main().catch((error) => {
  console.error(error)
})