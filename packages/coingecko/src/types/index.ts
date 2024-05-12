type CoinHistoricalDataByID = {
  "date": string, // dd-mm-yyyy
  "localization": boolean,
}

type CoinHistoricalChartDataByID = {
  "vs_currency": string,
  "days": number,
  "interval": string,
  "precision": string,
}

type CoinHistoricalChartDataWithinTimeRangeByID = {
  "vs_currency": string,
  "from": number, // starting date in UNIX timestamp
  "to": number, // ending date in UNIX timestamp
  "precision": string, // decimal place for currency price value
}

type CoinOHLCChartByID = {
  "vs_currency": string,
  "days": string,
  "precision": string,
}

export type {
  CoinHistoricalDataByID,
  CoinHistoricalChartDataByID,
  CoinHistoricalChartDataWithinTimeRangeByID,
  CoinOHLCChartByID,
}
