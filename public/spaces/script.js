/* global BABYLON, solana */

async function getListedNftsByCollectionSymbol(collectionSymbol) {
  const url = `https://solana.brolab.io/api/apiProxy?url=https://api-mainnet.magiceden.dev/v2/collections/${collectionSymbol}/listings?offset=0&limit=20`;
  const response = await fetch(url, {});
  const data = await response.json();
  return data;
}

// NFT CONFIGS
const nftConfigs = [
  // 1
  {
    position: '4.38 6.55 16.35',
    rotation: '0 90 0',
  },
  {
    position: '4.38 6.55 11.35',
    rotation: '0 90 0',
  },
  {
    position: '4.05 6.15 -9.8',
    rotation: '0 90 0',
  },
  {
    position: '2.75 6.15 -15.8',
    rotation: '0 90 0',
  },
  {
    position: '4.05 6.15 -22',
    rotation: '0 90 0',
  },
  {
    position: '0.52 6.48 -25.5',
    rotation: '0 -180 0',
  },
  {
    position: '-9.42 6.05 -25.63',
    rotation: '0 -180 0',
  },
  {
    position: '-19.51 6.365 -25.48',
    rotation: '0 -180 0',
  },
  // 9
  {
    position: '-22.9 6.255 -22.09',
    rotation: '0 -90 0',
  },
  {
    position: '-21.9 6.255 -16.07',
    rotation: '0 -90 0',
  },
  {
    position: '-22.9 6.6 -9.49',
    rotation: '0 -90 0',
  },
];

function mapNftConfigsToNfts(listedNfts, nftConfigs) {
  // take random one nft and remove it from the array

  const nfts = [];
  for (let i = 0; i < nftConfigs.length; i++) {
    const nft = listedNfts.splice(
      Math.floor(Math.random() * listedNfts.length),
      1,
    )[0];
    nfts.push({
      ...nft,
      ...nftConfigs[i],
    });
  }
  return nfts;
}

function spawnNft(nft, scene) {
  const image = new BABYLON.StandardMaterial('test');
  image.diffuseTexture = new BABYLON.Texture(nft.extra.img);

  const playerPicture = BABYLON.MeshBuilder.CreatePlane('playerPicture', {
    height: 16,
    width: 13,
  });
  playerPicture.material = image;
  const [x, y, z] = nft.position.split(' ').map(parseFloat);
  const [, ry] = nft.rotation.split(' ').map(parseFloat);
  playerPicture.position.x = x;
  playerPicture.position.y = y;
  playerPicture.position.z = z;
  playerPicture.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
  playerPicture.rotation.y = BABYLON.Tools.ToRadians(ry);
  scene.onPointerObservable.add(function (evt) {
    if (evt.pickInfo.pickedMesh === playerPicture) {
      toggleModal(nft.tokenMint);
    }
  }, BABYLON.PointerEventTypes.POINTERPICK);
}

async function spawnNFTs(scene) {
  const listedNfts = await getListedNftsByCollectionSymbol(collection);
  const nfts = mapNftConfigsToNfts(listedNfts, nftConfigs);
  nfts.forEach((nft) => spawnNft(nft, scene));
  console.log(nfts);
}
