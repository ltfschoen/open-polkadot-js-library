import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
import path from 'path';
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import { TransferArguments } from '@unique-nft/substrate-client/tokens';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Upload Multiple Files
///
/// https://docs.unique.network/reference/sdk-methods.html#upload-multiple-files
///
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

  const filename = 'cover.png';

  const PATH_FILE = path.join(__dirname, '..', 'artifacts', filename);

  const content = fs.readFileSync(PATH_FILE);
  
  const files = [
      { content: content, name: filename },
  ];
  
  const { fullUrl, cid } = await sdk.ipfs.uploadFiles({ files })

  // full url for entry on IPFS gateway
  // check the link below to see if file postfix is required (e.g. https://{ipfs_url}/{cid}/image.png)
  console.log(`url -> ${fullUrl}`);
  /** Entry CID_V0 */
  console.log(`cid: ${cid}`);

  process.exit()
}

main().catch((error) => {
  console.error(error)
})