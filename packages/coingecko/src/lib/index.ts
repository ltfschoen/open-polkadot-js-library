import axios from 'axios';

const sleep = (delay: number) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

async function req(requestMethod: string, api_key: string, endpoint: string, method: string, params: any, payload: any) {
  const options = {
    method: requestMethod,
    url: "https://" + endpoint + "/" + method,
    headers: {
      // 'Content-Type': 'application/json',
      'accept': 'application/json',
      // 'X-API-Key': api_key,
      'x_cg_demo_api_key': api_key,
    },
    params: params,
    // data: payload,
  };

  const res = await axios(options);

  // throttle to Coingecko rate limits of the API key
  const DELAY = 3000; // milliseconds
  await sleep(DELAY);

  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error(`Got error response: ${res.data}`);
  }
}

async function query(requestMethod: string, api_key: string, endpoint: string, method: string, params: any, payload: any) {
  const response = await req(requestMethod, api_key, endpoint, method, params, payload);

  return response;
}

export {
  query,
  req,
  sleep
}
