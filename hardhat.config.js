require("@nomicfoundation/hardhat-toolbox");

//require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

const OPKOVAN_PRIVATE_KEY = process.env.OPKOVAN_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    opkovan: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [OPKOVAN_PRIVATE_KEY],
    },
  },
};