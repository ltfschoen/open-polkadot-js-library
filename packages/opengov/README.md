# Interact with OpenGov to count historic votes for multiple accounts

Install [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)

Install Node.js and Lerna
```bash
nvm use
npm install --global lerna
```

Change into this subdirectory.

Generate .env file and populate its value with the mnemonic seed of a Substrate-based account
```bash
cp .env-sample .env
```

Bulk export Polkadot.js accounts and stored them in ./open-polkadot-js-library/packages/opengov/artifacts/batch_exported_account.json

Run the following commands in this directory:
```bash
yarn run build
yarn run votes
```

View the output file ./open-polkadot-js-library/packages/opengov/artifacts/output.json that shows each account and how many times they voted on OpenGov using specified extrinsics.

Copy each account with a value >0 to claim airdrop at https://app.zeitgeist.pm/claim

Note: It may be necessary to convert the SS58 Substrate address (e.g. 5xxx) into a Polkadot address. Simplest way is to just to go sub.id/5xxx and view the Polkadot address associated with it.
