import dotenv from "dotenv";
dotenv.config();
import { query, req, sleep } from './lib';
import {
  CoinHistoricalChartDataByID,
  CoinHistoricalChartDataWithinTimeRangeByID,
  CoinOHLCChartByID,
  CoinHistoricalDataByID
} from './types';

// Bitcoin "usd" current price at 30-04-2024 output 63797.67963589958
async function getCoinHistoricalDataByID() {
  const id = 'bitcoin';
  const requestMethod = "GET";
  // https://docs.coingecko.com/v3.0.1/reference/coins-id-history
  const METHOD = `coins/${id}/history`;
  // https://www.epochconverter.com/
  const params: CoinHistoricalDataByID = {
    "date": "30-04-2024",
    "localization": true,
  }
  let payload: any = {};
  let res = await query(requestMethod, process.env.COINGECKO_API_KEY ?? "", process.env.ENDPOINT ?? "", METHOD, params, payload);

  return res;
}

// Outputs: No output was higher than 68k USD
async function getCoinHistoricalChartDataByID() {
  const id = 'bitcoin';
  const requestMethod = "GET";
  // https://docs.coingecko.com/v3.0.1/reference/coins-id-market-chart
  const METHOD = `coins/${id}/market_chart`;
  // https://www.epochconverter.com/
  const params: CoinHistoricalChartDataByID = {
    "vs_currency": "usd",
    "days": 10,
    "interval": "daily",
    "precision": "full", // decimal place for currency price value
  }
  let payload: any = {};
  let res = await query(requestMethod, process.env.COINGECKO_API_KEY ?? "", process.env.ENDPOINT ?? "", METHOD, params, payload);

  return res;
}

// note: between 23:00 30 Apr 2024 and 01:00 1 May 2024 the price response was 60570.49956727372
// at 1714521716031 (Wednesday, 1 May 2024 00:01:56.031)
async function getCoinHistoricalChartDataWithinTimeRangeByID() {
  // CoinGecko Public Demo API must be https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=YOUR_API_KEY
  // Coin list https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0
  // Access to historical data via the Public API (Demo plan)
  // is restricted to the past 365 days only.

  const id = 'bitcoin';
  const requestMethod = "GET";
  // https://docs.coingecko.com/v3.0.1/reference/coins-id-market-chart-range
  const METHOD = `coins/${id}/market_chart/range`;
  // https://www.epochconverter.com/
  // 30 April 2024 23:59 is 1714521540
  const params: CoinHistoricalChartDataWithinTimeRangeByID = {
    "vs_currency": "usd",
    "from": 1714521540, // starting date in UNIX epoch timestamp
    "to": 1714525200, // ending date in UNIX epoch timestamp
    "precision": "full", // decimal place for currency price value
  }
  let payload: any = {};
  let res = await query(requestMethod, process.env.COINGECKO_API_KEY ?? "", process.env.ENDPOINT ?? "", METHOD, params, payload);

  return res;
}

// BTC/USD price at price closest to 30 Apr 2024 23:59 UTC/GMT is ~60820 based on High below
//
// At 1714507200000, which is Tuesday, 30 April 2024 20:00:00 it was:
// 60793.240622539866, 60818.51838927249, 59618.457431780254, 59618.457431780254
// At 1714521600000, which is Wednesday, 1 May 2024 00:00:00 it was:
// 59130.902889366844, 60824.195413217516, 59130.902889366844, 60749.472092163865
//
// OHLC chart (Open, High, Low, Close)
async function getCoinOHLCChartByID() {
  const id = 'bitcoin';
  const requestMethod = "GET";
  // https://docs.coingecko.com/v3.0.1/reference/coins-id-ohlc
  const METHOD = `coins/${id}/ohlc`;
  // https://www.epochconverter.com/
  const params: CoinOHLCChartByID = {
    "vs_currency": "usd",
    "days": "14",
    "precision": "full",
  }
  let payload: any = {};
  let res = await query(requestMethod, process.env.COINGECKO_API_KEY ?? "", process.env.ENDPOINT ?? "", METHOD, params, payload);

  return res;
}

async function main() {
  // Note: Uncomment the API calls that you want to do from those shown below.

  // getBitcoinPriceAtTime();
  // let res = await getCoinHistoricalChartDataWithinTimeRangeByID();
  // console.log('res: ', JSON.stringify(res, null, 2));

  // let res = await getCoinOHLCChartByID();
  // console.log('res: ', JSON.stringify(res, null, 2));

  // let res = await getCoinHistoricalDataByID();
  // console.log('res: ', JSON.stringify(res, null, 2));

  let res = await getCoinHistoricalChartDataByID();
  console.log('res: ', JSON.stringify(res, null, 2));

  process.exit()
}



main().catch((error) => {
  console.error(error)
})
