# Interact with OpenGov to count historic votes for multiple accounts

Install [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)

Install Node.js and Lerna
```bash
nvm use
npm install --global lerna
```

Change into this subdirectory.

Obtain Coingecko API key from https://docs.coingecko.com/v3.0.1/reference/setting-up-your-api-key

Generate .env file and populate its value with the mnemonic seed of a Substrate-based account
```bash
cp .env-sample .env
```

Run the following commands in this directory:
```bash
yarn run build
yarn run bitcoin
```

View the output.
