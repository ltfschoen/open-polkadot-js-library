import axios from 'axios';
import { SubscanPayload } from "../types";

const sleep = (delay: number) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

async function req(api_key: string, endpoint: string, method: string, payload: SubscanPayload) {
  const options = {
    method: "POST",
    url: "https://" + endpoint + "/" + method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': api_key
    },
    data: payload,
  };

  const res = await axios(options);

  // throttle to Subscan rate limits of the API key
  // as currently there is no api key to support 2 queries per second
  const DELAY = 3000; // milliseconds
  await sleep(DELAY);

  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error(`Got error response: ${res.data}`);
  }
}

async function query(api_key: string, endpoint: string, method: string, payload: SubscanPayload) {
  const response = await req(api_key, endpoint, method, payload);

  return response;
}

export {
  query,
  req,
  sleep
}
