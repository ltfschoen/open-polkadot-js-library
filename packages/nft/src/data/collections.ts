const IMAGE = 'QmYcU4p1zjW2NbT3sQhRhDC5gaEj5weFP7tiUqvMM1pEKE';
const IMAGE_COVER = 'QmZLgjDosGZEwBZeiDMaBodP7Mh9oqTyc3ifhktSuSXZZt';
// const VIDEO = 'QmNtWtia2njH5N8bUQMWjc39hkhwMKBHQWNEd4GhRe7BwG';
const VIDEO_GIF = 'QmVVCJ5PNijaZZNJ93zZZFbRuNSf7MmhyemUyCvNCrbs1y';
const VIDEO_PREVIEW_GIF = 'QmNie4Nf5QLYqGayrCSSFTc3waSWSWbyBrtERh8nZBn5kz';

// The `urlTemplate` could start with something like the following, check which one works.
// e.g. https://gateway.pinata.cloud/ipfs/{infix}
// e.g. https://ipfs.unique.network/ipfs/{infix}
// e.g. https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}
// e.g. https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}/image.png
const collectionData = {
  // Image SVG
  image: {
    urlTemplate: `https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}`,
    ipfsCid: IMAGE,
  },
  imagePreview: {
    urlTemplate: `https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}`,
    ipfsCid: IMAGE,
  },
  //   // https://ipfs.unique.network/ipfs/QmUXVMZ9b2uaqyT4T3ExksnyebHysXUjeSPwtVjK9PHSSk/image.png
  //   urlTemplate: `https://ipfs.unique.network/ipfs/{infix}/image.png`,
  //   ipfsCid: 'QmUXVMZ9b2uaqyT4T3ExksnyebHysXUjeSPwtVjK9PHSSk', // valid IPFS CID
  //
  // Cover picture
  coverPicture: {
    urlTemplate: `https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}`,
    ipfsCid: IMAGE_COVER,
  },
  //   // https://ipfs.unique.network/ipfs/QmUisSsrD9S4qhEfrmvxfxPATVH49LU8ov5Y4MBoawaZR6/cover.png
  //   urlTemplate: `https://ipfs.unique.network/ipfs/{infix}/cover.png`,
  //   ipfsCid: 'QmUisSsrD9S4qhEfrmvxfxPATVH49LU8ov5Y4MBoawaZR6', // valid IPFS CID
  //
  // Audio `AudioDto` type
  // audio: {
  //   urlTemplate: 'https://ipfs.unique.network/ipfs/{infix}/shutter.mp3',
  //   ipfsCid: `QmZksGWqYPyGPxw7R9u2rALS2kbbjQcHKbSqEihTNgAzkw`,
  //   format: 'mp3',
  //   isLossless: false,
  // },
  // `SpatialObjectDto` type
  // spatialObject: {
  //   urlTemplate: 'https://gateway.pinata.cloud/ipfs/{infix}',
  //   format: ''
  // },
  video: {
    urlTemplate: 'https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}',
    ipfsCid: VIDEO_PREVIEW_GIF,
  },
  file: {
    // urlTemplate: 'https://gateway.pinata.cloud/ipfs/{infix}',
    urlTemplate: 'https://maroon-autonomous-horse-597.mypinata.cloud/ipfs/{infix}',
    ipfsCid: VIDEO_PREVIEW_GIF,
  },
}

export default collectionData;

