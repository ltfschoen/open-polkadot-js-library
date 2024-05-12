import dotenv from "dotenv";
dotenv.config();
import assert from 'assert';
import { BigNumber } from 'bignumber.js';
import Sdk, { CHAIN_CONFIG, TokenId } from '@unique-nft/sdk'
import { KeyringProvider } from '@unique-nft/accounts/keyring'
import {
  SetCollectionPermissionsArguments,
  CollectionAccess,
} from '@unique-nft/substrate-client/tokens';
// https://docs.unique.network/build/sdk/collections.html#create-a-collection-using-schemas
import {
  AttributeType,
  COLLECTION_SCHEMA_NAME,
  UniqueCollectionSchemaToCreate,
} from '@unique-nft/schemas'
import { collectionData, tokenData } from './data';
import { KeyringOptions } from '@polkadot/keyring/types';

////////////////////////////////////
///
/// Mint a Token in a Collection
///
/// Instructions:
///   - Change `baseUrl` to the endpoint of the chain you want to connect to
///   - Change `tokenId` value to the token id in that collection (initial token id is 1)
///
/// For example, in this URL, https://uniquescan.io/opal/tokens/2677/1
/// the 2677 is the `collectionId` value and `1` is the `tokenId` value.
////////////////////////////////////
async function main() {
  const mnemonic = process.env.WALLET_SEED ?? ""
  const keyringOptions: KeyringOptions = {
    /** The ss58Format to use for address encoding (defaults to 42) */
    ss58Format: CHAIN_CONFIG.quartz.ss58Prefix, // Quartz network https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fus-ws-quartz.unique.network#/settings/metadata
    /** The type of keyring to create (defaults to ed25519) */
    type: 'sr25519',
  }
  const account = await KeyringProvider.fromMnemonic(mnemonic, keyringOptions);
  const address = account.address

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.opal.restUrl,
    signer: account,
  })
  // console.log('sdk', sdk)

  console.log('tokenData', JSON.stringify(tokenData, null, 2));

  // FIXME: type UniqueCollectionSchemaToCreate or UniqueCollectionSchemaToCreateDto ?
  const collectionSchema = {
    schemaName: COLLECTION_SCHEMA_NAME.unique,
    schemaVersion: '1.0.0',
    image: collectionData.image,
    imagePreview: collectionData.imagePreview,
    coverPicture: collectionData.coverPicture,
    // audio: tokenData.audio,
    // spatialObject: tokenData.spatialObject,
    // VideoDto
    // /** @example https://ipfs.unique.network/ipfs/{infix}.ext */
    video: collectionData.video,
    // VideoDto
    file: collectionData.file,
    // UniqueRoyaltyPartToEncodeDto
    royaltyType: [
      {
        version: 1,
        royaltyType: 'DEFAULT', // 'DEFAULT' | 'PRIMARY_ONLY'
        decimals: 18,
        /** bigint as string */
        value: new BigNumber(0.1),
        /**
         * The ss-58 encoded address
         * @example 5G7Jb5JeGV9SN9TUXLqWpxgmEt3o7bQtTNt1FMYgERTdULMf
         */
        address:  process.env.WALLET_ADDRESS ?? "5Chai5UGBHXFrXXcHtDypVWdvHnjrny2rDtfa9RHbM3JGpCw"
      }
    ],
    attributesSchemaVersion: '1.0.0',
    attributesSchema: {
      0: {
        name: {_: 'chain-name'},
        type: AttributeType.string,
        optional: false,
        isArray: false,
        enumValues: {
          0: {_: 'kusama-coretime'},
        }
      }
    },
  }

  ////////////////////////////////////
  // Create collection
  ////////////////////////////////////

  // Note: NFT by default. Althernatively Fungible https://docs.unique.network/reference/sdk-methods.html#fungible
  const {parsed, block, blockIndex, error} = await sdk.collection.create.submitWaitResult({
    address,
    name: 'Coretime NFT collection',
    description: 'Coretime NFT collection',
    tokenPrefix: 'CTC',
    schema: collectionSchema,
    // Collection permissions
    // Optional: Token owners and collection admins are allowed to nest tokens:
    // https://docs.unique.network/reference/sdk-methods.html#arguments-8
    permissions: {
      access: CollectionAccess.Normal, // e.g. "Normal"
      mintMode: true,
      nesting: {
        tokenOwner: true,
        collectionAdmin: true,
        // You can set collection ids allowed for nesting:
        // restricted: [1] 
      },
    },
    properties: [
      {
        key: 'kusama-coretime-first-sale-blocknumber',
        value: '94879',
      },
      {
        key: 'kusama-coretime-second-sale-blocknumber',
        value: '94880',
      },
      {
        key: 'kusama-coretime-third-sale-blocknumber',
        value: '94881',
      },
      {
        key: 'kusama-coretime-first-sale-price-ksm',
        value: '5',
      },
      {
        key: 'kusama-coretime-second-sale-price-ksm',
        value: '5',
      },
      {
        key: 'kusama-coretime-third-sale-price-ksm',
        value: '5',
      },
    ],
    // Token Property permissions
    tokenPropertyPermissions: [
      {
        key: 'kusama-coretime-first-sale-blocknumber',
        permission: {
          mutable: true,
          tokenOwner: true,
          collectionAdmin: true,
        }
      },
      {
        key: 'kusama-coretime-second-sale-blocknumber',
        permission: {
          mutable: true,
          tokenOwner: true,
          collectionAdmin: true,
        }
      },
      {
        key: 'kusama-coretime-third-sale-blocknumber',
        permission: {
          mutable: true,
          tokenOwner: true,
          collectionAdmin: true,
        }
      },
      {
        key: 'kusama-coretime-first-sale-price-ksm',
        permission: {
          mutable: true,
          tokenOwner: true,
          collectionAdmin: true,
        }
      },
      {
        key: 'kusama-coretime-second-sale-price-ksm',
        permission: {
          mutable: true,
          tokenOwner: true,
          collectionAdmin: true,
        }
      },
      {
        key: 'kusama-coretime-third-sale-price-ksm',
        permission: {
          mutable: true,
          tokenOwner: true,
          collectionAdmin: true,
        }
      }
    ],
    limits: {
      accountTokenOwnershipLimit: 1000000, // max tokens one address can own
      // max is 2048
      sponsoredDataSize: 2048, // max byte size of custom token data sponsorable when tokens are minted in sponsored mode
      sponsoredDataRateLimit: 30, // qty blocks between setVariableMetadata txs in order for them to be sponsored
      tokenLimit: 1000000, // total amount of tokens that can be minted in this collection
      // this mechanism can help prevent spending funds from the sponsor's account by attacker
      // sending transactions every block. The limit counts in parachain's blocks
      sponsorTransferTimeout: 600, // time interval in blocks of a non-privileged user transfer or the mint transaction can be sponsored
      sponsorApproveTimeout: 600, // time interval in blocks of a non-privileged user approve transaction can be sponsored
      ownerCanTransfer: true, // boolean if collection owner or admins can transfer or burn tokens owned by other non-privileged users
      ownerCanDestroy: true,
      transfersEnabled: true, // whether token transfers between users are currently enabled
    }
  })
  console.log('parsed', parsed)

  if (error) throw Error("Error occurred while creating a collection");
  if (!parsed) throw Error("Cannot parse results");

  const collectionId = parsed?.collectionId as number
  console.log(`Collection created. Id: ${collectionId} at block index: ${blockIndex}, and at block: ${JSON.stringify(block)}`)
  console.log(`View this minted collection at https://uniquescan.io/opal/collections/${collectionId}`)

  const tokens = [ // array of tokens
    { // 1st token
      data: {
        // https://docs.unique.network/reference/sdk-methods.html#brief-example-39
        attributes: {
          '0': "kusama-coretime-core",
        },
        // causes error 500 if try to mint token using this even though it compiles
        // encodedAttributes: {
        //   '0': {_: "kusama-coretime-core1"},
        // },
        image: tokenData.nft1,
        name: {
          _: 'Kusama Coretime NFT Core 1',
        },
        description: {
          _: 'Kusama Coretime NFT to commemorate initial sales',
        },
      },
    },
    {
      data: {
        image: tokenData.nft1,
        name: {
          _: 'Kusama Coretime NFT Core 2',
        },
        description: {
          _: 'Kusama Coretime NFT to commemorate initial sales',
        },
      },
    },
    {
      data: {
        image: tokenData.nft1,
        name: {
          _: 'Kusama Coretime NFT Core 3',
        },
        description: {
          _: 'Kusama Coretime NFT to commemorate initial sales',
        },
      },
    },
  ];

  // https://docs.unique.network/about/limitations/limitations.html
  assert(tokens.length < 35, "The safe limit is 35 NFTs minted at once.");

  ////////////////////////////////////
  // Mint token(s)
  ////////////////////////////////////

  // const result = await sdk.token.createMultiple.submitWaitResult({
  //   address,
  //   collectionId,
  //   tokens: tokens,
  // })
  // console.log('result', result)

  // Note: Instead of doing it like above, you can get a hex-encoded payload,
  // you can use .build, as shown below
  const unsignedTxPayload = await sdk.token.createMultiple.build({
    address,
    collectionId,
    tokens: tokens,
  });
  const { signature } = await sdk.extrinsic.sign(unsignedTxPayload);
  const { hash } = await sdk.extrinsic.submit({
    signature,
    signerPayloadJSON: unsignedTxPayload.signerPayloadJSON,
  });
  const result = await sdk.extrinsic.waitResult({ hash });
  console.log('result', result)

  const mintedTokensCount = result?.parsed?.length
  let currentTokenId;
  result.parsed?.forEach((token: any, index: any) => {
    currentTokenId = token?.tokenId as number
    console.log(`Minted token ID #${currentTokenId}/${mintedTokensCount} in collection ${collectionId}`)
    console.log(`View this minted token at https://uniquescan.io/opal/tokens/${collectionId}/${currentTokenId}`)
  });

  process.exit()
}

main().catch((error) => {
  console.error(error)
})
