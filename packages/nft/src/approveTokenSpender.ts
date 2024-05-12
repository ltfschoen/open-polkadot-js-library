import dotenv from "dotenv";
dotenv.config();
import Sdk, { CHAIN_CONFIG, MutationOptions, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { ApproveArguments } from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Approv Token Spender
///
/// https://docs.unique.network/reference/sdk-methods.html#other
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
  const ownerAccount = await KeyringProvider.fromMnemonic(mnemonic, keyringOptions);
  const ownerAddress = ownerAccount.address

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
  const collectionId = 827 as number
  // Coretime Token 1
  const tokenId = 1

  ////////////////////////////////////
  // Approve token spender
  ////////////////////////////////////

  const args: ApproveArguments = {
    address: ownerAddress,
    // Account address for whom token will be approved
    spender: spenderAddress,
    collectionId,
    tokenId,
    isApprove: true
  };
  const options: MutationOptions = {
    signer: ownerAccount,
  }
  const result = await sdk.token.approve.submitWaitResult(args, options);
  const { isCompleted } = result;
  // console.log('result', result)

  if (isCompleted) {
    console.log(`${spenderAddress} is the a new approved spender of token ${result.parsed?.tokenId} from collection ${result.parsed?.collectionId}`)
  } else {
    console.log(`Unable to set new approved spender`)
    process.exit()
  }

  process.exit()
}

main().catch((error) => {
  console.error(error)
})