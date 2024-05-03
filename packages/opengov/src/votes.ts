import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
import path from 'path';
import { query, req, sleep } from './lib';
import { AddressVotes, AddressVotesDataObj, SubscanAccountsPayload, SubscanDemocracyPayload } from './types';

const FILENAME_OUTPUT = 'output.json';
const PATH_OUTPUT_FILE = path.join(__dirname, '..', 'artifacts', FILENAME_OUTPUT);

async function getAccounts() {
  // accounts
  const METHOD = 'api/scan/accounts';
  // fetch data
  const resAccounts = {
    "accounts": []
  };
  // it is necessary to manually check what TODO: change to 24 since we determined that pages 0 to 24 have accounts
  let maxPages = 0;
  let maxQueryData = 100;
  let payload: SubscanAccountsPayload = {
    // Subscan's current maximum query data is 100 each time
    "row": maxQueryData,
    "order": "asc",
    "page": maxPages
  };
  let resCount;
  let res1;

  // initially just find out what the maxPages is so we know how many pages to loop through automatically
  // obtain a Subscan API Key from https://docs.api.subscan.io/#introduction
  res1 = await query(process.env.SUBSCAN_API_KEY ?? "", process.env.ENDPOINT ?? "", METHOD, payload);
  if (typeof resCount == 'undefined') {
    resCount = res1.data.count;
    console.log('accounts available from API: ', resCount);
    maxPages = Math.floor(resCount / maxQueryData);
  }
  console.log('account data: ', JSON.stringify(res1, null, 2));
}

async function getVotesOnReferendaV2ForAccount(account: AddressVotes) {
  // accounts
  const METHOD = 'api/scan/referenda/votes';

  // Referenda votes list(v2)
  // https://support.subscan.io/api-4224605
  //
  // finds convictionvote
  let maxPages = 0;
  let maxQueryData = 100;
  let payload: SubscanDemocracyPayload = {
    "account": account.address ?? "",
    "order": "asc",
    "page": maxPages,
    "referendum_index": null,
    // Subscan's current maximum query data is 100 each time
    "row": maxQueryData,
    "sort": null,
    "status": null,
    "valid": "valid"
  };

  let resCount;
  let res1;
  res1 = await query(process.env.SUBSCAN_API_KEY ?? "", process.env.ENDPOINT ?? "", METHOD, payload);
  if (typeof resCount == 'undefined') {
    resCount = res1.data.count;
    console.log('democracy votes v2 for account from API: ', account.address, resCount);
    maxPages = Math.floor(resCount / maxQueryData);
  }
  console.log('vote v2 data: ', JSON.stringify(res1, null, 2));

  account.voteCount = resCount;

  return account;
}

// FIXME: why is this returning 0, when two democracy votes were made?
async function getVotesOnReferendaLegacyForAccount(account: AddressVotes) {
  // accounts
  const METHOD = 'api/scan/democracy/votes';

  // Referenda votes list(legacy)
  // https://support.subscan.io/api-4224593
  //
  // finds democracyvote
  let maxPages = 0;
  let maxQueryData = 100;
  let payload: SubscanDemocracyPayload = {
    "account": account.address ?? "",
    "order": "asc",
    "page": maxPages,
    "referendum_index": null,
    // Subscan's current maximum query data is 100 each time
    "row": maxQueryData,
    "sort": null,
    "status": null,
    "valid": "valid"
  };
 
  let resCount;
  let res1;
  res1 = await query(process.env.SUBSCAN_API_KEY ?? "", process.env.ENDPOINT ?? "", METHOD, payload);
  if (typeof resCount == 'undefined') {
    resCount = res1.data.count;
    console.log('democracy votes legacy for account from API: ', account.address, resCount);
    maxPages = Math.floor(resCount / maxQueryData);
  }
  console.log('vote legacy data: ', JSON.stringify(res1, null, 2));

  account.voteCount = resCount;

  return account;
}

async function main() {
  // getAccounts();

  let allAddressVotes: AddressVotes[] = [];

  // If you only have one account, add it to .env variable `ACCOUNT`
  let addressVotes: AddressVotes[] = [{
    address: process.env.ACCOUNT ?? "",
    name: "unknown",
    voteCount: null,
  }];
  let resV2Count;
  let resLegacyCount;
  if (!addressVotes[0].address) {
    console.error("Please add an account to the .env variable ACCOUNT");
  } else {
    resV2Count = await getVotesOnReferendaV2ForAccount(addressVotes[0]);
    allAddressVotes.push(resV2Count);
    resLegacyCount = await getVotesOnReferendaLegacyForAccount(addressVotes[0]);
    allAddressVotes.push(resLegacyCount);
  }

  // If you batch export multiple accounts from Polkadot.js, rename the file to batch_exported_account.json
  // and then copy it into ./open-polkadot-js-library/packages/opengov/artifacts folder, it will 
  // load them into the array below
  const inputFilename = 'batch_exported_account.json';
  const PATH_INPUT_FILE = path.join(__dirname, '..', 'artifacts', inputFilename);
  let contentInput;
  try {
    contentInput = JSON.parse(fs.readFileSync(PATH_INPUT_FILE, 'utf8'));
  } catch (error) {
    console.log("Error reading and parsing JSON data: ", error);
    process.exit()
  }
  console.log(JSON.stringify(contentInput));
  if (!contentInput.hasOwnProperty("accounts")) {
    console.error("Missing accounts property in exported JSON file");
  }
  let account;
  const accounts = contentInput.accounts;
  if (!accounts || accounts.length === 0) {
    console.error("Please load one or more accounts in batch_exported_account.json");
  }

  for(let i = 0; i < accounts.length; i++) {
    account = accounts[i];

    // check that the address exported from Polkadot.js is an SS58 address not an EVM one (i.e. 0x prefix)
    if (!account.address.startsWith("0x")) {
      // console.log(account);
      addressVotes.push({
        address: account.address,
        name: account.name,
        voteCount: 0,
      });
    }
  }

  let latestOutputFile: AddressVotesDataObj;

  let isIncomplete = true;
  for(let i = 0; i < addressVotes.length; i++) {
    // create if not exist otherwise allow continuation
    if (fs.existsSync(PATH_OUTPUT_FILE)) {
      latestOutputFile = await readOutputFile();
      if (!latestOutputFile.hasOwnProperty("data")) {
        latestOutputFile = await initializeOutputFile()
      }
    } else {
      latestOutputFile = await initializeOutputFile()
    }

    // since the user might be continuing from an incomplete output.json file due to subscan
    // restrictions, check that the current address that we're looking to add isn't already in
    // that output.json file twice for both of the v2 and legacy api calls so they just continue
    // where they left off from the batch_exported_account.json file

    isIncomplete = latestOutputFile["data"].filter(x => x.address === addressVotes[i].address).length !== 2;
    if (isIncomplete) {
      resV2Count = await getVotesOnReferendaV2ForAccount(addressVotes[i]);
      allAddressVotes.push(resV2Count);
      latestOutputFile["data"].push(resV2Count);
      resLegacyCount = await getVotesOnReferendaLegacyForAccount(addressVotes[i]);
      latestOutputFile["data"].push(resLegacyCount);
      allAddressVotes.push(resLegacyCount);
  
      writeOutputFile(latestOutputFile)
    }
  }

  for(let i = 0; i < allAddressVotes.length; i++) {
    console.log(`name: ${allAddressVotes[i].name}; address: ${allAddressVotes[i].address}; votesCount: ${allAddressVotes[i].voteCount}\n`)
  }

  const allOutputFilename = 'output-final.json';
  const PATH_OUTPUT_FILE_ALL = path.join(__dirname, '..', 'artifacts', allOutputFilename);
  try {
    fs.writeFileSync(PATH_OUTPUT_FILE_ALL, Buffer.from(JSON.stringify(allAddressVotes)).toString(), { flag: 'w+' })
  } catch (err) {
    console.error("Unable to output to file: ", err)
  }

  process.exit()
}

async function readOutputFile() {
  let contentOutput;
  try {
    contentOutput = JSON.parse(fs.readFileSync(PATH_OUTPUT_FILE, 'utf8'));
  } catch (error) {
    console.log("Error reading and parsing JSON data of output file: ", error);
    process.exit()
  }
  return contentOutput
}

async function writeOutputFile(latestOutputFile: AddressVotesDataObj) {
  try {
    fs.writeFileSync(PATH_OUTPUT_FILE, Buffer.from(JSON.stringify(latestOutputFile)).toString(), { flag: 'w+' })
  } catch (err) {
    console.error("Unable to output to file: ", err)
  }
}

async function initializeOutputFile() {
  let latestOutputFile: AddressVotesDataObj = {
    "data": [] 
  };

  try {
    await writeOutputFile(latestOutputFile)
  } catch (err) {
    console.error("Unable to output to file: ", err)
  }

  return latestOutputFile;
}

main().catch((error) => {
  console.error(error)
})
