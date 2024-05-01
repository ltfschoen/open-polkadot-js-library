import dotenv from "dotenv";
dotenv.config();
import assert from 'assert';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import moment from 'moment';
import fs from 'fs';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { query, req, sleep } from './lib';
import { SubscanPayload } from './types';

async function main() {
  // obtain a Subscan API Key from https://docs.api.subscan.io/#introduction
  const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY;
  const ENDPOINT = process.env.ENDPOINT;
  const METHOD = 'api/scan/accounts';

  // fetch data
  const resAccounts = {
    "accounts": []
  };
  // it is necessary to manually check what TODO: change to 24 since we determined that pages 0 to 24 have accounts
  let maxPages = 0;
  let maxQueryData = 100;
  let payload = {
    // Subscan's current maximum query data is 100 each time
    "row": maxQueryData,
    "order": "asc",
    "page": maxPages
  };
  let resCount;
  let res1, res2;

  // initially just find out what the maxPages is so we know how many pages to loop through automatically
  res1 = await query(process.env.SUBSCAN_API_KEY ?? "", ENDPOINT ?? "", METHOD, payload);
  if (typeof resCount == 'undefined') {
    resCount = res1.data.count;
    console.log('accounts available from API: ', resCount);
    maxPages = Math.floor(resCount / maxQueryData);
  }

  console.log('tokenData', JSON.stringify(res1, null, 2));

  process.exit()
}

main().catch((error) => {
  console.error(error)
})