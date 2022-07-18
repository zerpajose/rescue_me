# It's a Hardhat Project

Try running some of the following tasks:

```shell
npm i
npx hardhat run scripts/deploy.js
```
It'll be deployed to Optimism Kovan (testnet)
The deployed contract address will be the NFT contract we can interact with by the frontend.

Run node app
```shell
node ./app.js
```

It runs the nodejs backend API

On browser got to
```shell
localhost:3000/upload_metadata
```

This endpoint allows you to upload a photo to IPFS through Pinata IPFS pinning service

You need to configure your .env file:
```shell
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard and select the network as Rinkeby, and replace "add-the-alchemy-key-url-here" with its key url
ALCHEMY_API_KEY_URL="ALCHEMY_API_KEY_URL"

// Replace this private key with your Optimism KOVAN account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
OPKOVAN_PRIVATE_KEY="YOUR WALLET PRIVATE KEY"

// Read the docs to export your Pinata Api Key: [Docs](https://docs.pinata.cloud/pinata-api/authentication)
PINATA_BEARER="Bearer PINATA_API_KEY"
```
