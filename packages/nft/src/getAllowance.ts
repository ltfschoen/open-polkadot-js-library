import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { TokenOwnerArguments,
  TokenOwnerResult,
} from '@unique-nft/substrate-client/tokens';
import { AllowanceArguments } from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Allowance of Token of a Collection approved to be transferred
///
/// https://docs.unique.network/reference/sdk-methods.html#token
///
/// Instructions:
///   - Change `collectionId` value to the collection id that you deployed
///   - Change `tokenId` value to the token id in that collection (initial token id is 1)
////////////////////////////////////
async function main() {
  const mnemonic = process.env.WALLET_SEED ?? ""
  const keyringOptions: KeyringOptions = {
    /** The ss58Format to use for address encoding (defaults to 42) */
    ss58Format: CHAIN_CONFIG.quartz.ss58Prefix, // Quartz network https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fus-ws-quartz.unique.network#/settings/metadata
    /** The type of keyring to create (defaults to ed25519) */
    type: 'sr25519',
  }
  const ownerAccount = await KeyringProvider.fromMnemonic(mnemonic, keyringOptions)
  const ownerAddress = ownerAccount.address
  console.log('ownerAddress: ' + ownerAddress)

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.quartz.restUrl, 
    signer: ownerAccount,
  })
  console.log('sdk', sdk)

  ////////////////////////////////////
  // Add the collection ID and token ID below 
  ////////////////////////////////////
  const collectionId = 827 as number
  // Coretime Token 1
  const tokenId = 1

  ////////////////////////////////////
  // Allowance of token approved to transfer 
  //
  ////////////////////////////////////

  const argsTokenOwner: TokenOwnerArguments = {
    collectionId: collectionId,
    tokenId: tokenId,
    // blockHashAt: '0xff19c2457fa4d7216cfad444615586c4365250e7310e2de7032ded4fcbd36873'
  };
  
  const result: TokenOwnerResult = await sdk.token.owner(
    argsTokenOwner,
  );
  console.log(`Token owner of collection #${argsTokenOwner.collectionId} / token #${argsTokenOwner.tokenId} is: `, result)

  const AllowanceArgs: AllowanceArguments = {
      from: ownerAddress,
      to: ownerAddress,
      collectionId: collectionId,
      tokenId: tokenId,
  };
  
  const { isAllowed } = await sdk.token.allowance(AllowanceArgs);
  console.log(`Allowance to transfer for #${AllowanceArgs.collectionId} / token #${AllowanceArgs.tokenId} is: `, isAllowed)

  const txGetToken = await sdk.token.get({
    collectionId,
    tokenId,
  })

  if (txGetToken) {
    console.log(`Token: `, txGetToken)
    console.log(`Token # ${txGetToken.tokenId} is owned by this address: ${txGetToken.owner}`)
  } else {
    console.log(`No token found`)
    process.exit()
  }

  process.exit()
}

main().catch((error) => {
  console.error(error)
})