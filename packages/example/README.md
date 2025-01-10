# Example

```bash
cd packages/example
```

## Setup Environment
Setup .env file
```bash
cp .env-sample .env
```

Add custom Substrate private key for use on Westend

### Setup Dependencies

Install [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)

Install Node.js and Lerna
```bash
nvm use
npm install --global lerna
```

Run the following commands in this directory:
```bash
yarn
```

### Build and Run
```bash
yarn run build
yarn run start
```

View the output.

#### Optional Debugging

Open in VSCode, add breakpoints, and run using "Run and Debug", choosing "Debug - Example"
