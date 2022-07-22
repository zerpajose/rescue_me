const express = require("express");
const fs = require('fs');
require("dotenv").config({ path: ".env" });
const cors = require('cors');

const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer({dest: 'uploads/'});
const axios = require('axios');
const FormData = require('form-data');

const Web3Token = require('web3-token');

const { ethers } = require("ethers");

const { ANIMAL_CONTRACT_ADDRESS, ANIMAL_CONTRACT_ABI } = require("./constants/index");

const PINATA_BEARER = process.env.PINATA_BEARER;
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.post("/animal", upload.single("photo"), uploadFile);

async function uploadFile(req, res) {

  const token = req.headers['authorization'];

  const { address } = await Web3Token.verify(token);

  const contractOwner = await getOwner();

  if(ethers.utils.getAddress(address) !== ethers.utils.getAddress(contractOwner)){
    res.json({msg: "Not Contract Owner"});
    res.end();
  }

  const new_animal = req.body;

  const readable = fs.createReadStream(req.file.path);

  /* 
   *  Upload photo to IPFS
   */
  const data_photo = new FormData();
  data_photo.append('file', readable);
  
  const config_photo = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    headers: { 
      'Authorization': PINATA_BEARER, 
      ...data_photo.getHeaders()
    },
    data: data_photo
  };
  
  const response_photo = await axios(config_photo);

  /* 
   *  Upload metadata to IPFS
   */ 
  const data_metadata = JSON.stringify(
    {
      "image": `ipfs://${response_photo.data.IpfsHash}`,
      "name": new_animal.name,
      "attributes": [
        {
          "trait_type": "origin",
          "value": new_animal.origin
        },
        {
          "trait_type": "specie",
          "value": new_animal.specie
        },
        {
          "trait_type": "race",
          "value": new_animal.race
        },
        {
          "trait_type": "needs",
          "value": new_animal.needs
        },
        {
          "trait_type": "rehab",
          "value": new_animal.rehab
        }
      ]
    });
  
  const config_metadata = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': PINATA_BEARER
    },
    data: data_metadata
  };
  
  const response_metadata = await axios(config_metadata);
  
  res.json({IpfsHash: response_metadata.data.IpfsHash});

  fs.unlinkSync("./"+req.file.destination + req.file.filename);

  res.end();
}

app.post("/is_owner", isOwner);

async function isOwner(req, res) {

  const contractOwner = await getOwner();

  const token = req.headers['authorization'];

  const { address, body } = await Web3Token.verify(token);

  if(ethers.utils.getAddress(address) === ethers.utils.getAddress(contractOwner)){

    res.json({is_owner: true, token: token});
  }
  else{
    res.json({is_owner: false, token: token});
  }

  res.end();
}

async function getOwner(){
  
  const customHttpProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_KEY_URL);

  const animalContract = new ethers.Contract(ANIMAL_CONTRACT_ADDRESS, ANIMAL_CONTRACT_ABI, customHttpProvider);

  const contractOwner = await animalContract.owner();

  return contractOwner;
}

app.listen(3001, () => {
  console.log(`Server started at port 3001`);
});
