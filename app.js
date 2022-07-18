const express = require("express");
const fs = require('fs');
require("dotenv").config({ path: ".env" });

const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer({dest: 'uploads/'});
const axios = require('axios');
const FormData = require('form-data');

const PINATA_BEARER = process.env.PINATA_BEARER;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload_metadata", upload.single("photo"), uploadFile);

async function uploadFile(req, res) {

  const new_animal = req.body;

  // console.log(Object.keys(req.file));

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

app.listen(3000, () => {
  console.log(`Server started...`);
});
