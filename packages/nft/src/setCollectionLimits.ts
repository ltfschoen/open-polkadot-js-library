import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { SetCollectionLimitsArguments } from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Set Limits for a Collection
///
/// https://docs.unique.network/reference/sdk-methods.html#overview-7
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
  // Set limits for a collection
  ////////////////////////////////////

  // https://docs.unique.network/reference/sdk-methods.html#arguments-7
  // FIXME: Cannot use this type
  // const limitsArgs: SetCollectionLimitsArguments = {
  const limitsArgs = {
    address,
    collectionId,
    limits: {
      accountTokenOwnershipLimit: 1, // max tokens one address can own
      // max is 2048
      sponsoredDataSize: 2048, // max byte size of custom token data sponsorable when tokens are minted in sponsored mode
      sponsoredDataRateLimit: 30, // qty blocks between setVariableMetadata txs in order for them to be sponsored
      tokenLimit: 50, // total amount of tokens that can be minted in this collection
      sponsorTransferTimeout: 600, // time interval in blocks of a non-privileged user transfer or the mint transaction can be sponsored
      sponsorApproveTimeout: 600, // time interval in blocks of a non-privileged user approve transaction can be sponsored
      ownerCanTransfer: false, // boolean if collection owner or admins can transfer or burn tokens owned by other non-privileged users
      ownerCanDestroy: false,
      transfersEnabled: true, // whether token transfers between users are currently enabled
    }
  };

  const result = await sdk.collection.setLimits.submitWaitResult(limitsArgs);
  console.log('result: ', result);
  const limits = result.parsed?.limits

  if (limits) {
    console.log()
    console.log(`Successfully set limits to: `, JSON.stringify(limits, null, 2))
  } else {
    console.log(`Unable to set limits`)
    process.exit()
  }

  process.exit()
}

main().catch((error) => {
  console.error(error)
})