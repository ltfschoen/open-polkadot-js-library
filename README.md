# Polkadot.js Library

## Setup

Install [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)

Install Node.js and Lerna
```bash
nvm use
npm install --global lerna
```

Change into a package subdirectory and follow the instructions.

```
yarn set version 4.2.2
corepack prepare yarn@v4.2.2 --activate
cd packages/<PACKAGE_NAME>
```

### Unique Network NFTs

#### Deploy and interact with NFTs

```bash
cd packages/nft
```

Run the commands mentioned in the [NFT README](./packages/nft/README.md]

### Upload to Pinata pinned IPFS CID

```bash
cd packages/nft
```

Refer to [NFT README](./packages/nft/README.md]

### Optional Modifications

Create new workspace package in frontend
```bash
cd packages && yarn create next-app mypackage
```

Add a package to frontend
```bash
yarn add dotenv
```

## Contributing

Creating a subdirectory that has a brief descriptive name that contains your Polkadot.js script(s) and includes instructions for users to follow.  
