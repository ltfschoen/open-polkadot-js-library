// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
//
// Modifications by Luke Schoen
// Original source: https://github.com/polkadot-js/apps/blob/master/scripts/ipfsUpload.js
// Modified source: https://github.com/ltfschoen/ethquad

import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
import path from 'path';
import { execute } from './helpers/execute';
import { connectToPinata } from './helpers/connectToPinata';
import { IPFS_GATEWAY } from './constants';
import { findPinsForEnv } from './helpers/pinataFindPins';

const file = process.env.FILE ?? "";
const PATH_FILE = path.join(__dirname, '..', '..', 'artifacts', file);
const WOPTS: fs.WriteFileOptions = { encoding: 'utf8', flag: 'w' };
const PATH_IPFS = path.join(__dirname, '..', '..', 'artifacts', 'build');
let pinata: any;

async function pin() {
  execute(`mkdir -p ${PATH_IPFS}`, false);
  const options = {
    pinataMetadata: {
      name: 'nft-coretime-image-gif',
      keyvalues: {
        chain: 'kusama-coretime',
        author: '@ltfschoen'
      }
    },
    pinataOptions: {
      wrapWithDirectory: false,
      cidVersion: 0
    }
  };
  console.log('Generating Pin...');

  const readableStreamForFile = fs.createReadStream(PATH_FILE, { 
    // encoding: 'base64', // No we want the .mp4 file to be uploaded
  });
  // Read and display the file data on console 
  readableStreamForFile.on('data', function (chunk) { 
    // console.log(chunk.toString()); 
  });
  readableStreamForFile.on('finish', function () { 
    console.log('finish reading file'); 
  });
  readableStreamForFile.on('error', function (error) { 
    console.error('error reading file', error);
  });

  // Note: It took about 8 mins on M2 Pro 64Gb to convert ~300mb .mp4 file
  console.log('Please wait... Note: It may take a while to generate if the file is large');
  const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
  console.log('Generated Pin with IPFS hash: ', result);
  const url = `${IPFS_GATEWAY}${result.IpfsHash}`;
  console.log('Writing files for IPFS hash');
  const filePath = `${PATH_IPFS}/pin.json`;
  // flags https://stackoverflow.com/a/50174822/3208553
  fs.writeFileSync(filePath, JSON.stringify(result), WOPTS)
  console.log(`Wrote ${filePath}`)
  console.log(`Pinned IPFS hash: ${result.IpfsHash}`);
  console.log(`Pinned IPFS hash url: ${url}`);

  return result.IpfsHash;
}

// // Unpin previous nft-coretime IPFS Hashes
// // that we are no longer using
// // Reference: https://github.com/PinataCloud/Pinata-SDK#pinlist
// async function unpin(exclude: any) {
//   console.log(`Unpinning previous nft-coretime IPFS hashes`);
//   const pinList = await findPinsForEnv(pinata);
//   console.log('Found list of IPFS hashes for kusama-coretime: ', pinList);
//   if (pinList.count > 1) {
//     const filtered = pinList.rows
//       .map(({ ipfs_pin_hash: hash }: any) => hash)
//       .filter((hash: any) => hash !== exclude);
//     console.log('Found old IPFS hashes for kusama-coretime to Unpin: ', filtered);

//     if (filtered.length) {
//       await Promise.all(
//         filtered.map((hash: any) =>
//           pinata
//             .unpin(hash)
//             .then(() => console.log(`Unpinned IPFS hash: ${hash}`))
//             .catch(console.error)
//         )
//       );
//     }
//   }
// }

/**
 * Pin and Unpin an IPFS hash based on an .mp4 3D simulation of Coretime in Pinata using Pinata SDK.
 * Reference: https://github.com/PinataCloud/Pinata-SDK
 */
async function main() {
  if (!file) {
    console.log("Please add a value for `FILE` in the .env file");
  }
  pinata = await connectToPinata();
  console.log("pinata connected");
  if (pinata) {
    const hash = await pin();
    // await unpin(hash);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
