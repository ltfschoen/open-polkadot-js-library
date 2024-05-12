# Unique Network deploy and interact with NFT or similar

Generate .env file and populate its value with the mnemonic seed of a Substrate-based account
```bash
cp .env.example .env
```

Reference: https://docs.unique.network/build/sdk/tokens.html

* Request Opan Testnet tokens from the faucet https://t.me/unique2faucet_opal_bot
* View balance by entering address in block explorer https://uniquescan.io/opal/

Run the following commands in this directory:
```bash
yarn
yarn run build
yarn run mint
yarn run set-collection-permissions
yarn run set-token-property-permissions
yarn run set-token-properties
yarn run get-token-properties
yarn run add-tokens-to-collection
yarn run get-token
yarn run set-collection-transfers-enabled-limit
yarn run set-collection-limits
yarn run get-allowance
yarn run approve-token-spender
yarn run transfer-token
yarn run transfer-collection
yarn run burn-token
```
* Note: Mint collection fee ~2 OPL, and mint token costs ~0.1 OPL
* View the tokens minted by going to https://uniquescan.io/opal

## Unique Network Resources & Support

* Unique developer support https://t.me/unique_network_support
* View block explorer https://uniquescan.io/opal/
* Guides - https://docs.unique.network/build/sdk/collections.html
* SDK Reference Docs - https://docs.unique.network/reference
* Blog on RFTs - https://unique.network/blog/re-fungible-nfts/
* Mint next tokens in the collection - https://youtu.be/KFZ8l-r9RY0?feature=shared&t=1528

# Upload to Uniqe pinned IPFS CID

Note: Use Pinata to upload large files or to pin files since Unique Network has size restrictions and does not offer pinned IPFS files
```bash
yarn run unique-upload
```

# Upload to Pinata pinned CID

Generate .env file and populate its value with the Pinata API key and secret from https://pinata.cloud/
```bash
cp .env.example .env
```

* Convert file options
  * e.g. mp4 to gif at ezgif.com to reduce size of gif
  * convert png to svg (retain quality) - https://pixelied.com/convert/png-converter/png-to-svg
  * convert wav to mp3 - https://cloudconvert.com/wav-to-mp3
  * https://www.imagemagick.org/script/command-line-options.php
    ```bash
    brew install imagemagick
    magick input.gif -fuzz 30% -layers Optimize output.gif
    magick mogrify -debug "Cache,Blob" -verbose -identify -colors 255 -fuzz 30% -layers Optimize input.gif
    magick mogrify -debug "Cache,Blob" -fuzz 7% -layers Optimize -size 300x300 pattern:checkerboard -normalize -virtual-pixel tile \
      -distort perspective  '0,0,5,45  89,0,45,46  0,89,0,89  89,89,89,89' \
      input.gif
    ```
* Note: MP4 is not supported by Unique Network
* Best option was exporting to MP4, then converting to animated GIF with the following, as mentioned here https://askubuntu.com/questions/648603/how-to-create-an-animated-gif-from-mp4-video-via-command-line
  ```
  brew install ffmpeg
  ffmpeg -i input.mp4 output.gif
  ```

* Copy file to upload to Pinata (e.g. .gif file type) into ./packages/nft/artifacts folder
* Change metadata name postfix in ./packages/nft/src/pinata/pinataUploadIpfs.ts to make it a unique upload (e.g. `-image-cover`, `-image-preview`, `-image`, `-nft`)
  ```
  pinataMetadata: {
    name: 'nft-coretime-image-cover',
  ```

* Run:
```bash
yarn run pinata-upload
```

* View file that has been uploaded in Pinata https://app.pinata.cloud/pinmanager
